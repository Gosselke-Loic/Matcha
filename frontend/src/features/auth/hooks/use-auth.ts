import { useMutation , useQueryClient } from '@tanstack/react-query';

import { authApi } from '../services/auth-service';
import { authMeOptions } from '../services/auth-options'; 
import { authMeKeys } from '@/shared/constants/query-keys';

export const useAuth = () => {
  const queryClient = useQueryClient();

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
    onSuccess: (data) => {
      // The first one makes it possible to see the data immediatly
      queryClient.setQueryData(authMeOptions.queryKey, data);
      // Second for security and test token
      queryClient.invalidateQueries({ queryKey: authMeOptions.queryKey });
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
      queryClient.setQueryData(authMeKeys.all, null);
      queryClient.removeQueries();
      // toast success
      // navigate({ to: "/login" }); call navigate in the component
    }
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSettled: () => {
      // toast success
      // navigate({ to: '/login' }) call navigate in the component
    }
  });
  
  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      // toast success
      // navigate({ to: '/login' }); call navigate in the component
    }
  });

  return {
    login: loginMutation,
    logout: logoutMutation,
    register: registerMutation,
    resetPassword: resetPasswordMutation,
    forgotPassword: forgotPasswordMutation,
  };
};
