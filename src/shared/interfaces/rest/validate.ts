import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

type Target = 'body' | 'params' | 'query';

export default function validate(schema?: ZodSchema<any>, target: Target = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!schema) return next();

    const parsed = schema.safeParse((req as any)[target]);
    if (!parsed.success) {
      const err = new Error('VALIDATION_ERROR') as Error & { status?: number; details?: unknown };
      err.status = 400;
      err.details = parsed.error.flatten?.() ?? parsed.error;
      return next(err);
    }
    
    res.locals.validated = { ...(res.locals.validated || {}), ...parsed.data };
    next();
  };
}