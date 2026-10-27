"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { AdminOrder, OrderFulfillmentStatus, OrderPaymentStatus } from "@/types/admin";
import {
  ordersApi,
  ApiError,
  mapApiOrderToAdminOrder,
} from "@/lib/api";
import type { OrderStatus } from "@/lib/api";
import {
  ShoppingBagIcon,
  SearchIcon,
  CheckIcon,
  AlertCircleIcon,
  RefreshCwIcon,
} from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { OrderDetailsModal } from "@/components/admin/OrderDetailsModal";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFulfillment, setSelectedFulfillment] = useState("all");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await ordersApi.getAllOrders({ limit: 100 });
      setOrders((data.orders || []).map(mapApiOrderToAdminOrder));
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to load orders from the server.";
      setLoadError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    ordersApi
      .getAllOrders({ limit: 100 })
      .then((data) => {
        if (!ignore) {
          setOrders((data.orders || []).map(mapApiOrderToAdminOrder));
        }
      })
      .catch((err) => {
        if (!ignore) {
          const msg = err instanceof ApiError ? err.message : "Failed to load orders from the server.";
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

  // Update order status via API
  const handleStatusUpdate = useCallback(
    async (orderId: string, newStatus: OrderFulfillmentStatus) => {
      try {
        // Map admin fulfillment status to API OrderStatus (uppercase)
        const apiStatus = newStatus.toUpperCase() as OrderStatus;
        await ordersApi.updateStatus(orderId, { status: apiStatus });
        setOrders((prev) =>
          prev.map((ord) =>
            ord.id === orderId ? { ...ord, fulfillmentStatus: newStatus } : ord
          )
        );
        // Also update the selected order if it's the one being updated
        setSelectedOrder((prev) =>
          prev && prev.id === orderId ? { ...prev, fulfillmentStatus: newStatus } : prev
        );
        showToast(`Order status updated to ${newStatus.toUpperCase()}`);
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : "Failed to update order status.";
        showToast(`Error: ${msg}`);
      }
    },
    [showToast]
  );

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.customerEmail.toLowerCase().includes(query) ||
        order.shippingAddress.city.toLowerCase().includes(query);

      const matchesFulfillment =
        selectedFulfillment === "all" || order.fulfillmentStatus === selectedFulfillment;

      const matchesPayment =
        selectedPaymentMethod === "all" || order.paymentMethod === selectedPaymentMethod;

      return matchesSearch && matchesFulfillment && matchesPayment;
    });
  }, [orders, searchQuery, selectedFulfillment, selectedPaymentMethod]);

  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((acc, curr) => acc + curr.totalAmount, 0);
  }, [orders]);

  const pendingCount = useMemo(() => {
    return orders.filter((o) => o.fulfillmentStatus === "pending" || o.fulfillmentStatus === "processing").length;
  }, [orders]);

  const deliveredCount = useMemo(() => {
    return orders.filter((o) => o.fulfillmentStatus === "delivered").length;
  }, [orders]);

  const getFulfillmentBadge = (status: OrderFulfillmentStatus) => {
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

  const getPaymentBadge = (status: OrderPaymentStatus) => {
    switch (status) {
      case "paid":
        return <Badge variant="lime" size="sm">PAID</Badge>;
      case "pending":
        return <Badge variant="coral" size="sm">UNPAID</Badge>;
      case "refunded":
        return <Badge variant="outline" size="sm">REFUNDED</Badge>;
      case "failed":
        return <Badge variant="coral" size="sm">FAILED</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-[#10131F] border border-[#C6F36A] text-[#F4F3ED] text-xs font-medium rounded-xl shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
          <CheckIcon className="w-4 h-4 text-[#C6F36A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header & KPI Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#F4F3ED] tracking-tight">
            Order Management & Fulfillment
          </h2>
          <p className="text-xs text-[#9AA3B8] mt-0.5">
            Monitor customer checkout flow, delivery dispatches, and transaction records
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="card"
            size="sm"
            onClick={() => {
              fetchOrders();
              showToast("Refreshing orders from server...");
            }}
          >
            <RefreshCwIcon className="w-3.5 h-3.5 mr-1" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-[#22283A] border border-[#2E364F]">
          <span className="text-[11px] font-mono uppercase text-[#9AA3B8]">
            Total Orders
          </span>
          <p className="text-xl font-bold font-mono text-[#F4F3ED] mt-1">
            {orders.length} Placed
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#22283A] border border-[#2E364F]">
          <span className="text-[11px] font-mono uppercase text-[#C6F36A]">
            Paid Volume
          </span>
          <p className="text-xl font-bold font-mono text-[#C6F36A] mt-1">
            ৳ {totalRevenue.toLocaleString()}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#22283A] border border-[#2E364F]">
          <span className="text-[11px] font-mono uppercase text-[#FF8066]">
            Needs Dispatch
          </span>
          <p className="text-xl font-bold font-mono text-[#FF8066] mt-1">
            {pendingCount} Orders
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#22283A] border border-[#2E364F]">
          <span className="text-[11px] font-mono uppercase text-[#9AA3B8]">
            Delivered
          </span>
          <p className="text-xl font-bold font-mono text-[#F4F3ED] mt-1">
            {deliveredCount} Fulfilled
          </p>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#22283A] border border-[#2E364F] space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Box */}
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#657189] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order ID (#ORD-...), customer name, or city..."
              className="w-full h-10 bg-[#10131F] text-xs text-[#F4F3ED] placeholder-[#657189] rounded-xl pl-10 pr-4 border border-[#2E364F] focus:border-[#C6F36A] focus:ring-1 focus:ring-[#C6F36A] outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#657189] hover:text-[#F4F3ED]"
              >
                ×
              </button>
            )}
          </div>

          {/* Fulfillment Status Filter */}
          <select
            value={selectedFulfillment}
            onChange={(e) => setSelectedFulfillment(e.target.value)}
            className="h-10 bg-[#10131F] text-xs text-[#F4F3ED] rounded-xl border border-[#2E364F] px-3 focus:border-[#C6F36A] outline-none transition-all"
          >
            <option value="all">All Fulfillment Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Payment Method Filter */}
          <select
            value={selectedPaymentMethod}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            className="h-10 bg-[#10131F] text-xs text-[#F4F3ED] rounded-xl border border-[#2E364F] px-3 focus:border-[#C6F36A] outline-none transition-all"
          >
            <option value="all">All Payment Methods</option>
            <option value="bKash">bKash</option>
            <option value="Nagad">Nagad</option>
            <option value="Visa">Visa</option>
            <option value="MasterCard">MasterCard</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
          </select>
        </div>

        {/* Results summary */}
        <div className="flex items-center justify-between text-xs text-[#9AA3B8] pt-1 border-t border-[#2E364F]/50">
          <span>
            Showing <strong className="text-[#F4F3ED]">{filteredOrders.length}</strong> of {orders.length} orders
          </span>
          {(searchQuery || selectedFulfillment !== "all" || selectedPaymentMethod !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedFulfillment("all");
                setSelectedPaymentMethod("all");
              }}
              className="text-[#C6F36A] hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* 3. Orders Table */}
      <div className="rounded-2xl bg-[#22283A] border border-[#2E364F] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-[#141927] border-b border-[#2E364F] text-[#657189] font-mono uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 font-semibold">Order ID</th>
                <th className="py-3.5 px-4 font-semibold">Customer</th>
                <th className="py-3.5 px-4 font-semibold">Items</th>
                <th className="py-3.5 px-4 font-semibold">Total Amount</th>
                <th className="py-3.5 px-4 font-semibold">Payment</th>
                <th className="py-3.5 px-4 font-semibold">Fulfillment</th>
                <th className="py-3.5 px-4 font-semibold">Date & Time</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E364F]/50">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-[#9AA3B8]">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-2 border-[#C6F36A] border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs text-[#9AA3B8]">Loading orders from server...</p>
                    </div>
                  </td>
                </tr>
              ) : loadError ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#9AA3B8]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircleIcon className="w-8 h-8 text-[#FF8066]" />
                      <p className="font-semibold text-sm text-[#FF8066]">
                        Failed to load orders
                      </p>
                      <p className="text-xs text-[#657189] max-w-md">{loadError}</p>
                      <Button type="button" variant="card" size="sm" onClick={fetchOrders} className="mt-2">
                        <RefreshCwIcon className="w-3.5 h-3.5 mr-1" /> Retry
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#9AA3B8]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ShoppingBagIcon className="w-8 h-8 text-[#657189]" />
                      <p className="font-semibold text-sm text-[#F4F3ED]">
                        {orders.length === 0 ? "No orders yet" : "No matching orders found"}
                      </p>
                      <p className="text-xs text-[#657189]">
                        {orders.length === 0
                          ? "Orders will appear here when customers place them"
                          : "Try searching for another customer name or order number"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-[#141927]/60 transition-colors group cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    {/* Order ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#C6F36A]">
                      {order.orderNumber}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#141927] border border-[#2E364F] text-[10px] font-bold flex items-center justify-center text-[#F4F3ED] shrink-0">
                          {order.customerAvatar || order.customerName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-[#F4F3ED] text-sm">
                            {order.customerName}
                          </p>
                          <p className="text-[11px] text-[#657189] font-mono">
                            {order.customerEmail}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Items */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-[#F4F3ED]">
                          {order.itemsCount} {order.itemsCount === 1 ? "item" : "items"}
                        </span>
                        <div className="flex -space-x-2 overflow-hidden ml-1">
                          {order.items.slice(0, 2).map((item, idx) => (
                            <div
                              key={idx}
                              className="relative w-6 h-6 rounded-md overflow-hidden bg-[#10131F] border border-[#2E364F]"
                            >
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 px-4 font-mono font-bold text-sm text-[#F4F3ED]">
                      ৳ {order.totalAmount.toLocaleString()}
                    </td>

                    {/* Payment */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[#9AA3B8] font-mono text-xs">
                          {order.paymentMethod}
                        </span>
                        <div>{getPaymentBadge(order.paymentStatus)}</div>
                      </div>
                    </td>

                    {/* Fulfillment */}
                    <td className="py-3.5 px-4">
                      {getFulfillmentBadge(order.fulfillmentStatus)}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 font-mono text-[#9AA3B8] text-[11px]">
                      {order.createdAt}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                        }}
                        className="px-3 py-1 rounded-lg bg-[#141927] border border-[#2E364F] text-[#C6F36A] hover:bg-[#C6F36A] hover:text-[#10131F] font-medium transition-colors"
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
