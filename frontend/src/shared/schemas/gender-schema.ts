import { z } from "zod";

export const genderEnum = z.enum(['male', 'female', 'non-binary']);
export type GenderEnum = z.infer<typeof genderEnum>;
