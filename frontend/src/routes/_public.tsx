import {
  Outlet,
  redirect,
  createFileRoute,
} from "@tanstack/react-router";

import PublicSpinner from "@shared/components/spinner/PublicSpinner";
import { GeneralError } from "@shared/components/errors/GeneralError";
import { authMeOptions } from "@/features/auth/services/auth-options";
import PageTransition from "@shared/components/transition/PageTransition";

export const Route = createFileRoute('/_public')({
  beforeLoad: async ({ context: { queryClient } }) => {
    try {
      const user = await queryClient.ensureQueryData(authMeOptions)
      if (user) {
        throw redirect({
          to: '/',
          replace: true
        });
      };
    } catch (error) {
      return ;
    };
  },
  errorComponent: GeneralError,
  pendingComponent: PublicSpinner,
  pendingMs: 500,
  component: () => (
    <>
      <PageTransition>
        <Outlet />
      </PageTransition>
    </>
  ),
  notFoundComponent: () => {
    <div className='min-h-screen flex items-center justify-center bg-slate-50'>
      { /* Not Found component */ }
    </div>
  }
});
