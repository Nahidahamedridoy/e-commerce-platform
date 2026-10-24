import { Request, Response, NextFunction } from 'express';
import * as healthService from '../services/healthService';

export const getHealth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const health = healthService.getHealthStatus();
    res.status(200).json({
      success: true,
      data: health,
    });
  } catch (error) {
    next(error);
  }
};
