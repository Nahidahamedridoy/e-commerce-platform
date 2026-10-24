import { apiClient } from "./client";
import { ApiProduct, ProductsResponseData } from "./types";

export interface GetProductsQuery {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "price" | "name" | "stock";
  sortOrder?: "asc" | "desc";
}

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: string;
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  images?: string[];
  categoryId?: string;
}

export const productsApi = {
  async getAll(query?: GetProductsQuery): Promise<ProductsResponseData> {
    const res = await apiClient<ProductsResponseData>("/products", {
      method: "GET",
      params: query as any,
    });
    return res.data || { products: [], meta: {} };
  },

  async getById(idOrSlug: string): Promise<ApiProduct> {
    const res = await apiClient<ApiProduct>(`/products/${encodeURIComponent(idOrSlug)}`, {
      method: "GET",
    });
    return res.data!;
  },

  async create(payload: CreateProductPayload): Promise<ApiProduct> {
    const res = await apiClient<ApiProduct>("/products", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res.data!;
  },

  async update(id: string, payload: UpdateProductPayload): Promise<ApiProduct> {
    const res = await apiClient<ApiProduct>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return res.data!;
  },

  async delete(id: string): Promise<void> {
    await apiClient(`/products/${id}`, {
      method: "DELETE",
    });
  },
};
