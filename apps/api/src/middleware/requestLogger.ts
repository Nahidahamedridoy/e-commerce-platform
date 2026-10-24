import morgan from 'morgan';
import { config } from '../config/env';

// Request logging middleware
// Uses concise colorized dev format in development, combined Apache-style format in production
export const requestLogger = morgan(config.isDevelopment ? 'dev' : 'combined');
