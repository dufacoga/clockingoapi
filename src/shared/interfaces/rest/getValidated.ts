import { Response } from 'express';

export function getValidated<T = any>(res: Response): T {
  return (res.locals?.validated ?? {}) as T;
}