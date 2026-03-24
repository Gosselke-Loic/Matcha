import { z } from 'zod';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, notFound } from '@tanstack/react-router';

import ApiError from '@/api/ApiError';
import Profile from '@/features/profile/components/Profile';
import { authMeOptions } from '@/features/auth/services/auth-options';
import ProfileBaseForm from '@/features/profile/components/ProfileBaseForm';
import { profileQueryOptions } from '@/features/profile/services/profile-options';

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
  loader: async ({ context: { queryClient }, params: { userId } }) => {
    const user = await queryClient.ensureQueryData(authMeOptions);
     
    const isOwner = user.id === userId;
    try {
      await queryClient.ensureQueryData(profileQueryOptions(userId, isOwner));
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

  const { data: user } = useSuspenseQuery(authMeOptions); 
  const isOwner = user.id === userId;

  const { data: profile } = useSuspenseQuery(profileQueryOptions(userId, isOwner));

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-50'>
      {('interests' in profile) ? (
        <ProfileBaseForm
          data={profile.user}
          interests={profile.interests}
        />
      ) : (
        <Profile data={profile.user} />
      )}
    </div>
  );
};
