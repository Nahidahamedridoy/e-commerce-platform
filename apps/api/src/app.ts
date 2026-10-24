import express, { Application } from 'express';
import cors from 'cors';
import { config } from './config/env';
import { requestLogger } from './middleware/requestLogger';
import { notFoundHandler } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';
import apiRoutes from './routes';

const app: Application = express();

// Global Middlewares
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// API Routing
app.use(config.apiPrefix, apiRoutes);

// Catch 404 and forward to error handler
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

export default app;
