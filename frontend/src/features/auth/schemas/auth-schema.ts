import { z } from 'zod';

const AUTH_RULES = {
  username: z.string()
    .min(3, "Too short")
    .max(20, "Too Long")
    .regex(/^[a-zA-Z0-9]+$/, "Alphanumeric characters only"),
  password: z.string()
    .min(8, "8 characters minimum")
    .regex(/[A-Z]/, "One capital letter required")
    .regex(/[0-9]/, "One number required")
    .regex(/[@$!%*?&]/, "One special character required")
};

const getPasswordFields = ( commonWords: Set<string> ) => ({
  password: AUTH_RULES.password
    .refine((val) => !commonWords.has(val.toLowerCase()), "Password too common"),
  confirmPassword: z.string()
});

export const LoginSchema = z.object({
  username: AUTH_RULES.username,
  password: z.string().min(1, "Required")
});
export type LoginFormData = z.infer<typeof LoginSchema>;

export const createRegisterSchema = (commonWords: Set<string>) =>
  z.object({
    username: AUTH_RULES.username,
    email: z.email("Invalid email"),
    firstName: AUTH_RULES.username,
    lastName: AUTH_RULES.username,
    ...getPasswordFields(commonWords)
  }).refine((data) => data.password === data.confirmPassword, {
    message: "The passwords do not match",
    path: ['confirmPassword']
  });
type RegisterSchemaValue = ReturnType<typeof createRegisterSchema>;
export type RegisterFormData = z.infer<RegisterSchemaValue>;

export const ForgotPasswordSchema = z.object({
  email: z.email("Invalid email")
});
export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;

export const createResetPasswordSchema = (commonWords: Set<string>) =>
  z.object({
    ...getPasswordFields(commonWords)
  }).refine((data) => data.password === data.confirmPassword, {
    message: "The passwords do not match",
    path: ['confirmPassword']
  });
type ResetPasswordSchemaValue = ReturnType<typeof createResetPasswordSchema>;
export type ResetPasswordFormData = z.infer<ResetPasswordSchemaValue>;
