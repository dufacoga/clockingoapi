const { z } = require("zod");

const toInt = (v) => (typeof v === "string" && v.trim() !== "" ? Number(v) : v);

const idParamSchema = z.object({
  id: z.preprocess(toInt, z.number().int().positive())
});

const userIdParamSchema = z.object({
  userId: z.preprocess(toInt, z.number().int().positive())
});

const entryIdParamSchema = z.object({
  entryId: z.preprocess(toInt, z.number().int().positive())
});

const codeParamSchema = z.object({
  code: z.string().min(1)
});

const usernameParamSchema = z.object({
  username: z.string().min(1)
});

const paginationQuerySchema = z.object({
  page: z.preprocess(toInt, z.number().int().min(1)).optional(),
  pageSize: z.preprocess(toInt, z.number().int().min(1).max(200)).optional()
});

module.exports = {
  idParamSchema,
  userIdParamSchema,
  entryIdParamSchema,
  codeParamSchema,
  usernameParamSchema,
  paginationQuerySchema
};