import { z } from 'zod';

import {
  FORM_RULES,
  isoDateTime,
  getPasswordFields
} from '@shared/schemas/common';
import { tagsSchema } from '@/shared/schemas/tag-schema';

// make interests tag schema in shared
const profileBaseSchema = z.object({
  username: FORM_RULES.username,
  firstName: FORM_RULES.username,
  lastName: FORM_RULES.username,
  biography: z.string().max(300),
  birthdayDate: isoDateTime,
  fameRate: z.int().positive(),
  interests: tagsSchema,
  gender: z.enum([':male', 'female', 'non-binary'], "Please select a valid gender")
  // photos: z.array(z.url())
});

export const profileSchema = profileBaseSchema.extend({
  lastSeen: z.coerce.date(),
  distance: z.number().optional(),
});
export type ProfileData = z.infer<typeof profileSchema>;

export const ownProfileSchema = profileBaseSchema.extend({
  email: z.email(),
  biography: z.string()
  .trim()
  .min(1, "Biography is required")
  .min(10, "Tell a little more about yourself")
  .max(500, "500 characters maximum"),
  interests: tagsSchema
    .min(3, "Minimum of 3 tags required")
    .max(6, "Maximum of 6 tags allowed"),
  // location: To do
  sex_pref:z.enum(['heterosexual', 'gay', 'lesbian', 'bisexual']), 
});
export const updateOwnProfileSchema = ownProfileSchema.partial();
export type OwnProfileData = z.infer<typeof ownProfileSchema>;

export const createProfilePasswordFormSchema = (commonWords: Set<string>) =>
  z.object({
    oldPassword: z.string().min(1, "Required"),
    ...getPasswordFields(commonWords)
  }).refine((data) => data.password === data.confirmPassword, {
    message: "The passwords do not match",
    path: ['confirmPassword']
  });
type ProfilePasswordFormValues = ReturnType<typeof createProfilePasswordFormSchema>;
export type profilePasswordFormData = z.infer<ProfilePasswordFormValues>;
