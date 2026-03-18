import { useMutation, useQueryClient } from "@tanstack/react-query";

import { profileApi } from "../services/profile-service";
import type { UpdateOwnProfileData } from "../schemas/profile-schema";
import { authMeKeys, profileImagesKeys, profileKeys } from "@/shared/constants/query-keys";

export const useProfile = () => {
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateOwnProfileData & { userId: number }) => {
      const { userId, ...payload } = data;
      return (profileApi.updateProfile(payload));
    },
    onSuccess: (res, variables) => {
      const { userId } = variables;
      console.log(res);
      // toast
      queryClient.invalidateQueries({ queryKey: profileKeys.detail(userId) });
      queryClient.invalidateQueries({ queryKey: authMeKeys.all });
    }
  });

  const updatePasswordProfileMutation = useMutation({
    mutationFn: profileApi.updatePasswordProfile,
    onSuccess: (res) => {
      console.log(res);
      queryClient.clear();
      // toast
    }
  });

  const deleteImageProfileMutation = useMutation({
    mutationFn: profileApi.deleteImageProfile,
    onSuccess: (res) => {
      console.log(res);
      // toast
    },
  });

  const setMainImageProfileMutation = useMutation({
    mutationFn: profileApi.setMainImageProfile,
    onSuccess: (res) => {
      console.log(res);
      // toast
      // invalidate query profile
      queryClient.invalidateQueries({ queryKey: authMeKeys.all });
    }
  });

  const uploadImagesProfileMutation = useMutation({
    mutationFn: (data: FormData & { userId: number }) => {
      const { userId, ...payload } = data;
      return (profileApi.uploadImagesProfile(payload));
    },
    onSuccess: (res, variables) => {
      const { userId } = variables;
      console.log(res);
      // toast
      queryClient.invalidateQueries({ queryKey: profileImagesKeys.detail(userId) });
      queryClient.invalidateQueries({ queryKey: authMeKeys.all });
    }
  });

  return ({
    updateProfile: updateProfileMutation,
    deleteImage: deleteImageProfileMutation,
    uploadImages: uploadImagesProfileMutation,
    setMainImage: setMainImageProfileMutation,
    updatePasswordProfile: updatePasswordProfileMutation
  });
};
