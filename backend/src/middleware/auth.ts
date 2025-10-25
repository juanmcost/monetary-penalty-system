import { Request, Response, NextFunction } from 'express';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.oidc && req.oidc.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'User not authenticated' });
};