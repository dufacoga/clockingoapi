const { z } = require("zod");

const zDateTime = z.string().datetime();

const createExitSchema = z.object({
  UserId: z.number().int(),
  LocationId: z.number().int(),
  ExitTime: zDateTime,
  EntryId: z.number().int(),
  Result: z.string().max(255).optional(),
  IrregularBehavior: z.boolean().optional(),
  ReviewedByAdmin: z.boolean().optional(),
  IsSynced: z.boolean().optional(),
  DeviceId: z.string().max(100).optional(),
  IsDeleted: z.boolean().optional()
});

const updateExitSchema = z.object({
  Result: z.string().max(255).optional(),
  IrregularBehavior: z.boolean().optional(),
  ReviewedByAdmin: z.boolean().optional(),
  IsSynced: z.boolean().optional(),
  DeviceId: z.string().max(100).optional(),
  IsDeleted: z.boolean().optional()
}).refine((data) => Object.keys(data).length > 0, { message: "Empty patch" });

module.exports = {
  createExitSchema,
  updateExitSchema
};