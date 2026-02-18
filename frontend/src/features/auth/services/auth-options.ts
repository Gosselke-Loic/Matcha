import { queryOptions } from "@tanstack/react-query";

import { api } from "@/api/api";
import { type User, UserSchema } from "../schemas/user-schema"; 

export const authMeOptions = queryOptions({
  queryKey: ['auth-me'],
  queryFn: () => api.get<User>('/auth/me', { schema: UserSchema }),
  staleTime: 1000 * 60 * 5,
  gcTime: 1000 * 60 * 60
});
