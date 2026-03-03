import { z } from 'zod';

export const userSchema = z.object({
  id: z.number().positive(),
  username: z.string(),
  is_complete: z.boolean(),
  // To do primary photo
});
export type UserData = z.infer<typeof userSchema>;
