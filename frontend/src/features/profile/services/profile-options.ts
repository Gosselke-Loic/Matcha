import { queryOptions } from "@tanstack/react-query";

import { api } from "@/api/api";
import {
  profileSchema,
  ownProfileSchema
} from "../schemas/profile-schema";

export const profileQueryOptions = (
  userId: number,
  isOwner: boolean
) => queryOptions({
  queryKey: ['profile', userId, { isOwner }],
  queryFn: async ()  => api.get(
    `/users/${userId}`,
    isOwner ? ownProfileSchema : profileSchema
  ),
  staleTime: 1000 * 60 * 5,
  gcTime: 1000 * 60 * 60
});
