"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { AdminOrder, OrderFulfillmentStatus } from "@/types/admin";
import {
  productsApi,
  ordersApi,
  categoriesApi,
  ApiError,
  mapApiProductToAdminProduct,
  mapApiOrderToAdminOrder,
} from "@/lib/api";
import type { OrderStatus } from "@/lib/api";
import {
  DollarSignIcon,
  ShoppingBagIcon,
  PackageIcon,
  UsersIcon,
  TrendingUpIcon,
  ArrowRightIcon,
  SparklesIcon,
  AlertCircleIcon,
  CheckIcon,
  RefreshCwIcon,
} from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { OrderDetailsModal } from "@/components/admin/OrderDetailsModal";

interface DashboardMetrics {
  totalSales: number;
  totalOrders: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  pendingOrders: number;
  deliveredOrders: number;
  categoryBreakdown: { name: string; count: number; color: string }[];
}

const CATEGORY_COLORS = [
  "#C6F36A",
  "#FF8066",
  "#6AB4F3",
  "#F3C66A",
  "#A36AF3",
  "#6AF3C6",
  "#F36AAB",
  "#F3F36A",
];

export default function AdminDashboardPage() {
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalSales: 0,
    totalOrders: 0,
    activeProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    categoryBreakdown: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      // Fetch products, orders, and categories in parallel
      const [productsData, ordersData, categoriesData] = await Promise.all([
        productsApi.getAll({ limit: 200 }),
        ordersApi.getAllOrders({ limit: 200 }),
        categoriesApi.getAll(),
      ]);

      const products = (productsData.products || []).map(mapApiProductToAdminProduct);
      const adminOrders = (ordersData.orders || []).map(mapApiOrderToAdminOrder);

      // Calculate metrics
      const totalSales = adminOrders
        .filter((o) => o.paymentStatus === "paid")
        .reduce((sum, o) => sum + o.totalAmount, 0);

      const lowStockProducts = products.filter((p) => p.stockStatus === "low_stock").length;
      const outOfStockProducts = products.filter((p) => p.stockStatus === "out_of_stock").length;
      const pendingOrders = adminOrders.filter(
        (o) => o.fulfillmentStatus === "pending" || o.fulfillmentStatus === "processing"
      ).length;
      const deliveredOrders = adminOrders.filter((o) => o.fulfillmentStatus === "delivered").length;

      // Category breakdown from real categories
      const categoryBreakdown = (categoriesData || []).map((cat, idx) => ({
        name: cat.name,
        count: cat._count?.products ?? 0,
        color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
      }));

      setMetrics({
        totalSales,
        totalOrders: adminOrders.length,
        activeProducts: products.length,
        lowStockProducts,
        outOfStockProducts,
        pendingOrders,
        deliveredOrders,
        categoryBreakdown,
      });
      setOrders(adminOrders);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to load dashboard data.";
      setLoadError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    Promise.all([
      productsApi.getAll({ limit: 200 }),
      ordersApi.getAllOrders({ limit: 200 }),
      categoriesApi.getAll(),
    ])
      .then(([productsData, ordersData, categoriesData]) => {
        if (!ignore) {
          const products = (productsData.products || []).map(mapApiProductToAdminProduct);
          const adminOrders = (ordersData.orders || []).map(mapApiOrderToAdminOrder);

          const totalSales = adminOrders
            .filter((o) => o.paymentStatus === "paid")
            .reduce((sum, o) => sum + o.totalAmount, 0);

          const lowStockProducts = products.filter((p) => p.stockStatus === "low_stock").length;
          const outOfStockProducts = products.filter((p) => p.stockStatus === "out_of_stock").length;
          const pendingOrders = adminOrders.filter(
            (o) => o.fulfillmentStatus === "pending" || o.fulfillmentStatus === "processing"
          ).length;
          const deliveredOrders = adminOrders.filter((o) => o.fulfillmentStatus === "delivered").length;

          const categoryBreakdown = (categoriesData || []).map((cat, idx) => ({
            name: cat.name,
            count: cat._count?.products ?? 0,
            color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
          }));

          setMetrics({
            totalSales,
            totalOrders: adminOrders.length,
            activeProducts: products.length,
            lowStockProducts,
            outOfStockProducts,
            pendingOrders,
            deliveredOrders,
            categoryBreakdown,
          });
          setOrders(adminOrders);
        }
      })
      .catch((err) => {
        if (!ignore) {
          const msg = err instanceof ApiError ? err.message : "Failed to load dashboard data.";
          setLoadError(msg);
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleStatusUpdate = useCallback(
    async (orderId: string, newStatus: OrderFulfillmentStatus) => {
      try {
        const apiStatus = newStatus.toUpperCase() as OrderStatus;
        await ordersApi.updateStatus(orderId, { status: apiStatus });
        setOrders((prev) =>
          prev.map((ord) =>
            ord.id === orderId ? { ...ord, fulfillmentStatus: newStatus } : ord
          )
        );
        setSelectedOrder((prev) =>
          prev && prev.id === orderId ? { ...prev, fulfillmentStatus: newStatus } : prev
        );
      } catch {
        // Silent fail for dashboard
      }
    },
    []
  );

  const getStatIcon = (title: string) => {
    switch (title) {
      case "Total Sales":
        return <DollarSignIcon className="w-5 h-5 text-[#C6F36A]" />;
      case "Total Orders":
        return <ShoppingBagIcon className="w-5 h-5 text-[#FF8066]" />;
      case "Active Products":
        return <PackageIcon className="w-5 h-5 text-[#C6F36A]" />;
      case "Pending Orders":
        return <UsersIcon className="w-5 h-5 text-[#FF8066]" />;
      default:
        return <DollarSignIcon className="w-5 h-5 text-[#C6F36A]" />;
    }
  };

  const getStatusBadge = (status: OrderFulfillmentStatus) => {
    switch (status) {
      case "delivered":
        return <Badge variant="lime" size="sm">Delivered</Badge>;
      case "shipped":
        return <Badge variant="lime" size="sm">Shipped</Badge>;
      case "processing":
        return <Badge variant="card" size="sm" className="border-[#C6F36A]/40 text-[#C6F36A]">Processing</Badge>;
      case "pending":
        return <Badge variant="coral" size="sm">Pending</Badge>;
      case "cancelled":
        return <Badge variant="coral" size="sm">Cancelled</Badge>;
    }
  };

  const metricCards = [
    {
      title: "Total Sales",
      value: `৳ ${metrics.totalSales.toLocaleString()}`,
      accent: "lime" as const,
    },
    {
      title: "Total Orders",
      value: `${metrics.totalOrders}`,
      accent: "coral" as const,
    },
    {
      title: "Active Products",
      value: `${metrics.activeProducts}`,
      accent: "lime" as const,
    },
    {
      title: "Pending Orders",
      value: `${metrics.pendingOrders}`,
      accent: "coral" as const,
    },
  ];

  // Compute total product count for category breakdown percentages
  const totalCategoryProducts = useMemo(() => {
    return metrics.categoryBreakdown.reduce((sum, c) => sum + c.count, 0);
  }, [metrics.categoryBreakdown]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#C6F36A] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#9AA3B8]">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-center max-w-md">
          <AlertCircleIcon className="w-10 h-10 text-[#FF8066]" />
          <p className="text-lg font-bold text-[#FF8066]">Failed to load dashboard</p>
          <p className="text-xs text-[#657189]">{loadError}</p>
          <Button type="button" variant="card" size="sm" onClick={fetchDashboardData} className="mt-2">
            <RefreshCwIcon className="w-3.5 h-3.5 mr-1" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 1. Header Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#1A2030] via-[#22283A] to-[#141927] border border-[#2E364F]">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="lime" size="sm" className="font-mono text-[9px]">
              LIVE MONITOR
            </Badge>
            <span className="text-xs text-[#9AA3B8]">
              Store Performance Dashboard
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#F4F3ED] tracking-tight mt-1">
            Store Performance Dashboard
          </h2>
          <p className="text-xs text-[#9AA3B8] mt-0.5">
            Real-time analytics across online orders, stock movements, and revenue targets.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="card"
            size="sm"
            onClick={fetchDashboardData}
            title="Refresh dashboard data"
          >
            <RefreshCwIcon className="w-3.5 h-3.5 mr-1" />
            <span>Refresh</span>
          </Button>
          <Link href="/admin/products?action=new">
            <Button variant="lime" size="sm" className="shadow-[0_0_15px_rgba(198,243,106,0.3)]">
              + New Product
            </Button>
          </Link>
          <Link href="/admin/orders">
            <Button variant="card" size="sm">
              All Orders
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {metricCards.map((metric) => (
          <div
            key={metric.title}
            className={`p-5 rounded-2xl bg-[#22283A] border border-[#2E364F] transition-all duration-300 hover:-translate-y-1 hover:border-[#3E496A] ${
              metric.accent === "lime"
                ? "hover:shadow-[0_15px_30px_-10px_rgba(198,243,106,0.15)]"
                : "hover:shadow-[0_15px_30px_-10px_rgba(255,128,102,0.15)]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#9AA3B8]">
                {metric.title}
              </span>
              <div
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#10131F] border border-[#2E364F]"
              >
                {getStatIcon(metric.title)}
              </div>
            </div>

            <div className="mt-3">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[#F4F3ED]">
                {metric.value}
              </h3>
            </div>

            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#2E364F]/60">
              <span
                className={`inline-flex items-center gap-1 font-mono text-xs font-bold ${
                  metric.accent === "lime" ? "text-[#C6F36A]" : "text-[#FF8066]"
                }`}
              >
                <TrendingUpIcon className="w-3.5 h-3.5" />
                Live
              </span>
              <span className="text-[11px] text-[#657189]">
                from server
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Middle Section: Category Breakdown & Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Share Breakdown (2 Columns) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#22283A] border border-[#2E364F] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#F4F3ED]">Products by Category</h3>
              <Badge variant="card" size="sm">Live Data</Badge>
            </div>
            <p className="text-xs text-[#9AA3B8] mt-0.5">
              Product distribution across catalog categories
            </p>

            <div className="mt-5 space-y-4">
              {metrics.categoryBreakdown.length === 0 ? (
                <p className="text-xs text-[#657189] py-4 text-center">No categories found</p>
              ) : (
                metrics.categoryBreakdown.map((cat) => {
                  const percentage = totalCategoryProducts > 0
                    ? Math.round((cat.count / totalCategoryProducts) * 100)
                    : 0;
                  return (
                    <div key={cat.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-[#F4F3ED]">{cat.name}</span>
                        <span className="font-mono text-[#C6F36A] font-bold">
                          {percentage}%{" "}
                          <span className="text-[#657189] font-normal">
                            ({cat.count} products)
                          </span>
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[#10131F] overflow-hidden">
                        <div
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: cat.color,
                          }}
                          className="h-full rounded-full transition-all duration-500"
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#2E364F] flex items-center justify-between text-xs">
            <span className="text-[#9AA3B8]">Total Products:</span>
            <span className="font-mono font-bold text-[#F4F3ED]">{metrics.activeProducts}</span>
          </div>
        </div>

        {/* Quick Stock & System Alerts (1 Column) */}
        <div className="p-6 rounded-2xl bg-[#22283A] border border-[#2E364F] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#F4F3ED]">Priority Alerts</h3>
              <Badge variant="coral" size="sm">
                {metrics.outOfStockProducts + metrics.pendingOrders > 0
                  ? `${metrics.outOfStockProducts + metrics.pendingOrders} Active`
                  : "None"}
              </Badge>
            </div>
            <p className="text-xs text-[#9AA3B8] mt-0.5">
              Action items requiring store manager attention
            </p>

            <div className="mt-4 space-y-3">
              {metrics.outOfStockProducts > 0 && (
                <div className="p-3 rounded-xl bg-[#141927] border border-[#FF8066]/30 space-y-1">
                  <div className="flex items-center gap-2 text-[#FF8066] font-bold text-xs">
                    <AlertCircleIcon className="w-4 h-4" />
                    <span>Out of Stock Products</span>
                  </div>
                  <p className="text-[11px] text-[#9AA3B8] leading-tight">
                    {metrics.outOfStockProducts} product{metrics.outOfStockProducts !== 1 ? "s" : ""} currently out of stock and unavailable for purchase.
                  </p>
                  <div className="pt-1">
                    <Link href="/admin/products" className="text-[11px] font-mono text-[#C6F36A] hover:underline">
                      Manage Inventory →
                    </Link>
                  </div>
                </div>
              )}

              {metrics.lowStockProducts > 0 && (
                <div className="p-3 rounded-xl bg-[#141927] border border-[#F3C66A]/30 space-y-1">
                  <div className="flex items-center gap-2 text-[#F3C66A] font-bold text-xs">
                    <AlertCircleIcon className="w-4 h-4" />
                    <span>Low Stock Warning</span>
                  </div>
                  <p className="text-[11px] text-[#9AA3B8] leading-tight">
                    {metrics.lowStockProducts} product{metrics.lowStockProducts !== 1 ? "s" : ""} running low on stock (≤8 units).
                  </p>
                  <div className="pt-1">
                    <Link href="/admin/products" className="text-[11px] font-mono text-[#C6F36A] hover:underline">
                      View Inventory →
                    </Link>
                  </div>
                </div>
              )}

              {metrics.pendingOrders > 0 && (
                <div className="p-3 rounded-xl bg-[#141927] border border-[#C6F36A]/30 space-y-1">
                  <div className="flex items-center gap-2 text-[#C6F36A] font-bold text-xs">
                    <SparklesIcon className="w-4 h-4" />
                    <span>Pending Fulfillment</span>
                  </div>
                  <p className="text-[11px] text-[#9AA3B8] leading-tight">
                    {metrics.pendingOrders} order{metrics.pendingOrders !== 1 ? "s" : ""} awaiting processing or dispatch.
                  </p>
                  <div className="pt-1">
                    <Link href="/admin/orders" className="text-[11px] font-mono text-[#C6F36A] hover:underline">
                      View Order Queue →
                    </Link>
                  </div>
                </div>
              )}

              {metrics.outOfStockProducts === 0 && metrics.lowStockProducts === 0 && metrics.pendingOrders === 0 && (
                <div className="p-3 rounded-xl bg-[#141927] border border-[#C6F36A]/30 space-y-1">
                  <div className="flex items-center gap-2 text-[#C6F36A] font-bold text-xs">
                    <CheckIcon className="w-4 h-4" />
                    <span>All Clear</span>
                  </div>
                  <p className="text-[11px] text-[#9AA3B8] leading-tight">
                    No urgent alerts. All inventory and orders are in good standing.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#141927] border border-[#2E364F] text-[11px] text-[#9AA3B8]">
            <span className="font-semibold text-[#F4F3ED]">Inventory Summary:</span>{" "}
            {metrics.activeProducts} products • {metrics.deliveredOrders} delivered • ৳ {metrics.totalSales.toLocaleString()} revenue
          </div>
        </div>
      </div>

      {/* 4. Recent Orders Table */}
      <div className="grid grid-cols-1 gap-6">
        <div className="p-6 rounded-2xl bg-[#22283A] border border-[#2E364F]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#F4F3ED]">Recent Orders</h3>
              <p className="text-xs text-[#9AA3B8]">
                Latest customer orders from real-time backend data
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-[#C6F36A] hover:underline flex items-center gap-1"
            >
              <span>View All Orders</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#2E364F] text-[#657189] font-mono uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Total</th>
                  <th className="pb-3 font-semibold">Payment</th>
                  <th className="pb-3 font-semibold">Fulfillment</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2E364F]/50">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-[#9AA3B8]">
                      <div className="flex flex-col items-center gap-2">
                        <ShoppingBagIcon className="w-6 h-6 text-[#657189]" />
                        <p className="text-xs">No orders found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  orders.slice(0, 5).map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-[#141927]/60 transition-colors group cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="py-3.5 font-mono font-bold text-[#C6F36A]">
                        {order.orderNumber}
                      </td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-[#10131F] border border-[#2E364F] text-[10px] font-bold flex items-center justify-center text-[#F4F3ED]">
                            {order.customerAvatar || order.customerName.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-semibold text-[#F4F3ED]">{order.customerName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 font-mono font-bold text-[#F4F3ED]">
                        ৳ {order.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3.5">
                        <span className="text-[#9AA3B8] font-mono">
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3.5">
                        {getStatusBadge(order.fulfillmentStatus)}
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#141927] border border-[#2E364F] text-[#C6F36A] hover:bg-[#C6F36A] hover:text-[#10131F] font-medium transition-colors"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}
