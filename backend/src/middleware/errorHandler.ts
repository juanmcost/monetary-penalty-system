import type { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error('THERES AN ERROR', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
}
