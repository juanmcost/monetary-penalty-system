import { Router } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

router.get('/login', (req, res) => {
  const returnTo = process.env.FRONTEND_URL || 'http://localhost:3000';
  res.oidc.login({ returnTo });
});

export default router;
