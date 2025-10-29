import { Router } from 'express';
import usersRouter from './users.js';
import objectivesRouter from './objectives.js';
import authRouter from './auth.js';

const router = Router();

router.use('/', authRouter); // Used only for redirecting after login by overriding login route
router.use('/users', usersRouter);
router.use('/objectives', objectivesRouter);


export default router;
