import {
  Outlet,
  createRootRouteWithContext,
} from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import GlobalSpinner from '@shared/components/spinner/GlobalSpinner'; 
import { GeneralError } from '@shared/components/errors/GeneralError'; 

interface MyRouterContext {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <GlobalSpinner />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
  errorComponent: GeneralError
});
