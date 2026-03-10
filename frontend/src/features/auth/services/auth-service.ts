import { z } from 'zod';

import { api } from "@/api/api"; 
import { userSchema } from "../schemas/user-schema"; 
import {
  loginSchema,
  type RegisterFormData,
  type ResetPasswordFormData
} from "../schemas/auth-schema";

type ResetPasswordPayload = ResetPasswordFormData & {token: string };

export const authApi = {
  login: (credentials: z.infer<typeof loginSchema>) => {
    return (api.post("/auth/login", credentials, userSchema ));
  },
  logout: () => {
    return (api.post("/auth/logout", {}, z.void()));
  },
  register: (data: RegisterFormData) => {
    const { confirmPassword, birthday, ...payload } = data;
    return (api.post(
      "/auth/register",
      {
        ...payload,
        birthday: birthday.toISOString().split('T')[0]
      },
      z.void()
    ));
  },
  forgotPassword: (email: string) => {
    return (api.post(
      'auth/forgot-password',
      { email: email },
      z.void()
    ));
  },
  resetPassword: (data: ResetPasswordPayload) => {
    const { confirmPassword, ...payload } = data;
    return (api.post(
      'auth/reset-password',
      payload,
      z.void()
    ));
  }
};
