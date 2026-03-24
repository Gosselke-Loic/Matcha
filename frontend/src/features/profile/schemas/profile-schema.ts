import { z } from 'zod';

import {
  FORM_RULES,
  optionalZodType,
} from '@shared/schemas/common';
import { imageSchema } from './images-schema';
import { genderEnum } from '@/shared/schemas/gender-schema';
import { sexPrefsEnum } from '@/shared/schemas/sex_prefs-schema';

const profileBaseSchema = z.object({
  id: z.number().int().positive(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  biography: z.string().nullable(),
  birthdayDate: z.coerce.date(),
  fameRate: z.number(),
  interests: z.array(z.number().int().positive()),
  gender: z.string(),
  city: z.string()
});


export const profileSchema = profileBaseSchema.extend({
  lastSeen: z.coerce.date(),
  images: z.array(imageSchema)
});
export type ProfileData = z.infer<typeof profileSchema>;

// Maybe lat and lon are not necessary, just address is enough
export const ownProfileSchema = profileBaseSchema.extend({
  email: z.string(),
  address: z.string(),
  lat: z.number(),
  lon: z.number(),
  sex_pref: z.string()
});
export type OwnProfileData = z.infer<typeof ownProfileSchema>;


const validationOwnProfileSchema = z.object({
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
  interests: z.array(z.number().int().positive())
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
  city: optionalZodType(
    z.string().min(1)
  ),
  gender: genderEnum,
  sex_pref: sexPrefsEnum
});
export const updateOwnProfileSchema = validationOwnProfileSchema.partial().refine(
  (data) => {
    if (data.address && data.address.length > 0) {
      return (data.lat !== undefined
        && data.lon !== undefined
        && data.city !== undefined
      );
    };

    return (true);
  },
  {
    message: "Please, select a valid location",
    path: ["address"]
  }
);
export type UpdateOwnProfileData = z.infer<typeof updateOwnProfileSchema>;
