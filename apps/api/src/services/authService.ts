import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { config } from '../config/env';
import { AppError } from '../middleware/errorHandler';

function signToken(userId: string, email: string, role: string): string {
  return jwt.sign({ id: userId, email, role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });
}

function sanitizeUser(user: {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    address: user.address,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export const register = async (payload: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}) => {
  const existing = await prisma.user.findUnique({ where: { email: payload.email } });
  if (existing) {
    const err = new Error('Email already in use') as AppError;
    err.statusCode = 409;
    throw err;
  }

  const hashed = await bcrypt.hash(payload.password, config.bcryptRounds);
  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashed,
      phone: payload.phone,
      address: payload.address,
    },
  });

  const token = signToken(user.id, user.email, user.role);
  return { user: sanitizeUser(user), token };
};

export const login = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({ where: { email: payload.email } });
  if (!user) {
    const err = new Error('Invalid email or password') as AppError;
    err.statusCode = 401;
    throw err;
  }

  const valid = await bcrypt.compare(payload.password, user.password);
  if (!valid) {
    const err = new Error('Invalid email or password') as AppError;
    err.statusCode = 401;
    throw err;
  }

  const token = signToken(user.id, user.email, user.role);
  return { user: sanitizeUser(user), token };
};

export const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const err = new Error('User not found') as AppError;
    err.statusCode = 404;
    throw err;
  }
  return { user: sanitizeUser(user) };
};

export const updateProfile = async (
  userId: string,
  payload: { name?: string; phone?: string; address?: string }
) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: payload,
  });
  return { user: sanitizeUser(user) };
};
