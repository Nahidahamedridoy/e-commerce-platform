"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ADMIN_DASHBOARD_METRICS,
  ADMIN_SAMPLE_ORDERS,
  SALES_CHART_TIMEFRAMES,
  CATEGORY_SALES_BREAKDOWN,
} from "@/lib/data/adminSampleData";
import { AdminOrder, OrderFulfillmentStatus } from "@/types/admin";
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
} from "@/components/ui/Icons";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { OrderDetailsModal } from "@/components/admin/OrderDetailsModal";

export default function AdminDashboardPage() {
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "12m">("7d");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>(ADMIN_SAMPLE_ORDERS);

  const chartData = SALES_CHART_TIMEFRAMES[timeframe];
  const maxSales = Math.max(...chartData.map((d) => d.sales));

  const handleStatusUpdate = (orderId: string, newStatus: OrderFulfillmentStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, fulfillmentStatus: newStatus } : ord))
    );
  };

  const getStatIcon = (title: string) => {
    switch (title) {
      case "Total Sales":
        return <DollarSignIcon className="w-5 h-5 text-[#C6F36A]" />;
      case "Total Orders":
        return <ShoppingBagIcon className="w-5 h-5 text-[#FF8066]" />;
      case "Active Products":
        return <PackageIcon className="w-5 h-5 text-[#C6F36A]" />;
      case "Total Customers":
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
              October 2026 Executive Summary
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
        {ADMIN_DASHBOARD_METRICS.map((metric) => (
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
                className={`flex items-center justify-center w-10 h-10 rounded-xl bg-[#10131F] border border-[#2E364F]`}
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
                +{metric.changePercentage}%
              </span>
              <span className="text-[11px] text-[#657189]">
                {metric.periodLabel}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Middle Section: Interactive Sales Chart & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Chart (2 Columns) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#22283A] border border-[#2E364F] flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base font-bold text-[#F4F3ED] flex items-center gap-2">
                Revenue Trends
                <Badge variant="lime" size="sm" className="text-[9px]">
                  +18.4% YoY
                </Badge>
              </h3>
              <p className="text-xs text-[#9AA3B8] mt-0.5">
                Gross sales volume in BDT (৳) across selected timeframe
              </p>
            </div>

            {/* Timeframe Filter Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-[#10131F] border border-[#2E364F]">
              {(["7d", "30d", "12m"] as const).map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                    timeframe === tf
                      ? "bg-[#C6F36A] text-[#10131F] font-bold shadow-[0_0_10px_rgba(198,243,106,0.3)]"
                      : "text-[#9AA3B8] hover:text-[#F4F3ED]"
                  }`}
                >
                  {tf.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Bar / Graphic Chart */}
          <div className="space-y-4">
            <div className="h-56 w-full flex items-end gap-2 sm:gap-4 pt-4 border-b border-[#2E364F]">
              {chartData.map((item, idx) => {
                const heightPercent = Math.max(12, Math.round((item.sales / maxSales) * 100));
                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer relative"
                  >
                    {/* Hover Tooltip */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 bg-[#10131F] border border-[#C6F36A] px-2 py-1 rounded-md text-[10px] font-mono text-[#F4F3ED] whitespace-nowrap shadow-xl">
                      ৳ {item.sales.toLocaleString()} ({item.orders} orders)
                    </div>

                    {/* Bar */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full max-w-[42px] rounded-t-lg bg-gradient-to-t from-[#C6F36A]/20 via-[#C6F36A]/60 to-[#C6F36A] border-t-2 border-[#C6F36A] transition-all duration-300 group-hover:brightness-125 group-hover:shadow-[0_0_15px_rgba(198,243,106,0.4)]"
                    />

                    {/* Label */}
                    <span className="text-[10px] sm:text-xs font-mono text-[#9AA3B8] group-hover:text-[#F4F3ED]">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-[#9AA3B8] pt-1">
              <span>Peak Day: ৳ {maxSales.toLocaleString()}</span>
              <span className="text-[#C6F36A] font-medium">Avg Order Value: ৳ 4,680</span>
            </div>
          </div>
        </div>

        {/* Category Share Breakdown (1 Column) */}
        <div className="p-6 rounded-2xl bg-[#22283A] border border-[#2E364F] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#F4F3ED]">Sales by Category</h3>
              <Badge variant="card" size="sm">Oct 2026</Badge>
            </div>
            <p className="text-xs text-[#9AA3B8] mt-0.5">
              Revenue distribution by catalog department
            </p>

            <div className="mt-5 space-y-4">
              {CATEGORY_SALES_BREAKDOWN.map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#F4F3ED]">{cat.name}</span>
                    <span className="font-mono text-[#C6F36A] font-bold">
                      {cat.percentage}%{" "}
                      <span className="text-[#657189] font-normal">
                        (৳ {(cat.revenue / 1000).toFixed(0)}k)
                      </span>
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#10131F] overflow-hidden">
                    <div
                      style={{
                        width: `${cat.percentage}%`,
                        backgroundColor: cat.color,
                      }}
                      className="h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#2E364F] flex items-center justify-between text-xs">
            <span className="text-[#9AA3B8]">Total Catalog Volume:</span>
            <span className="font-mono font-bold text-[#F4F3ED]">৳ 2,485,900</span>
          </div>
        </div>
      </div>

      {/* 4. Recent Orders Table & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table (2 Columns) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#22283A] border border-[#2E364F]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#F4F3ED]">Recent Orders</h3>
              <p className="text-xs text-[#9AA3B8]">
                Real-time dispatch pipeline and payment verification
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
                {orders.slice(0, 5).map((order) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stock & System Alerts (1 Column) */}
        <div className="p-6 rounded-2xl bg-[#22283A] border border-[#2E364F] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#F4F3ED]">Priority Alerts</h3>
              <Badge variant="coral" size="sm">2 Urgent</Badge>
            </div>
            <p className="text-xs text-[#9AA3B8] mt-0.5">
              Action items requiring store manager attention
            </p>

            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-xl bg-[#141927] border border-[#FF8066]/30 space-y-1">
                <div className="flex items-center gap-2 text-[#FF8066] font-bold text-xs">
                  <AlertCircleIcon className="w-4 h-4" />
                  <span>Out of Stock Product</span>
                </div>
                <p className="text-[11px] text-[#9AA3B8] leading-tight">
                  &ldquo;Stealth Techwear Shell Jacket&rdquo; inventory reached 0 units. 14 customer restock alerts waiting.
                </p>
                <div className="pt-1">
                  <Link href="/admin/products" className="text-[11px] font-mono text-[#C6F36A] hover:underline">
                    Manage Inventory →
                  </Link>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#141927] border border-[#C6F36A]/30 space-y-1">
                <div className="flex items-center gap-2 text-[#C6F36A] font-bold text-xs">
                  <SparklesIcon className="w-4 h-4" />
                  <span>Pending Fulfillment</span>
                </div>
                <p className="text-[11px] text-[#9AA3B8] leading-tight">
                  1 new order received today via Cash on Delivery awaiting confirmation call.
                </p>
                <div className="pt-1">
                  <Link href="/admin/orders" className="text-[11px] font-mono text-[#C6F36A] hover:underline">
                    View Order Queue →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#141927] border border-[#2E364F] text-[11px] text-[#9AA3B8]">
            <span className="font-semibold text-[#F4F3ED]">System Status:</span> All 4 payment gateways (bKash, Nagad, Visa, COD) are operational.
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
