import { z } from 'zod';
import { useSuspenseQuery, useQuery } from '@tanstack/react-query';
import { createFileRoute, notFound, redirect } from '@tanstack/react-router';

import ApiError from '@/api/ApiError';
import { commonWordsOptions } from '@/api/common-queries';
import { Profile } from '@/features/profile/components/Profile';
import { authMeOptions } from '@/features/auth/services/auth-options';
import { ProfileBaseForm } from '@/features/profile/components/ProfileBaseForm';
import { profileImagesQueryOptions, profileQueryOptions } from '@/features/profile/services/profile-options';

const ProfileParamsSchema = z.preprocess(
  (val) => (val === "" ? undefined : val),
  z.coerce.number().int().positive()
);

export const Route = createFileRoute('/_authenticated/profile/$userId')({
  params: {
    parse: (params) => ({
      userId: ProfileParamsSchema.parse(params.userId)
    }),
  },
  beforeLoad: async ({ context: { queryClient }, location }) => {
    const user = await queryClient.ensureQueryData(authMeOptions); 

    if (!user) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href }
      });
    };
  },
  loader: async ({ context: { queryClient }, params: { userId } }) => {
    const user = await queryClient.ensureQueryData(authMeOptions);
     
    const isOwner = user.id === userId;
    try {
      await Promise.all([
        queryClient.ensureQueryData(profileQueryOptions(userId, isOwner)),
        queryClient.ensureQueryData(profileImagesQueryOptions(userId)),
        ...(isOwner ? [queryClient.ensureQueryData(commonWordsOptions)] : [])
      ]);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        throw (notFound());
      };

      throw (error);
    };
  },
  component: ProfileComponent,
});

function ProfileComponent() {
  const { userId } = Route.useParams();

  const { data: user } = useQuery(authMeOptions); 
  const isOwner = user?.id === userId;

  const { data: images } = useSuspenseQuery(profileImagesQueryOptions(userId));
  const { data: profile } = useSuspenseQuery(profileQueryOptions(userId, isOwner));
  const { data: commonWords } = useQuery({ ...commonWordsOptions, enabled: isOwner });

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-50'>
      {('interests' in profile) ? (
        <ProfileBaseForm
          dataImages={images}
          data={profile.user}
          commonWords={commonWords}
          interests={profile.interests}
        />
      ) : (
        <Profile images={images} data={profile.user} />
      )}
    </div>
  );
};
