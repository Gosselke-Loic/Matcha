import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { profileApi } from "../services/profile-service";
import { authMeOptions } from "@/features/auth/services/auth-options";

export const useProfile = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: (res) => {
      console.log(res);
      // toast
      queryClient.invalidateQueries({ queryKey: authMeOptions.queryKey });
    }
  });

  const updatePasswordProfileMutation = useMutation({
    mutationFn: profileApi.updatePasswordProfile,
    onSuccess: (res) => {
      console.log(res);
      // toast
      logout.mutate();
    }
  });

  const deleteImageProfileMutation = useMutation({
    mutationFn: profileApi.deleteImageProfile,
    onSuccess: (res) => {
      console.log(res);
      // toast
      // invalidate query
    },
  });

  const setMainImageProfileMutation = useMutation({
    mutationFn: profileApi.setMainImageProfile,
    onSuccess: (res) => {
      console.log(res);
      // toast
      // invalidate query
    }
  });

  const uploadImagesProfileMutation = useMutation({
    mutationFn: profileApi.uploadImagesProfile,
    onSuccess: (res) => {
      console.log(res);
      // toast
      // invalidate query
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
