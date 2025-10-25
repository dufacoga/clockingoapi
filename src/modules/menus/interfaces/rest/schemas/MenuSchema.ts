import { z } from 'zod';

export const createMenuSchema = z.object({
  NameEs: z.string().min(1),
  NameEn: z.string().min(1),
  ParentId: z.union([z.number().int().positive(), z.null()]).optional(),
  Level: z.number().int().min(1).optional(),
  DisplayOrder: z.number().int().min(0).optional(),
});

export const updateMenuSchema = z.object({
  NameEs: z.string().min(1).optional(),
  NameEn: z.string().min(1).optional(),
  ParentId: z.union([z.number().int().positive(), z.null()]).optional(),
  Level: z.number().int().min(1).optional(),
  DisplayOrder: z.number().int().min(0).optional(),
});

export const assignMenusToRoleSchema = z.object({
  MenuIds: z.array(z.number().int().positive()).max(200),
});

export type CreateMenuDTO = z.infer<typeof createMenuSchema>;
export type UpdateMenuDTO = z.infer<typeof updateMenuSchema>;
export type AssignMenusToRoleDTO = z.infer<typeof assignMenusToRoleSchema>;
