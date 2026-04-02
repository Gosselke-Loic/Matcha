import { z } from "zod";

const activitySchema = z.object({
  id: z.number().int().positive(),
  username: z.string(),
  fameRate: z.number(),
  profilePhoto: z.string()
});
export type ActivityData = z.infer<typeof activitySchema>;

const activityUserListSchema = z.array(activitySchema);
export type ActivityUserListData = z.infer<typeof activityUserListSchema>;

export const likersSchema = z.object({
  likers: z.array(activitySchema)
});

export const viewersSchema = z.object({
  viewers: z.array(activitySchema)
});
