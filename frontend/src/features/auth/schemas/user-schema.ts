import { z } from 'zod';

export const userSchema = z.object({
  id: z.number().positive(),
  username: z.string(),
  isComplete: z.boolean(),
  profilePhoto: z.string(),
  age: z.coerce.date(),
  fameRate: z.number()
});
export type UserData = z.infer<typeof userSchema>;
