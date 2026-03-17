import { z } from 'zod'; 
import { createFileRoute } from '@tanstack/react-router';

import { LoginForm } from '@/features/auth/components/LoginForm'; 

const loginSearchSchema = z.object({
  redirect: z.string().optional().catch('/'),
});

export const Route = createFileRoute('/_public/login')({
  validateSearch: (search) => loginSearchSchema.parse(search),
  component: () => {
    const { redirect } = Route.useSearch();
  
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-50'>
        <LoginForm redirectTo={redirect} />
      </div>
    );
  },
});
