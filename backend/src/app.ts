import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { auth, ConfigParams } from 'express-openid-connect';
import jwt from 'jsonwebtoken';

import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { prisma } from './config/prisma.js'; // Importa Prisma para interactuar con la base de datos

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
    login: '/auth0-login',
  },
  session: {
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',      // <--- must be false in dev (localhost)
      sameSite: 'Lax',    // <--- better for local redirects
    },
  },
  afterCallback: async (req, res, session, decodedState) => {
    try {
      
      const auth0User = jwt.decode(session.id_token);

      if (!auth0User || typeof auth0User === 'string' || !auth0User.sub) {
        throw new Error('There was an error decoding the id_token');
      }

      const auth0Id = auth0User.sub;
      const email = auth0User.email;
      const given_name = auth0User.given_name;
      const family_name = auth0User.family_name;
      const nickname = auth0User.nickname;
      const picture = auth0User.picture;
      const updated_at = auth0User.updated_at;
      const email_verified = auth0User.email_verified;

      let dbUser = await prisma.user.findUnique({ where: { id: auth0Id } });

      if (!dbUser) {
        // Create a new user if it wasn't found
        dbUser = await prisma.user.create({
          data: {
            id: auth0Id,
            email,
            given_name,
            family_name,
            nickname,
            picture,
            updated_at: updated_at ? new Date(updated_at) : null,
            email_verified,
          },
        });
      }

      // Asocia el usuario de la base de datos a la sesión
      session.user = dbUser;

      return session;
    } catch (error) {
      console.error('Error en afterCallback:', error);
      throw new Error('Error al procesar el callback de autenticación.');
    }
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
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use('/', routes);

app.get('/login', (req, res) => {
  console.log('Initiating login process');
  const returnTo = process.env.FRONTEND_URL || 'http://localhost:3000';
  console.log('Redirecting to:', returnTo);
  res.oidc.login({ returnTo });
});

app.use(errorHandler);

export default app;
