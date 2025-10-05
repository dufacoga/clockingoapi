import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

type Target = 'body' | 'params' | 'query';

interface RequestTargetMap {
  body: Request['body'];
  params: Request['params'];
  query: Request['query'];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

type ResponseWithValidated = Response & {
  locals: Response['locals'] & { validated?: Record<string, unknown> };
};

export default function validate<Output extends Record<string, unknown>>(
  schema?: ZodSchema<Output>,
  target: Target = 'body'
) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!schema) return next();

    const parsed = schema.safeParse(req[target as keyof RequestTargetMap]);
    if (!parsed.success) {
      const err = new Error('VALIDATION_ERROR') as Error & { status?: number; details?: unknown };
      err.status = 400;
      err.details = parsed.error.flatten?.() ?? parsed.error;
      return next(err);
    }

    const response = res as ResponseWithValidated;
    const existing = isRecord(response.locals.validated) ? response.locals.validated : {};
    Reflect.set(response.locals, 'validated', { ...existing, ...parsed.data });
    next();
  };
}