import { apiClient } from "./client";
import { ApiOrder, OrdersResponseData, OrderStatus, PaymentStatus } from "./types";

export interface CreateOrderItemPayload {
  productId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  items: CreateOrderItemPayload[];
  shippingAddress: string;
  contactPhone: string;
  paymentMethod?: string;
}

export interface GetOrdersQuery
  extends Record<string, string | number | undefined> {
  status?: OrderStatus;
  page?: number;
  limit?: number;
}

export interface UpdateOrderStatusPayload {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
}

export const ordersApi = {
  async create(payload: CreateOrderPayload): Promise<ApiOrder> {
    const res = await apiClient<{ order: ApiOrder }>("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res.data!.order;
  },

  async getMyOrders(query?: GetOrdersQuery): Promise<OrdersResponseData> {
    const res = await apiClient<{ orders: ApiOrder[] }>("/orders/my-orders", {
      method: "GET",
      params: query,
    });
    return {
      orders: res.data?.orders || [],
      meta: res.meta || {},
    };
  },

  async getAllOrders(query?: GetOrdersQuery): Promise<OrdersResponseData> {
    const res = await apiClient<{ orders: ApiOrder[] }>("/orders", {
      method: "GET",
      params: query,
    });
    return {
      orders: res.data?.orders || [],
      meta: res.meta || {},
    };
  },

  async getById(id: string): Promise<ApiOrder> {
    const res = await apiClient<{ order: ApiOrder }>(`/orders/${id}`, {
      method: "GET",
    });
    return res.data!.order;
  },

  async cancelOrder(id: string): Promise<ApiOrder> {
    const res = await apiClient<{ order: ApiOrder }>(`/orders/${id}/cancel`, {
      method: "POST",
    });
    return res.data!.order;
  },

  async updateStatus(
    id: string,
    payload: UpdateOrderStatusPayload
  ): Promise<ApiOrder> {
    const res = await apiClient<{ order: ApiOrder }>(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    return res.data!.order;
  },
};
