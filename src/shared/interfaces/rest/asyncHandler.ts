import { Request, Response, NextFunction } from 'express';

export default function asyncHandler<ReturnValue>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<ReturnValue>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    void Promise.resolve(fn(req, res, next)).catch(next);
  };
}