// Types matching the Amar Dokan Express Backend (amar-dokan-server)

export type UserRole = "CUSTOMER" | "ADMIN";

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED";

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  address?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    products: number;
  };
}

export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiOrderItem {
  id: string;
  orderId?: string;
  productId: string;
  product?: {
    id: string;
    name: string;
    slug: string;
    images?: string[];
  };
  quantity: number;
  price: number;
  createdAt?: string;
}

export interface ApiOrder {
  id: string;
  userId: string;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  shippingAddress: string;
  contactPhone: string;
  items: ApiOrderItem[];
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
  meta?: ApiMeta;
}

export interface AuthResponseData {
  user: ApiUser;
  token: string;
}

export interface ProductsResponseData {
  products: ApiProduct[];
  meta: ApiMeta;
}

export interface OrdersResponseData {
  orders: ApiOrder[];
  meta: ApiMeta;
}
