import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const penalties = await prisma.penalty.findMany({ include: { user: true } });
  res.json(penalties);
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount, reason, userId } = req.body;
    const penalty = await prisma.penalty.create({ data: { amount, reason, userId } });
    res.status(201).json(penalty);
  } catch (err) {
    next(err);
  }
});

export default router;
