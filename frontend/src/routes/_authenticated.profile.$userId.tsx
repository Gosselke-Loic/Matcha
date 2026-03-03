import { z } from 'zod';
import { useSuspenseQuery, useQuery } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';

import { commonWordsOptions } from '@/api/common-queries';
import { Profile } from '@/features/profile/components/Profile';
import { ProfileBaseForm } from '@/features/profile/components/ProfileBaseForm';
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
  beforeLoad: ({ context, location }) => {
    const { user } = context.authStore.getState();

    if (!user) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href }
      })
    };
  },
  loader: async ({ context: { authStore, queryClient }, params: { userId } }) => {
    const isOwner = authStore.getState().user?.id === userId; 

    try {
      await Promise.all([
        queryClient.ensureQueryData(profileQueryOptions(userId, isOwner)),
        ...(isOwner ? [queryClient.ensureQueryData(commonWordsOptions)] : [])
      ]);
    } catch (error) {
      
    };
  },
  component: ProfileComponent,
});

function ProfileComponent() {
  const { userId } = Route.useParams();
  const { authStore } = Route.useRouteContext();

  const user = authStore((state) => state.user); 
  const isOwner = user?.id === userId;

  const { data: profile } = useSuspenseQuery(profileQueryOptions(userId, isOwner));
  const { data: commonWords } = useQuery({ ...commonWordsOptions, enabled: isOwner });

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-50'>
      {('email' in profile) ? (
        <ProfileBaseForm data={profile} commonWords={commonWords} />
      ) : (
        <Profile data={profile} />
      )}
    </div>
  )
};
