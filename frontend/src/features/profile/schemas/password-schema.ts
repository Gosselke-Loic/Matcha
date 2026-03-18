import { z } from "zod";

import { getPasswordFields } from "@/shared/schemas/common"; 

export const createProfilePasswordFormSchema = (commonWords: Set<string>) =>
  z.object({
    oldPassword: z.string().min(1, "Required"),
    ...getPasswordFields(commonWords)
  }).refine((data) => data.password === data.confirmPassword, {
    message: "The passwords do not match",
    path: ['confirmPassword']
  });
type ProfilePasswordFormValues = ReturnType<typeof createProfilePasswordFormSchema>;
export type ProfilePasswordFormData = z.infer<ProfilePasswordFormValues>;
