const { z } = require("zod");

const createLocationSchema = z.object({
  Code: z.string().min(1),
  Address: z.string().optional().nullable(),
  City: z.string().optional().nullable(),
  CreatedBy: z.number().int(),
  IsCompanyOffice: z.boolean().optional(),
  IsDeleted: z.boolean().optional()
});

const updateLocationSchema = z.object({
  Code: z.string().min(1).optional(),
  Address: z.string().optional().nullable(),
  City: z.string().optional().nullable(),
  CreatedBy: z.number().int().optional(),
  IsCompanyOffice: z.boolean().optional(),
  IsDeleted: z.boolean().optional()
}).refine((data) => Object.keys(data).length > 0, { message: "Empty patch" });

module.exports = {
  createLocationSchema,
  updateLocationSchema
};