import { api } from "@/api/api"; 
import {
  type User,
  UserSchema
} from "../schemas/user-schema"; 
import {
  LoginSchema,
  type LoginFormData,
  type RegisterFormData
} from "../schemas/auth-schema";

type ResetPasswordPayload = {
  token: string,
  password: string,
  confirmPassword: string
};

export const authApi = {
  login: (credentials: LoginFormData) => {
    return (api.post<User>("/auth/login", credentials, { schema: UserSchema }));
  },
  logout: () => {
    return (api.post("/auth/logout", {}));
  },
  register: (data: RegisterFormData) => {
    const { confirmPassword, ...payload } = data;
    return (api.post<LoginFormData>(
      "/auth/register",
      payload,
      { schema: LoginSchema }
    ));
  },
  forgotPassword: (email: string) => {
    return (api.post('auth/forgot-password', { email: email }));
  },
  resetPassword: (data: ResetPasswordPayload) => {
    const { confirmPassword, ...payload } = data;
    return (api.post('auth/reset-password', payload));
  }
};
