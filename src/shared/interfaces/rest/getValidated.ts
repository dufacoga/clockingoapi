import { Response } from 'express';

export function getValidated<T = unknown>(res: Response): T {
  return (res.locals?.validated ?? {}) as T;
}