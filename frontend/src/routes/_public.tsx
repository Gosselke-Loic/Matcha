import {
  Outlet,
  redirect,
  createFileRoute,
} from "@tanstack/react-router";

import PublicSpinner from "@shared/components/spinner/PublicSpinner";
import { GeneralError } from "@shared/components/errors/GeneralError";
import PageTransition from "@shared/components/transition/PageTransition";

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
