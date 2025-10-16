import { Router } from 'express';
import usersRouter from './users.js';
import penaltiesRouter from './penalties.js';

const router = Router();

router.use('/users', usersRouter);
router.use('/penalties', penaltiesRouter);

export default router;
