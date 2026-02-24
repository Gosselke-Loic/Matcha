import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.email(),
  // remove email and primary photo
});
