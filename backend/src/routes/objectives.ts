import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const objectives = await prisma.objective.findMany({ include: { user: true } });
  res.json(objectives);
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount, userId, name, description, deadline } = req.body;
    const objective = await prisma.objective.create({ data: { user: { connect: { id: userId } }, amount, name, description, deadline } });
    res.status(201).json(objective);
  } catch (err) {
    next(err);
  }
});

export default router;
