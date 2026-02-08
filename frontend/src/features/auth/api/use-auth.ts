import { useNavigate } from "@tanstack/react-router";
import { useMutation , useQueryClient } from "@tanstack/react-query";

import { api } from "@/api/api";
import type { User } from "../schemas/user-schema";
import { useAuthStore } from "../store/auth-store";
import type { LoginFormData } from "../schemas/login-schema"; 

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setAuth);
  const logoutUser = useAuthStore((state) => state.logout);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginFormData) =>
      await api.post<User>("/auth/login", credentials),
    onSuccess: (res) => {
      setUser(res.data);
      navigate({ to: "/" });
    }
  });

  const logoutMutation = useMutation({
    mutationFn: async () => await api.post("/auth/logout", {}),
    onSettled: () => {
      logoutUser();
      queryClient.clear();
      navigate({ to: "/login" });
    }
  });

  return {
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    error: loginMutation.error
  };
};
