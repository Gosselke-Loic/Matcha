import { z } from "zod";

export const tagSchema = z.object({
  id: z.string(),
  label: z.string()
});
export const tagsSchema = z.array(tagSchema);

export type Tag = z.infer<typeof tagSchema>;
export type Tags = z.infer<typeof tagsSchema>;
