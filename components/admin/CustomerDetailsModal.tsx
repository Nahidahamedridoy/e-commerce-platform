"use client";

import React from "react";
import { AdminCustomer } from "@/types/admin";
import { CloseIcon, MailIcon, PhoneIcon, MapPinIcon, ShoppingBagIcon, SparklesIcon } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface CustomerDetailsModalProps {
  customer: AdminCustomer | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({
  customer,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-[#1A2030] border border-[#2E364F] rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#2E364F] bg-[#141927]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#22283A] border border-[#2E364F] text-[#C6F36A] font-bold text-base shadow-[0_0_15px_rgba(198,243,106,0.15)]">
              {customer.avatar || customer.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#F4F3ED]">{customer.name}</h3>
                <Badge
                  variant={customer.tier === "VIP" ? "coral" : customer.tier === "New" ? "lime" : "card"}
                  size="sm"
                >
                  {customer.tier}
                </Badge>
              </div>
              <p className="text-xs text-[#9AA3B8] font-mono">{customer.email}</p>
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

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-[#141927] border border-[#2E364F]">
              <span className="text-[11px] text-[#9AA3B8] uppercase font-mono">
                Total Orders
              </span>
              <p className="text-lg font-bold font-mono text-[#F4F3ED] mt-0.5">
                {customer.totalOrders} Completed
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#141927] border border-[#2E364F]">
              <span className="text-[11px] text-[#9AA3B8] uppercase font-mono">
                Lifetime Spend
              </span>
              <p className="text-lg font-bold font-mono text-[#C6F36A] mt-0.5">
                ৳ {customer.totalSpend.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="p-4 rounded-xl bg-[#141927] border border-[#2E364F] space-y-3">
            <div className="flex items-center justify-between text-[#9AA3B8]">
              <span className="flex items-center gap-2">
                <PhoneIcon className="w-3.5 h-3.5 text-[#657189]" />
                Contact Phone:
              </span>
              <span className="font-mono text-[#F4F3ED]">{customer.phone}</span>
            </div>

            <div className="flex items-center justify-between text-[#9AA3B8]">
              <span className="flex items-center gap-2">
                <MapPinIcon className="w-3.5 h-3.5 text-[#657189]" />
                Primary Location:
              </span>
              <span className="text-[#F4F3ED]">{customer.city}, {customer.division}</span>
            </div>

            <div className="flex items-center justify-between text-[#9AA3B8]">
              <span className="flex items-center gap-2">
                <SparklesIcon className="w-3.5 h-3.5 text-[#657189]" />
                Favorite Category:
              </span>
              <span className="text-[#C6F36A] font-semibold">{customer.favoriteCategory}</span>
            </div>

            <div className="flex items-center justify-between text-[#9AA3B8]">
              <span>Customer Status:</span>
              <Badge variant={customer.status === "active" ? "lime" : "outline"} size="sm">
                {customer.status.toUpperCase()}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-[#9AA3B8]">
              <span>Member Since:</span>
              <span className="font-mono text-[#F4F3ED]">{customer.joinedDate}</span>
            </div>

            <div className="flex items-center justify-between text-[#9AA3B8]">
              <span>Last Order Date:</span>
              <span className="font-mono text-[#C6F36A]">{customer.lastOrderDate}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-[#2E364F] bg-[#141927]">
          <Button variant="card" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
