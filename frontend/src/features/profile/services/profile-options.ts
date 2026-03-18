import { z } from "zod";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { api } from "@/api/api";
import {
  profileSchema,
  ownProfileSchema
} from "../schemas/profile-schema";
import { tagsSchema } from "@/shared/schemas/tag-schema";
import { imagesProfileSchema } from "../schemas/images-schema";
import { profileImagesKeys, profileKeys } from "@/shared/constants/query-keys";

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
  queryKey: profileKeys.detail(userId),
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

export const profileImagesQueryOptions = (
  userId: number
) => queryOptions({
  queryKey: profileImagesKeys.detail(userId),
  queryFn: async () => api.get(`/users/${userId}/images`, imagesProfileSchema),
  placeholderData: keepPreviousData,
  staleTime: 1000 * 60 * 5,
  gcTime: 1000 * 60 * 60
});
