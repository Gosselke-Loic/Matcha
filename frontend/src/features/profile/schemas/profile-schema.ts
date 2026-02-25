import { z } from 'zod';

import {
  FORM_RULES,
  isoDateTime,
  getPasswordFields
} from '@/schemas/common';

const profileBaseSchema = z.object({
  username: FORM_RULES.username,
  firstName: FORM_RULES.username,
  lastName: FORM_RULES.username,
  biography: z.string().max(500).nullable(),
  birthdayDate: isoDateTime,
  fameRate: z.int().positive(),
  interests: z.array(z.string()),
  gender: z.enum(['male', 'female', 'non-binary']),
  // photos: z.array(z.url())
});

export const profileSchema = profileBaseSchema.extend({
  lastSeen: z.coerce.date(),
  distance: z.number().optional(),
});

export const ownProfileSchema = profileBaseSchema.extend({
  email: z.email(),
  // location: To do
  sex_pref:z.enum(['heterosexual', 'gay', 'lesbian', 'bisexual']), 
});
export const updateOwnProfileSchema = ownProfileSchema.partial();

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
