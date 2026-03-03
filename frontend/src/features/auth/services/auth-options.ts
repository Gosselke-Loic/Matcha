import { queryOptions } from "@tanstack/react-query";

import { api } from "@/api/api";
import { userSchema } from "../schemas/user-schema"; 

export const authMeOptions = queryOptions({
  queryKey: ['auth-me'],
  queryFn: async () => api.get('/auth/me', userSchema),
  staleTime: 1000 * 60 * 5,
  gcTime: 1000 * 60 * 60
});
