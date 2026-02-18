import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid Email"),
  password: z.string().min(8, "8 characters minimun")
});

export type LoginFormData = z.infer<typeof loginSchema>;
