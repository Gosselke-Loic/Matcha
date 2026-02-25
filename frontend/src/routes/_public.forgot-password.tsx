import { createFileRoute } from '@tanstack/react-router';

import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';

export const Route = createFileRoute('/_public/forgot-password')({
  component: () => {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-50'>
        <ForgotPasswordForm />
      </div>
    );
  }
});
