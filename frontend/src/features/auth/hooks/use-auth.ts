import { useNavigate } from "@tanstack/react-router";
import { useMutation , useQueryClient } from "@tanstack/react-query";

import { authApi } from "../services/auth-service";
import { useAuthStore } from "../store/auth-store";

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setAuth);
  const logoutUser = useAuthStore((state) => state.logout);

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (res) => {
      console.log(res);
      // to do, toast message success and message redirect to login
      // send mail to verify new account
    },
    onError: (error) => {
      console.error("regiterMutation error: ", error.message);
      // check if error form else throw
      // to do, toast error message
    }
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (res) => {
      setUser(res.data);
      //navigate({ to: "/" }); Better navigate on loginForm
    },
    onError: (error) => {
      console.error("loginMutation error: ", error.message);
      // check if error form else throw
      // to do, toast error message
    }
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      logoutUser();
      queryClient.clear();
      // toast success
      navigate({ to: "/login" });
    }
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSettled: () => {
      // toast success
      navigate({ to: '/login' }) // Provisoire
    }
  });
  
  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
    // To do
  });

  return {
    login: loginMutation,
    logout: logoutMutation,
    register: registerMutation,
    resetPassword: resetPasswordMutation,
    forgotPassword: forgotPasswordMutation,
  };
};
