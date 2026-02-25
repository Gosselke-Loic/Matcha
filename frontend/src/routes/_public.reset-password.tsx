import { z } from 'zod';
import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';

import { commonWordsOptions } from '@/api/common-queries'; 
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';

const resetPasswordSearchSchema = z.object({
  token: z.string()
});

export const Route = createFileRoute('/_public/reset-password')({
  validateSearch: (search) => resetPasswordSearchSchema.parse(search),
  loader: async({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(commonWordsOptions);
  },
  component: () => {
    const { token } = Route.useSearch();
    const { data : commonWords } = useSuspenseQuery(commonWordsOptions);
    
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-50'>
        <ResetPasswordForm commonWords={commonWords} token={token} />
      </div>
    );
  },
  pendingComponent: () => {}, // To do
  pendingMs: 300
});
