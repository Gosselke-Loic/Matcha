import { ZodError } from "zod";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

import { router } from "@/main"; 
import ApiError from "./ApiError";
import { useAuthStore } from "@/features/auth/store/auth-store";

function parseErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof ZodError) return error.message;

  return ('Unexpected error occured');
};

const clearSession = (queryClient: QueryClient) => {
  useAuthStore.getState().setUnauth();
  queryClient.clear();
  if (router.state.location.pathname === '/login') {
    router.navigate({ to: '/login', replace: true });
  };
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status < 500) return (false);
        return (failureCount < 1);
      }
    }
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof ApiError && error.status === 401) {
        clearSession(queryClient);
        return ;
      };

      if (error instanceof ApiError && [400, 403, 409].includes(error.status)) {
        // taost.error(`Refresh failed: ${parseErrorMassage(error)}`)
      };
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {      
      if (error instanceof ApiError && error.status === 401) {
        clearSession(queryClient);
      } else {
        // toast.error(parseErrorMessage(error));
      };
    }
  })
});
