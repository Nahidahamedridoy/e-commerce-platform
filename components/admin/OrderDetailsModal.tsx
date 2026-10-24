"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AdminOrder, OrderFulfillmentStatus } from "@/types/admin";
import { CloseIcon, CheckIcon, MapPinIcon, PhoneIcon, MailIcon, ClockIcon } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface OrderDetailsModalProps {
  order: AdminOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (orderId: string, newStatus: OrderFulfillmentStatus) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
  onStatusUpdate,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderFulfillmentStatus>(
    order?.fulfillmentStatus || "processing"
  );

  if (!isOpen || !order) return null;

  const handleStatusChange = (status: OrderFulfillmentStatus) => {
    setSelectedStatus(status);
    onStatusUpdate(order.id, status);
  };

  const getStatusBadge = (status: OrderFulfillmentStatus) => {
    switch (status) {
      case "delivered":
        return <Badge variant="lime">Delivered</Badge>;
      case "shipped":
        return <Badge variant="lime">Shipped</Badge>;
      case "processing":
        return <Badge variant="card" className="border-[#C6F36A]/40 text-[#C6F36A]">Processing</Badge>;
      case "pending":
        return <Badge variant="coral">Pending</Badge>;
      case "cancelled":
        return <Badge variant="coral">Cancelled</Badge>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl my-8 bg-[#1A2030] border border-[#2E364F] rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#2E364F] bg-[#141927]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-[#C6F36A]">
                {order.orderNumber}
              </span>
              <span className="text-[#657189]">•</span>
              <span className="text-xs text-[#9AA3B8] font-mono">{order.createdAt}</span>
            </div>
            <div className="flex items-center gap-2.5 mt-1">
              <h2 className="text-lg font-bold text-[#F4F3ED]">
                Order Details
              </h2>
              {getStatusBadge(selectedStatus)}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#9AA3B8] hover:text-[#F4F3ED] hover:bg-[#22283A] rounded-xl transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          {/* Quick Status Control Bar */}
          <div className="p-4 rounded-xl bg-[#141927] border border-[#2E364F]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-xs uppercase tracking-wider text-[#9AA3B8]">
                  Fulfillment Status
                </span>
                <p className="text-[11px] text-[#657189]">
                  Update order status to trigger simulated customer tracking notifications
                </p>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {(["pending", "processing", "shipped", "delivered", "cancelled"] as OrderFulfillmentStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(st)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium capitalize border transition-all ${
                      selectedStatus === st
                        ? "bg-[#C6F36A] text-[#10131F] font-bold border-[#C6F36A] shadow-[0_0_10px_rgba(198,243,106,0.3)]"
                        : "bg-[#22283A] text-[#9AA3B8] border-[#2E364F] hover:text-[#F4F3ED]"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Customer & Shipping Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#141927] border border-[#2E364F] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#9AA3B8] font-mono">
                Customer Information
              </span>
              <div className="flex items-center gap-2.5 pt-1">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#22283A] text-[#C6F36A] font-bold text-xs border border-[#2E364F]">
                  {order.customerAvatar || order.customerName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-[#F4F3ED] text-sm">{order.customerName}</p>
                  <p className="text-[#9AA3B8] text-xs">{order.customerEmail}</p>
                </div>
              </div>
              <div className="pt-2 text-[#9AA3B8] flex items-center gap-2">
                <PhoneIcon className="w-3.5 h-3.5 text-[#657189]" />
                <span>{order.customerPhone}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#141927] border border-[#2E364F] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#9AA3B8] font-mono">
                Shipping Destination
              </span>
              <div className="pt-1 text-[#F4F3ED]">
                <p className="font-semibold">{order.shippingAddress.street}</p>
                <p className="text-[#9AA3B8]">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p className="text-[#9AA3B8]">{order.shippingAddress.division}, Bangladesh</p>
              </div>
              <div className="pt-2 flex items-center gap-2 text-[#C6F36A]">
                <MapPinIcon className="w-3.5 h-3.5" />
                <span>Standard Express Delivery</span>
              </div>
            </div>
          </div>

          {/* Ordered Line Items */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9AA3B8] font-mono">
              Ordered Items ({order.items.length})
            </span>

            <div className="rounded-xl border border-[#2E364F] overflow-hidden divide-y divide-[#2E364F]">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3.5 bg-[#141927]">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#10131F] border border-[#2E364F] shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-[#F4F3ED] line-clamp-1">{item.name}</p>
                      <p className="text-[11px] text-[#9AA3B8] font-mono mt-0.5">
                        Qty: {item.quantity} × ৳ {item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-xs text-[#C6F36A]">
                    ৳ {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Totals Breakdown */}
          <div className="p-4 rounded-xl bg-[#141927] border border-[#2E364F] space-y-2">
            <div className="flex items-center justify-between text-[#9AA3B8]">
              <span>Payment Method:</span>
              <span className="font-semibold text-[#F4F3ED]">{order.paymentMethod}</span>
            </div>
            <div className="flex items-center justify-between text-[#9AA3B8]">
              <span>Payment Status:</span>
              <Badge variant={order.paymentStatus === "paid" ? "lime" : "coral"} size="sm">
                {order.paymentStatus.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-[#9AA3B8]">
              <span>Subtotal:</span>
              <span className="font-mono text-[#F4F3ED]">
                ৳ {(order.totalAmount - order.shippingFee).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#9AA3B8]">
              <span>Shipping Fee:</span>
              <span className="font-mono text-[#F4F3ED]">৳ {order.shippingFee}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#2E364F] text-sm">
              <span className="font-bold text-[#F4F3ED]">Total Amount:</span>
              <span className="font-mono font-black text-base text-[#C6F36A]">
                ৳ {order.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {order.notes && (
            <div className="p-3 rounded-xl bg-[#141927] border border-dashed border-[#2E364F] text-[11px] text-[#9AA3B8]">
              <strong className="text-[#F4F3ED]">Customer Note:</strong> {order.notes}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#2E364F] bg-[#141927]">
          <Button variant="card" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
