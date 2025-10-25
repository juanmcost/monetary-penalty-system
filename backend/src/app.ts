import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { auth, ConfigParams } from 'express-openid-connect';

import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Auth0 Middleware Configuration
const config: ConfigParams = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  routes: {
    postLogoutRedirect: process.env.FRONTEND_URL,
  },
  session: {
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',      // <--- must be false in dev (localhost)
      sameSite: 'Lax',    // <--- better for local redirects
    },
  },
};
// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

app.use(morgan('dev'));
app.use(helmet());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

app.use('/', routes);

app.get('/login-redirect', (req, res) => {
  res.oidc.login({ returnTo: process.env.FRONTEND_URL || 'http://localhost:3000' });
});

app.use(errorHandler);

export default app;
