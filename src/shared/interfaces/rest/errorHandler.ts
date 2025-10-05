import { Request, Response, NextFunction } from 'express';

type AppError = Error & { status?: number; stack?: string };

export default function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = err.status ?? 500;

  const payload: Record<string, unknown> = {
    error: err.message ?? 'INTERNAL_ERROR',
  };

  if (process.env.NODE_ENV !== 'production' && err.stack) {
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
}