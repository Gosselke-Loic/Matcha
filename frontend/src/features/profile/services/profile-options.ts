import { z } from "zod";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { api } from "@/api/api";
import {
  profileSchema,
  ownProfileSchema
} from "../schemas/profile-schema";
import { tagsSchema } from "@/shared/schemas/tag-schema";

const ownProfileResponseSchema = z.object({
  interests: tagsSchema,
  user: ownProfileSchema
});

const profileResponseSchema = z.object({
  user: profileSchema
});

export const profileQueryOptions = (
  userId: number,
  isOwner: boolean
) => queryOptions({
  queryKey: ['profile', userId, { isOwner }],
  queryFn: async ()  => {
    if (isOwner) {
      return (api.get(`/users/${userId}`, ownProfileResponseSchema));
    };

    return (api.get(`/users/${userId}`, profileResponseSchema));
  },
  placeholderData: keepPreviousData,
  staleTime: 1000 * 60 * 5,
  gcTime: 1000 * 60 * 60
});
