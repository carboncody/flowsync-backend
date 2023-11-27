import { z } from 'zod';

export const UserEntity = z.object({
  sub: z.string(),
  email: z.string(),
  exp: z.number(),
});

export type UserEntity = z.infer<typeof UserEntity>;
