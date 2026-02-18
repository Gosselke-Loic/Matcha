import {
  Outlet,
  redirect,
  createFileRoute,
} from "@tanstack/react-router";

import ApiError from "@/api/ApiError"; 
import { GeneralError } from "@/components/errors/GeneralError"; 
import { authMeOptions } from "@/features/auth/services/auth-options"; 

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    const { queryClient, authStore } = context;
    const { setAuth } = authStore.getState();

    try {
      const res = await queryClient.ensureQueryData(authMeOptions);
      setAuth(res.data);

      return (res.data);
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
      <nav>
        
      </nav>
      <main className="animate-in fade-in duration-300">
        <Outlet />
      </main>
    </>
  )
});
