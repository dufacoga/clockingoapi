const { z } = require("zod");

const zDateTime = z.string().datetime();

const createEntrySchema = z.object({
  UserId: z.number().int(),
  LocationId: z.number().int(),
  EntryTime: zDateTime,
  Selfie: z.string().optional(),
  IsSynced: z.boolean().optional(),
  DeviceId: z.string().max(100).optional(),
  IsDeleted: z.boolean().optional()
});

const updateEntrySchema = z.object({
  UserId: z.number().int().optional(),
  LocationId: z.number().int().optional(),
  EntryTime: zDateTime.optional(),
  Selfie: z.string().optional(),
  IsSynced: z.boolean().optional(),
  DeviceId: z.string().max(100).optional(),
  IsDeleted: z.boolean().optional()
}).refine((data) => Object.keys(data).length > 0, { message: "Empty patch" });

module.exports = {
  createEntrySchema,
  updateEntrySchema
};