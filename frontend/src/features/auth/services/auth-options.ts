import { queryOptions } from "@tanstack/react-query";

import { api } from "@/api/api";
import { userSchema } from "../schemas/user-schema"; 
import { authMeKeys } from "@/shared/constants/query-keys";

export const authMeOptions = queryOptions({
  queryKey: authMeKeys.all,
  queryFn: async () => api.get('/auth/me', userSchema),
  staleTime: 1000 * 60 * 30,
  gcTime: 1000 * 60 * 60
});
