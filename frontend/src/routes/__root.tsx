import {
  Outlet,
  createRootRouteWithContext,
} from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import type { useAuthStore } from '@/features/auth/store/auth-store';
import { GeneralError } from '@/components/error-components/GeneralError'; 

interface MyRouterContext {
  queryClient: QueryClient;
  authStore: typeof useAuthStore;
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
  errorComponent: GeneralError,
  notFoundComponent: () => <div> To do, write a component </div>
});
