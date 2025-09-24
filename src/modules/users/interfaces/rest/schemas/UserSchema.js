const { z } = require("zod");

const createUserSchema = z.object({
  Name: z.string().min(1).max(100),
  Phone: z.string().max(20).optional().nullable(),
  Username: z.string().min(1).max(50),
  AuthToken: z.string().min(1).max(255),
  RoleId: z.number().int(),
  IsDeleted: z.boolean().optional()
});

const updateUserSchema = z.object({
  Name: z.string().min(1).max(100).optional(),
  Phone: z.string().max(20).optional().nullable(),
  Username: z.string().min(1).max(50).optional(),
  AuthToken: z.string().min(1).max(255).optional(),
  RoleId: z.number().int().optional(),
  IsDeleted: z.boolean().optional()
}).refine((data) => Object.keys(data).length > 0, { message: "Empty patch" });

module.exports = {
  createUserSchema,
  updateUserSchema
};