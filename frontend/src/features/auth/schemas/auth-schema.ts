import { z } from 'zod';

import {
  FORM_RULES,
  getPasswordFields
} from '@shared/schemas/common';

export const loginSchema = z.object({
  username: FORM_RULES.username,
  password: z.string().min(1, "Required")
});
export type LoginData = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email("Invalid email")
});
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>; 

export const createRegisterSchema = (commonWords: Set<string>) =>
  z.object({
    username: FORM_RULES.username,
    email: z.email("Invalid email"),
    firstName: FORM_RULES.username,
    lastName: FORM_RULES.username,
    birthday: z.coerce.date({ error: "Invalid date" }),
    ...getPasswordFields(commonWords)
  }).refine((data) => data.password === data.confirmPassword, {
    message: "The passwords do not match",
    path: ['confirmPassword']
  });
type RegisterFormValues = ReturnType<typeof createRegisterSchema>;
export type RegisterFormData = z.infer<RegisterFormValues>;

export const createResetPasswordSchema = (commonWords: Set<string>) =>
  z.object({
    ...getPasswordFields(commonWords)
  }).refine((data) => data.password === data.confirmPassword, {
    message: "The passwords do not match",
    path: ['confirmPassword']
  });
type ResetPasswordFormValues = ReturnType<typeof createResetPasswordSchema>;
export type ResetPasswordFormData = z.infer<ResetPasswordFormValues>;
