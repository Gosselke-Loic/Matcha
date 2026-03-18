import { z } from "zod";
import { api } from "@/api/api";
import type { UpdateOwnProfileData } from "../schemas/profile-schema";
import type { ProfilePasswordFormData } from "../schemas/password-schema";

type UpdatePasswordProfileType = Omit<ProfilePasswordFormData, "confirmPassword">;

export const profileApi = {
  updateProfile : (data: UpdateOwnProfileData) => {
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
