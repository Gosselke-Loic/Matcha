import { z } from 'zod'; 
import {
  createFileRoute,
  redirect as routerRedirect
} from '@tanstack/react-router';

import { LoginForm } from '@/features/auth/components/LoginForm'; 

const loginSearchSchema = z.object({
  redirect: z.string().optional().catch('/'),
});

export const Route = createFileRoute('/_public/login')({
  validateSearch: (search) => loginSearchSchema.parse(search),
  beforeLoad({ search , context }) {
    const { authStore } = context;

    const isAuthenticated = authStore.getState().isAuthenticated;
    if (isAuthenticated) {
      throw routerRedirect({ to: search.redirect || '/' });
    };
  },
  component: () => {
    const { redirect } = Route.useSearch();
  
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-50'>
        <LoginForm redirectTo={redirect} />
      </div>
    );
  },
});
