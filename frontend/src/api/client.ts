import { ZodError } from "zod";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

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
  if (typeof window !== 'undefined'
    && !window.location.pathname.includes('/login')) {
    window.location.href = '/login'; // enforce redirection only if not on /login route yet
  };
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && [401, 403].includes(error.status)) {
          return (false);
        };
        return (failureCount < 1);
      }
    }
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (error instanceof ApiError && error.status === 401) {
        clearSession(queryClient);
      } else if (query.state.data !== undefined) {
        // taost.error(`Refresh failed: ${parseErrorMassage(error)}`)
        console.error('QueryCache catch error: ', error);
      };
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {      
      if (error instanceof ApiError && error.status === 401) {
        clearSession(queryClient);
      } else {
        // toast.error(parseErrorMessage(error));
        console.error('Mutation cache catch error: ', error);
      }
    }
  })
});
