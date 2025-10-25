import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import pkg from 'express-openid-connect';
const { requiresAuth } = pkg;

const router = Router();

router.get('/', requiresAuth(), async (req: Request, res: Response, next: NextFunction) => {
  /* req.oidc.user; */
  try {
    
    const userId = req.oidc.user?.sid; // Extract userId from the authenticated user
  
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const objectives = await prisma.objective.findMany({
      where: { id: userId },
      include: { user: true },
    });
  
    return res.json(objectives);
  }
  catch (err) {
    next(err);
  }
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
