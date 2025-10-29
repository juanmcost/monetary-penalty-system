import express from 'express';
import morgan from 'morgan';
import helmet from "helmet";

import routes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';
import auth0 from './middleware/auth0.js';
import CORSConfig from './middleware/CORS.js';
import rateLimiter from './middleware/rateLimiter.js';

const app = express();

app.use(express.json());

// CORS Middleware
app.use(CORSConfig);

// Security Middleware
app.use(helmet());

// Rate Limiter
app.use(rateLimiter);

// Auth0 Middleware
app.use(auth0);

// Logging Middleware
app.use(morgan('dev'));

// Routes
app.use('/', routes);

// Error Handler
app.use(errorHandler);

export default app;
