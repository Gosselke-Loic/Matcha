import { z } from 'zod';

export const FORM_RULES = {
  username: z.string()
    .min(3, "Too short")
    .max(50, "Too Long")
    .regex(/^[a-zA-Z0-9]+$/, "Alphanumeric characters only"),
  password: z.string()
    .min(8, "8 characters minimum")
    .regex(/[A-Z]/, "One capital letter required")
    .regex(/[0-9]/, "One number required")
    .regex(/[@$!%*?&]/, "One special character required")
};

export const getPasswordFields = ( commonWords: Set<string> ) => ({
  password: FORM_RULES.password
    .refine((val) => !commonWords.has(val.toLowerCase()), "Password is too common"),
  confirmPassword: z.string()
});

export const isoDateTime = z
  .iso
  .datetime({ error: "Invalid ISO 8601 date format" })
  .pipe(z.coerce.date());
