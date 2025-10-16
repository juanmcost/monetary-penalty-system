import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({ include: { penalties: true } });
  res.json(users);
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email } = req.body;
    const user = await prisma.user.create({ data: { name, email } });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

export default router;
