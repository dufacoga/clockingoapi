import { z } from 'zod';

const zDateTime = z.string().datetime({ message: 'Debe ser un datetime válido en formato ISO8601' });

export const createEntrySchema = z.object({
  UserId: z.number().int(),
  LocationId: z.number().int(),
  EntryTime: zDateTime,
  Selfie: z.string().optional(),
  IsSynced: z.boolean().optional(),
  DeviceId: z.string().max(100).optional(),
  IsDeleted: z.boolean().optional(),
});

export type CreateEntryDTO = z.infer<typeof createEntrySchema>;

export const updateEntrySchema = z
  .object({
    UserId: z.number().int().optional(),
    LocationId: z.number().int().optional(),
    EntryTime: zDateTime.optional(),
    Selfie: z.string().optional(),
    IsSynced: z.boolean().optional(),
    DeviceId: z.string().max(100).optional(),
    IsDeleted: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Empty patch',
  });

export type UpdateEntryDTO = z.infer<typeof updateEntrySchema>;