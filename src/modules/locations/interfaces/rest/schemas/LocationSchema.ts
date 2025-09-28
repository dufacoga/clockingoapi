import { z } from 'zod';

export const createLocationSchema = z.object({
  Code: z.string().min(1),
  Address: z.string().optional().nullable(),
  City: z.string().optional().nullable(),
  CreatedBy: z.number().int(),
  IsCompanyOffice: z.boolean().optional(),
  IsDeleted: z.boolean().optional(),
});

export type CreateLocationDTO = z.infer<typeof createLocationSchema>;

export const updateLocationSchema = z
  .object({
    Code: z.string().min(1).optional(),
    Address: z.string().optional().nullable(),
    City: z.string().optional().nullable(),
    CreatedBy: z.number().int().optional(),
    IsCompanyOffice: z.boolean().optional(),
    IsDeleted: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Empty patch',
  });

export type UpdateLocationDTO = z.infer<typeof updateLocationSchema>;