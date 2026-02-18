import { redirect, createFileRoute } from '@tanstack/react-router';

import { RegisterForm } from '@/features/auth/components/RegisterForm';

export const Route = createFileRoute('/_public/register')({
  beforeLoad({ context }) {
    const { authStore } = context;

    const isAuthenticated = authStore.getState().isAuthenticated;
    if (isAuthenticated) {
      throw redirect({ to: '/' });
    };
  },
  loader: async() => {
    const { default: words } = await import('../assets/data/common-words.json');

    return ({ commonWords: new Set(words) });
  },
  component: () => {
    const { commonWords } = Route.useLoaderData();
    
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-50'>
        <RegisterForm commonWords={ commonWords }/>
      </div>
    );
  },
  pendingComponent: () => {}, // To do
  pendingMs: 300
});
