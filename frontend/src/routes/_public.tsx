import {
  Outlet,
  redirect,
  createFileRoute,
} from "@tanstack/react-router";

import { GeneralError } from "@/components/errors/GeneralError";

export const Route = createFileRoute('/_public')({
  beforeLoad: async ({ context, location }) => {
    const { authStore } = context;
    const { isAuthenticated } = authStore.getState();

    if ( isAuthenticated ) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href }
      });
    }
  },
  errorComponent: GeneralError,
  component: () => (
    <>
      <main className="animate-in fade-in duration-300">
        <Outlet />
      </main>
    </>
  )
});
