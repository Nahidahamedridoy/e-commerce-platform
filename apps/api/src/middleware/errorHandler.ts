import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';

export interface AppError extends Error {
  statusCode?: number;
  details?: unknown;
}

// Centralized error handling middleware
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  const statusCode = err.statusCode && err.statusCode >= 400 && err.statusCode < 600 ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${req.method} ${req.originalUrl} - Status: ${statusCode}`, {
    message,
    ...(err.details ? { details: err.details } : {}),
    ...(config.isDevelopment && { stack: err.stack }),
  });

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
      ...(config.isDevelopment && { stack: err.stack }),
      ...(err.details ? { details: err.details } : {}),
    },
  });
};
