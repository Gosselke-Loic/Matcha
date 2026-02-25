import {
  Outlet,
  redirect,
  createFileRoute,
} from "@tanstack/react-router";

import PublicSpinner from "@/components/spinner/PublicSpinner";
import { GeneralError } from "@/components/errors/GeneralError";
import PageTransition from "@/components/transition/PageTransition"; 

export const Route = createFileRoute('/_public')({
  beforeLoad: async ({ context }) => {
    const { authStore } = context;
    const { isAuthenticated } = authStore.getState();

    if ( isAuthenticated ) {
      throw redirect({
        to: '/',
        replace: true
      });
    }
  },
  errorComponent: GeneralError,
  component: () => (
    <>
      <PageTransition>
        <Outlet />
      </PageTransition>
    </>
  ),
  pendingComponent: PublicSpinner,
  pendingMs: 500
});
