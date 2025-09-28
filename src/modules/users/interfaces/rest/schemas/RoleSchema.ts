import { z } from 'zod';

export const createRoleSchema = z.object({
  Name: z.string().min(1).max(50),
});

export type CreateRoleDTO = z.infer<typeof createRoleSchema>;