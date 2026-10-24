import { apiClient } from "./client";
import { ApiCategory } from "./types";

export interface CreateCategoryPayload {
  name: string;
  description?: string;
  image?: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
  image?: string;
}

export const categoriesApi = {
  async getAll(): Promise<ApiCategory[]> {
    const res = await apiClient<ApiCategory[]>("/categories", {
      method: "GET",
    });
    return res.data || [];
  },

  async getById(idOrSlug: string): Promise<ApiCategory> {
    const res = await apiClient<ApiCategory>(`/categories/${encodeURIComponent(idOrSlug)}`, {
      method: "GET",
    });
    return res.data!;
  },

  async create(payload: CreateCategoryPayload): Promise<ApiCategory> {
    const res = await apiClient<ApiCategory>("/categories", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res.data!;
  },

  async update(id: string, payload: UpdateCategoryPayload): Promise<ApiCategory> {
    const res = await apiClient<ApiCategory>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return res.data!;
  },

  async delete(id: string): Promise<void> {
    await apiClient(`/categories/${id}`, {
      method: "DELETE",
    });
  },
};
