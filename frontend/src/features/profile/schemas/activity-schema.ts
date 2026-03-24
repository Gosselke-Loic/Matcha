import { z } from "zod";

const activitySchema = z.object({
  id: z.number().int().positive(),
  username: z.string(),
  fameRate: z.number(),
});
export type ActivityData = z.infer<typeof activitySchema>;

export const likersSchema = z.object({
  likers: z.array(activitySchema)
});
export type LikersData = z.infer<typeof likersSchema>;

export const viewersSchema = z.object({
  viewers: z.array(activitySchema)
});
export type ViewersData = z.infer<typeof viewersSchema>;
