import type { Request, Response, NextFunction } from 'express';

export default function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
}
