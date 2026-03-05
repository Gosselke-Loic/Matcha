import { z } from 'zod';

import {
  FORM_RULES,
  isoDateTime,
  optionalZodType,
  getPasswordFields
} from '@shared/schemas/common';
import { tagsSchema } from '@/shared/schemas/tag-schema';

const profileBaseSchema = z.object({
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  biography: z.string().nullable(),
  birthdayDate: isoDateTime,
  fameRate: z.number().nullable(),
  interests: tagsSchema,
  gender: z.enum(['male', 'female', 'non-binary'])
  // photos: z.array(z.url())
});

export const profileSchema = profileBaseSchema.extend({
  lastSeen: z.coerce.date(),
  distance: z.number().optional(), // maybe change to just city or country
});
export type ProfileData = z.infer<typeof profileSchema>;

export const ownProfileSchema = profileBaseSchema.extend({
  username: optionalZodType(
    FORM_RULES.username
  ),
  firstName: optionalZodType(
    FORM_RULES.username
  ),
  lastName: optionalZodType(
    FORM_RULES.username
  ),
  email: optionalZodType(
    z.email({ error: "Invalid email" })
  ),
  biography: optionalZodType(
    z.string()
    .trim()
    .min(1, "Biography is required")
    .min(10, "Tell a little more about yourself")
    .max(500, "500 characters maximum")
  ),
  interests: tagsSchema
    .min(3, "Minimum of 3 tags required")
    .max(6, "Maximum of 6 tags allowed"),
  address: optionalZodType(
    z.string().min(3, "Address is too short")
  ),
  lat: optionalZodType(
    z.number().min(-90).max(90)
  ),
  lon: optionalZodType(
    z.number().min(-180).max(180)
  ),
  gender: z.enum(['male', 'female', 'non-binary'], "Please select a valid gender"),
  sex_pref: z.enum(['heterosexual', 'gay', 'lesbian', 'bisexual']), 
});
export const updateOwnProfileSchema = ownProfileSchema.partial().refine(
  (data) => {
    if (data.address && data.address.length > 0) {
      return (data.lat !== undefined && data.lon !== undefined);
    };

    return (true);
  },
  {
    message: "Please, select a valid location",
    path: ["address"]
  }
);
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
