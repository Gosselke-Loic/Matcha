import { z } from "zod";
import { api } from "@/api/api";
import { updateOwnProfileSchema } from "../schemas/profile-schema";
import type { profilePasswordFormData } from "../schemas/password-schema";

type UpdateOwnProfileType = z.infer<typeof updateOwnProfileSchema>;
type UpdatePasswordProfileType = Omit<profilePasswordFormData, "confirmPassword">;

export const profileApi = {
  updateProfile : (data: UpdateOwnProfileType) => {
    return (api.patch("/users/me", data, z.void()));
  },
  updatePasswordProfile: (data: UpdatePasswordProfileType) => {
    return (api.patch("/users/me", data, z.void()));
  },
  uploadImagesProfile: (formData: FormData) => {
    return (api.uploadImages("/users/me/images", formData, z.void()));
  },
  deleteImageProfile: (imageId: number) => {
    return (api.delete(`/users/me/images/${imageId}`, z.void() ));
  },
  setMainImageProfile: (imageId: number) => {
    return (api.patch(`/users/me/images/${imageId}`, { primary: true }, z.void()));    
  }
};
