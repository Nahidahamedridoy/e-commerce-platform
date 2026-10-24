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

export interface GetOrdersQuery {
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
    const res = await apiClient<ApiOrder>("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res.data!;
  },

  async getMyOrders(query?: GetOrdersQuery): Promise<OrdersResponseData> {
    const res = await apiClient<OrdersResponseData>("/orders/my-orders", {
      method: "GET",
      params: query as any,
    });
    return res.data || { orders: [], meta: {} };
  },

  async getAllOrders(query?: GetOrdersQuery): Promise<OrdersResponseData> {
    const res = await apiClient<OrdersResponseData>("/orders", {
      method: "GET",
      params: query as any,
    });
    return res.data || { orders: [], meta: {} };
  },

  async getById(id: string): Promise<ApiOrder> {
    const res = await apiClient<ApiOrder>(`/orders/${id}`, {
      method: "GET",
    });
    return res.data!;
  },

  async cancelOrder(id: string): Promise<ApiOrder> {
    const res = await apiClient<ApiOrder>(`/orders/${id}/cancel`, {
      method: "POST",
    });
    return res.data!;
  },

  async updateStatus(id: string, payload: UpdateOrderStatusPayload): Promise<ApiOrder> {
    const res = await apiClient<ApiOrder>(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    return res.data!;
  },
};
