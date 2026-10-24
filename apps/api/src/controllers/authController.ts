import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { AuthRequest } from '../middleware/authenticate';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, phone, address } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required' });
      return;
    }
    const data = await authService.register({ name, email, password, phone, address });
    res.status(201).json({ success: true, message: 'Registered successfully', data });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required' });
      return;
    }
    const data = await authService.login({ email, password });
    res.status(200).json({ success: true, message: 'Login successful', data });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await authService.getProfile(req.user!.id);
    res.status(200).json({ success: true, message: 'Profile fetched', data });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, phone, address } = req.body;
    const data = await authService.updateProfile(req.user!.id, { name, phone, address });
    res.status(200).json({ success: true, message: 'Profile updated', data });
  } catch (error) {
    next(error);
  }
};
