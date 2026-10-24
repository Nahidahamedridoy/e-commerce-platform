import slugify from 'slugify';
import prisma from '../config/prisma';
import { AppError } from '../middleware/errorHandler';

export const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  });
  return categories;
};

export const getCategoryById = async (idOrSlug: string) => {
  const category = await prisma.category.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    include: { _count: { select: { products: true } } },
  });
  if (!category) {
    const err = new Error('Category not found') as AppError;
    err.statusCode = 404;
    throw err;
  }
  return category;
};

export const createCategory = async (payload: {
  name: string;
  description?: string;
  image?: string;
}) => {
  const slug = slugify(payload.name, { lower: true, strict: true });
  const category = await prisma.category.create({
    data: { name: payload.name, slug, description: payload.description, image: payload.image },
  });
  return category;
};

export const updateCategory = async (
  id: string,
  payload: { name?: string; description?: string; image?: string }
) => {
  const exists = await prisma.category.findUnique({ where: { id } });
  if (!exists) {
    const err = new Error('Category not found') as AppError;
    err.statusCode = 404;
    throw err;
  }

  const slug = payload.name ? slugify(payload.name, { lower: true, strict: true }) : undefined;
  const category = await prisma.category.update({
    where: { id },
    data: { ...payload, ...(slug ? { slug } : {}) },
  });
  return category;
};

export const deleteCategory = async (id: string) => {
  const exists = await prisma.category.findUnique({ where: { id } });
  if (!exists) {
    const err = new Error('Category not found') as AppError;
    err.statusCode = 404;
    throw err;
  }
  await prisma.category.delete({ where: { id } });
};
