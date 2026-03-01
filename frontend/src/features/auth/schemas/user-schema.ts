import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  is_complete: z.boolean(),
  // To do primary photo
});
export type userData = z.infer<typeof userSchema>;
