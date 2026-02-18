import { z } from 'zod';
import { createFileRoute } from '@tanstack/react-router';
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';

const resetPasswordSearchSchema = z.object({
  token: z.string()
});

export const Route = createFileRoute('/_public/reset-password')({
  validateSearch: (search) => resetPasswordSearchSchema.parse(search), 
  loader: async() => {
    const { default: words } = await import('../assets/data/common-words.json');

    return ({ commonWords: new Set(words) });
  },
  component: () => {
    const { token } = Route.useSearch();
    const { commonWords } = Route.useLoaderData();
    
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-50'>
        <ResetPasswordForm commonWords={commonWords} token={token} />
      </div>
    );
  },
  pendingComponent: () => {}, // To do
  pendingMs: 300
});
