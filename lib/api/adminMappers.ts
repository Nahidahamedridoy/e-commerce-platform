import { ApiProduct, ApiOrder } from "./types";
import { AdminProduct, AdminOrder, OrderFulfillmentStatus, OrderPaymentStatus } from "@/types/admin";

export const ensureValidImageUrl = (img: string): string => {
  const trimmed = (img || "").trim();
  if (!trimmed) {
    return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80";
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  const origin = typeof window !== "undefined" ? window.location.origin : "https://amardokan.com";
  return `${origin}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
};

export const mapApiProductToAdminProduct = (p: ApiProduct): AdminProduct => {
  const stock = p.stock ?? 0;
  let stockStatus: AdminProduct["stockStatus"] = "in_stock";
  if (stock <= 0) stockStatus = "out_of_stock";
  else if (stock <= 8) stockStatus = "low_stock";

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: `SKU-${p.id.slice(0, 6).toUpperCase()}`,
    category: ((p.category?.name as unknown) as AdminProduct["category"]) || "Electronics",
    price: p.price,
    originalPrice: Math.round(p.price * 1.15),
    stock,
    stockStatus,
    status: "published",
    image: p.images?.[0] || "/images/hero-showcase.jpg",
    description: p.description || "",
    rating: 4.8,
    reviewCount: 16,
    salesCount: 0,
    badge: stock > 0 && stock <= 5 ? "LIMITED" : undefined,
    createdAt: p.createdAt ? p.createdAt.split("T")[0] : new Date().toISOString().split("T")[0],
  };
};

export const mapApiOrderToAdminOrder = (o: ApiOrder): AdminOrder => {
  const fulfillmentStatus = (o.status?.toLowerCase() || "pending") as OrderFulfillmentStatus;
  const paymentStatus = (o.paymentStatus?.toLowerCase() || "pending") as OrderPaymentStatus;

  const addrStr = o.shippingAddress || "";
  const parts = addrStr.split(",").map((s) => s.trim());
  const city = parts.length > 1 ? parts[parts.length - 1] : "Dhaka";
  const street = parts.length > 1 ? parts.slice(0, -1).join(", ") : addrStr;

  return {
    id: o.id,
    orderNumber: `ORD-${o.id.slice(0, 8).toUpperCase()}`,
    customerName: o.user?.name || "Customer",
    customerEmail: o.user?.email || "customer@amardokan.com",
    customerPhone: o.contactPhone || o.user?.phone || "+880 1700-000000",
    customerAvatar: (o.user?.name || "C").slice(0, 2).toUpperCase(),
    itemsCount: o.items?.reduce((sum, item) => sum + item.quantity, 0) || o.items?.length || 0,
    totalAmount: o.totalAmount,
    shippingFee: 120,
    tax: Math.round(o.totalAmount * 0.05),
    paymentMethod:
      o.paymentMethod === "CASH_ON_DELIVERY"
        ? "Cash on Delivery"
        : ((o.paymentMethod as unknown) as AdminOrder["paymentMethod"]) || "Cash on Delivery",
    paymentStatus,
    fulfillmentStatus,
    shippingAddress: {
      street: street || "123 Main Road",
      city: city || "Dhaka",
      postalCode: "1205",
      division: city || "Dhaka",
    },
    items: (o.items || []).map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.product?.name || "Product Item",
      image: item.product?.images?.[0] || "/images/hero-showcase.jpg",
      price: item.price,
      quantity: item.quantity,
      category: "General",
    })),
    createdAt: o.createdAt
      ? new Date(o.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : new Date().toLocaleDateString(),
    updatedAt: o.updatedAt
      ? new Date(o.updatedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : new Date().toLocaleDateString(),
    notes: undefined,
  };
};
