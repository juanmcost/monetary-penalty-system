import { Router } from 'express';
import usersRouter from './users.js';
import objectivesRouter from './objectives.js';

const router = Router();

router.use('/users', usersRouter);
router.use('/objectives', objectivesRouter);


export default router;
