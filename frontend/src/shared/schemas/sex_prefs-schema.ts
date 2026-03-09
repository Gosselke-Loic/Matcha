import { z } from "zod";

export const sexPrefsEnum = z.enum(['heterosexual', 'gay', 'lesbian', 'bisexual']);
export type SexPrefsEnum = z.infer<typeof sexPrefsEnum>;
