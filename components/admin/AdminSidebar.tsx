"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DashboardIcon,
  PackageIcon,
  ShoppingBagIcon,
  UsersIcon,
  ExternalLinkIcon,
  CloseIcon,
  SparklesIcon,
} from "@/components/ui/Icons";
import { Badge } from "@/components/ui/Badge";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ADMIN_NAV_ITEMS = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: DashboardIcon,
    exact: true,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: PackageIcon,
    badge: "10",
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingBagIcon,
    badge: "6",
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: UsersIcon,
    badge: "8",
  },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const pathname = usePathname();

  const isLinkActive = (href: string, exact: boolean = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-[#10131F] border-r border-[#2E364F] select-none">
      {/* Brand & Admin Badge */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#2E364F]">
        <Link
          href="/admin"
          onClick={onClose}
          className="flex items-center gap-2.5 group"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-[#22283A] border border-[#2E364F] group-hover:border-[#C6F36A] transition-all duration-200">
            <span className="font-mono text-base font-black text-[#C6F36A] tracking-tighter">
              AD
            </span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#C6F36A] shadow-[0_0_8px_#C6F36A]" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-[#F4F3ED] group-hover:text-[#C6F36A] transition-colors">
              AMAR DOKAN
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[#9AA3B8] uppercase">
              Admin Portal
            </span>
          </div>
        </Link>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-[#9AA3B8] hover:text-[#F4F3ED] hover:bg-[#22283A] transition-colors"
          aria-label="Close sidebar"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold tracking-wider uppercase text-[#657189]">
          Management
        </div>

        {ADMIN_NAV_ITEMS.map((item) => {
          const active = isLinkActive(item.href, item.exact);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`group flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-[#22283A] text-[#C6F36A] border border-[#C6F36A]/30 shadow-[0_0_15px_-3px_rgba(198,243,106,0.15)]"
                  : "text-[#9AA3B8] hover:text-[#F4F3ED] hover:bg-[#1A2030] border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                    active ? "text-[#C6F36A]" : "text-[#657189] group-hover:text-[#F4F3ED]"
                  }`}
                />
                <span className={active ? "font-semibold" : ""}>{item.name}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                    active
                      ? "bg-[#C6F36A]/20 text-[#C6F36A]"
                      : "bg-[#1A2030] text-[#9AA3B8] group-hover:bg-[#22283A] group-hover:text-[#F4F3ED]"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Live Customer Store Link */}
        <div className="pt-6">
          <div className="px-3 pb-2 text-[11px] font-bold tracking-wider uppercase text-[#657189]">
            Storefront
          </div>
          <Link
            href="/"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-[#9AA3B8] hover:text-[#C6F36A] hover:bg-[#1A2030] border border-dashed border-[#2E364F] transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <ExternalLinkIcon className="w-4 h-4 text-[#657189] group-hover:text-[#C6F36A]" />
              <span>View Customer Store</span>
            </div>
            <Badge variant="outline" size="sm" className="text-[9px] py-0">
              Live
            </Badge>
          </Link>
        </div>
      </div>

      {/* Admin Profile & System Status */}
      <div className="p-4 border-t border-[#2E364F] bg-[#141927]">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#1A2030] border border-[#2E364F]">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#C6F36A] text-[#10131F] font-bold text-xs shadow-[0_0_10px_rgba(198,243,106,0.3)]">
              AD
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#10131F]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#F4F3ED] leading-tight">
                Super Admin
              </span>
              <span className="text-[10px] text-[#9AA3B8] leading-tight">
                admin@amardokan.com
              </span>
            </div>
          </div>
          <Badge variant="lime" size="sm" className="text-[9px] px-1.5 py-0">
            Online
          </Badge>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-30">
        {navContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Mobile Offcanvas Drawer */}
      <div
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 lg:hidden transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navContent}
      </div>
    </>
  );
};
