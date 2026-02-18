import {
  Outlet,
  createRootRouteWithContext,
} from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import GlobalSpinner from '@/components/spinner/GlobalSpinner'; 
import { GeneralError } from '@/components/errors/GeneralError'; 
import type { useAuthStore } from '@/features/auth/store/auth-store';

interface MyRouterContext {
  queryClient: QueryClient;
  authStore: typeof useAuthStore;
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <GlobalSpinner />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
  errorComponent: GeneralError,
  notFoundComponent: () => <div> To do, write a component </div>
});
