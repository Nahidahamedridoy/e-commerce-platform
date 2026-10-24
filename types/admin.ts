export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: "Electronics" | "Fashion" | "Home & Living" | "Beauty & Care" | "Accessories" | "Lifestyle";
  price: number;
  originalPrice?: number;
  stock: number;
  stockStatus: "in_stock" | "low_stock" | "out_of_stock";
  status: "published" | "draft" | "archived";
  image: string;
  description: string;
  rating: number;
  reviewCount: number;
  salesCount: number;
  badge?: "HOT" | "NEW" | "SALE" | "LIMITED";
  createdAt: string;
}

export interface AdminOrderItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  category: string;
}

export type OrderPaymentStatus = "paid" | "pending" | "refunded" | "failed";
export type OrderFulfillmentStatus = "delivered" | "shipped" | "processing" | "cancelled" | "pending";

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAvatar?: string;
  itemsCount: number;
  totalAmount: number;
  shippingFee: number;
  tax: number;
  paymentMethod: "bKash" | "Nagad" | "Visa" | "MasterCard" | "Cash on Delivery";
  paymentStatus: OrderPaymentStatus;
  fulfillmentStatus: OrderFulfillmentStatus;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    division: string;
  };
  items: AdminOrderItem[];
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export type CustomerTier = "VIP" | "Regular" | "New";
export type CustomerStatus = "active" | "inactive";

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  city: string;
  division: string;
  totalOrders: number;
  totalSpend: number;
  tier: CustomerTier;
  status: CustomerStatus;
  joinedDate: string;
  lastOrderDate: string;
  favoriteCategory: string;
}

export interface AdminMetricStat {
  title: string;
  value: string;
  rawValue: number;
  changePercentage: number;
  changeType: "increase" | "decrease" | "neutral";
  periodLabel: string;
  accent: "lime" | "coral" | "neutral";
  subtitle?: string;
}
