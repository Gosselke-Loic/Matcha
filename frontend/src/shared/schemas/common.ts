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

export const optionalZodType = <S extends z.ZodType>(schema: S) =>
  z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) {
      return undefined
    };

    if (schema instanceof z.ZodNumber && typeof val === "string") {
      const parsed = parseFloat(val);
      return (isNaN(parsed) ? val : parsed);  
    };

    return (val);
  }, schema.optional());
