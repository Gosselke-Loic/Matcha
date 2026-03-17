import {
  Outlet,
  redirect,
  createFileRoute,
} from "@tanstack/react-router";

import ApiError from "@/api/ApiError";
import { GeneralError } from "@shared/components/errors/GeneralError";
import { authMeOptions } from "@/features/auth/services/auth-options";
import PageTransition from "@shared/components/transition/PageTransition";

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context: { queryClient }, location }) => {
    try {
      const user = await queryClient.ensureQueryData(authMeOptions);

      if (!user) {        
        throw redirect({
          to: '/login',
          search: { redirect: location.href }
        });
      };
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        throw redirect({
          to: '/login',
          search: { redirect: location.href }
        });
      };

      throw error;
    };
  },
  pendingComponent: () => <div> Replace for a custom component here </div>,
  pendingMs: 500,
  errorComponent: GeneralError,
  component: () => (
    <>
      <nav></nav>
      <PageTransition>
        <Outlet />
      </PageTransition>
    </>
  ),
  notFoundComponent: () => {
    <>
      <nav></nav>
      <div className='min-h-screen flex items-center justify-center bg-slate-50'>
        { /* Not Found component */ }
      </div>
    </>
  }
});
