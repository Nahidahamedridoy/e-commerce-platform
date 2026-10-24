"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MenuIcon,
  SearchIcon,
  BellIcon,
  PlusIcon,
  ExternalLinkIcon,
  CheckIcon,
  CloseIcon,
  SparklesIcon,
} from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface AdminTopNavProps {
  onOpenSidebar: () => void;
  onOpenAddProduct?: () => void;
}

const SAMPLE_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "New order received (#ORD-9412)",
    detail: "Tahmid Rahman purchased 2 items for ৳ 26,700 via bKash.",
    time: "5 min ago",
    unread: true,
    type: "order",
  },
  {
    id: "notif-2",
    title: "Low stock alert",
    detail: "Aura Pro Wireless Earbuds has only 6 units remaining in stock.",
    time: "24 min ago",
    unread: true,
    type: "alert",
  },
  {
    id: "notif-3",
    title: "New VIP Customer Registered",
    detail: "Sadia Islam completed verification and first purchase.",
    time: "2 hrs ago",
    unread: false,
    type: "customer",
  },
];

export const AdminTopNav: React.FC<AdminTopNavProps> = ({
  onOpenSidebar,
  onOpenAddProduct,
}) => {
  const pathname = usePathname();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const getPageTitle = () => {
    if (pathname === "/admin") return { title: "Executive Overview", subtitle: "Real-time store metrics & sales performance" };
    if (pathname.startsWith("/admin/products")) return { title: "Product Inventory", subtitle: "Manage catalog items, stock levels & pricing" };
    if (pathname.startsWith("/admin/orders")) return { title: "Order Fulfillment", subtitle: "Track orders, dispatch status & payment verification" };
    if (pathname.startsWith("/admin/customers")) return { title: "Customer Directory", subtitle: "View registered shoppers, loyalty tiers & lifetime value" };
    return { title: "Admin Portal", subtitle: "Amar Dokan store administration" };
  };

  const { title, subtitle } = getPageTitle();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-18 px-4 sm:px-6 bg-[#10131F]/90 backdrop-blur-md border-b border-[#2E364F]">
      {/* Left: Mobile Sidebar Trigger & Breadcrumbs */}
      <div className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open navigation menu"
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-[#22283A] border border-[#2E364F] text-[#9AA3B8] hover:text-[#F4F3ED] hover:border-[#C6F36A] transition-all"
        >
          <MenuIcon className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-[#C6F36A] uppercase tracking-wider">
              Admin
            </span>
            <span className="text-[#657189]">/</span>
            <h1 className="text-sm sm:text-base font-bold text-[#F4F3ED] tracking-tight">
              {title}
            </h1>
          </div>
          <p className="hidden sm:block text-[11px] text-[#9AA3B8]">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: Quick Search, Add Product, Notifications, View Store */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick Add Product Button */}
        {onOpenAddProduct ? (
          <Button
            onClick={onOpenAddProduct}
            variant="lime"
            size="sm"
            className="hidden sm:inline-flex shadow-[0_0_15px_rgba(198,243,106,0.3)] hover:shadow-[0_0_20px_rgba(198,243,106,0.45)]"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Product</span>
          </Button>
        ) : (
          <Link href="/admin/products?action=new">
            <Button
              variant="lime"
              size="sm"
              className="hidden sm:inline-flex shadow-[0_0_15px_rgba(198,243,106,0.3)] hover:shadow-[0_0_20px_rgba(198,243,106,0.45)]"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add Product</span>
            </Button>
          </Link>
        )}

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotifOpen((v) => !v)}
            aria-label="Toggle notifications"
            className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#22283A] border border-[#2E364F] text-[#9AA3B8] hover:text-[#F4F3ED] hover:border-[#3E496A] transition-all cursor-pointer"
          >
            <BellIcon className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-[#FF8066] text-[#10131F] font-bold text-[9px] shadow-[0_0_8px_rgba(255,128,102,0.8)]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Panel */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#22283A] border border-[#2E364F] shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[#2E364F]/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F4F3ED]">
                    Store Alerts
                  </span>
                  {unreadCount > 0 && (
                    <Badge variant="coral" size="sm" className="px-1.5 py-0 text-[10px]">
                      {unreadCount} New
                    </Badge>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-[11px] text-[#C6F36A] hover:underline cursor-pointer"
                  >
                    Mark read
                  </button>
                )}
              </div>

              <div className="mt-2 space-y-2 max-h-72 overflow-y-auto pr-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl border text-xs transition-colors ${
                      n.unread
                        ? "bg-[#181E2E] border-[#C6F36A]/30 text-[#F4F3ED]"
                        : "bg-[#1A2030]/50 border-transparent text-[#9AA3B8]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-xs text-[#F4F3ED]">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-[#657189] shrink-0 font-mono">
                        {n.time}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-[#9AA3B8] leading-relaxed">
                      {n.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Store Quick Link */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 h-10 px-3 rounded-xl bg-[#22283A] border border-[#2E364F] text-xs font-medium text-[#9AA3B8] hover:text-[#C6F36A] hover:border-[#C6F36A] transition-all"
        >
          <ExternalLinkIcon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Storefront</span>
        </Link>
      </div>
    </header>
  );
};
