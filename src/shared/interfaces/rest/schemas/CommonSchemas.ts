import { z } from 'zod';

const toInt = (v: unknown) =>
  typeof v === 'string' && v.trim() !== '' ? Number(v) : v;

export const idParamSchema = z.object({
  id: z.preprocess(toInt, z.number().int().positive())
});

export const userIdParamSchema = z.object({
  userId: z.preprocess(toInt, z.number().int().positive())
});

export const entryIdParamSchema = z.object({
  entryId: z.preprocess(toInt, z.number().int().positive())
});

export const codeParamSchema = z.object({
  code: z.string().min(1)
});

export const usernameParamSchema = z.object({
  username: z.string().min(1)
});

export const paginationQuerySchema = z.object({
  page: z.preprocess(toInt, z.number().int().min(1)).optional(),
  pageSize: z.preprocess(toInt, z.number().int().min(1).max(200)).optional()
});

export type IdParam = z.infer<typeof idParamSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
export type EntryIdParam = z.infer<typeof entryIdParamSchema>;
export type CodeParam = z.infer<typeof codeParamSchema>;
export type UsernameParam = z.infer<typeof usernameParamSchema>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;