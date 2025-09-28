import { Request, Response, NextFunction } from 'express';

export default function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = err.status || 500;

  const payload: Record<string, any> = {
    error: err.message || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {})
  };

  res.status(status).json(payload);
}