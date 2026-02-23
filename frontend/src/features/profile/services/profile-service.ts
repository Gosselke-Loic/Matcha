import { z } from "zod";
import { api } from "@/api/api";
import {
  updateOwnProfileSchema,
  type profilePasswordFormData
} from "../schemas/profile-schema";

type UpdateOwnProfileType = z.infer<typeof updateOwnProfileSchema>;
type UpdatePasswordProfileType = Omit<profilePasswordFormData, "confirmPassword">;

export const profileApi = {
  updateProfile : (data: UpdateOwnProfileType) => {
    return (api.patch("/users/me", data, z.void()));
  },
  updatePasswordProfile: (data: UpdatePasswordProfileType) => {
    return (api.patch("/users/me", data, z.void()));
  }
};
