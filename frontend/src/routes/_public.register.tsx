import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { commonWordsOptions } from '@/api/common-queries';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export const Route = createFileRoute('/_public/register')({
  loader: async({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(commonWordsOptions);
  },
  component: () => {
    const { data: commonWords } = useSuspenseQuery(commonWordsOptions);
    
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-50'>
        <RegisterForm commonWords={ commonWords }/>
      </div>
    );
  },
  pendingComponent: () => {}, // To do
  pendingMs: 300
});
