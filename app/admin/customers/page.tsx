"use client";

import React, { useState, useMemo } from "react";
import { ADMIN_SAMPLE_CUSTOMERS } from "@/lib/data/adminSampleData";
import { AdminCustomer, CustomerTier, CustomerStatus } from "@/types/admin";
import {
  UsersIcon,
  SearchIcon,
  PhoneIcon,
  MapPinIcon,
  SparklesIcon,
  ShoppingBagIcon,
  CheckIcon,
  RefreshCwIcon,
} from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CustomerDetailsModal } from "@/components/admin/CustomerDetailsModal";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>(ADMIN_SAMPLE_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);

  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        cust.name.toLowerCase().includes(q) ||
        cust.email.toLowerCase().includes(q) ||
        cust.phone.toLowerCase().includes(q) ||
        cust.city.toLowerCase().includes(q);

      const matchesTier = selectedTier === "all" || cust.tier === selectedTier;
      const matchesStatus = selectedStatus === "all" || cust.status === selectedStatus;

      return matchesSearch && matchesTier && matchesStatus;
    });
  }, [customers, searchQuery, selectedTier, selectedStatus]);

  const totalSpendSum = useMemo(() => {
    return customers.reduce((acc, curr) => acc + curr.totalSpend, 0);
  }, [customers]);

  const vipCount = useMemo(() => {
    return customers.filter((c) => c.tier === "VIP").length;
  }, [customers]);

  const avgSpend = useMemo(() => {
    return customers.length > 0 ? Math.round(totalSpendSum / customers.length) : 0;
  }, [customers, totalSpendSum]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header & KPI Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#F4F3ED] tracking-tight">
            Customer Directory & Shopper Profiles
          </h2>
          <p className="text-xs text-[#9AA3B8] mt-0.5">
            Manage your registered customer base, loyalty tiers, and purchase histories
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="card"
            size="sm"
            onClick={() => {
              setCustomers(ADMIN_SAMPLE_CUSTOMERS);
            }}
          >
            <RefreshCwIcon className="w-3.5 h-3.5 mr-1" />
            <span>Reset Demo</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-[#22283A] border border-[#2E364F]">
          <span className="text-[11px] font-mono uppercase text-[#9AA3B8]">
            Total Customers
          </span>
          <p className="text-xl font-bold font-mono text-[#F4F3ED] mt-1">
            {customers.length} Shoppers
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#22283A] border border-[#2E364F]">
          <span className="text-[11px] font-mono uppercase text-[#FF8066]">
            VIP Loyalty Tier
          </span>
          <p className="text-xl font-bold font-mono text-[#FF8066] mt-1">
            {vipCount} Members
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#22283A] border border-[#2E364F]">
          <span className="text-[11px] font-mono uppercase text-[#C6F36A]">
            Average LTV
          </span>
          <p className="text-xl font-bold font-mono text-[#C6F36A] mt-1">
            ৳ {avgSpend.toLocaleString()}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#22283A] border border-[#2E364F]">
          <span className="text-[11px] font-mono uppercase text-[#9AA3B8]">
            Gross Shopper Spend
          </span>
          <p className="text-xl font-bold font-mono text-[#F4F3ED] mt-1">
            ৳ {totalSpendSum.toLocaleString()}
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
              placeholder="Search by customer name, email, phone, or location..."
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

          {/* Tier Filter */}
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="h-10 bg-[#10131F] text-xs text-[#F4F3ED] rounded-xl border border-[#2E364F] px-3 focus:border-[#C6F36A] outline-none transition-all"
          >
            <option value="all">All Loyalty Tiers</option>
            <option value="VIP">VIP</option>
            <option value="Regular">Regular</option>
            <option value="New">New</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-10 bg-[#10131F] text-xs text-[#F4F3ED] rounded-xl border border-[#2E364F] px-3 focus:border-[#C6F36A] outline-none transition-all"
          >
            <option value="all">All Account Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Results summary */}
        <div className="flex items-center justify-between text-xs text-[#9AA3B8] pt-1 border-t border-[#2E364F]/50">
          <span>
            Showing <strong className="text-[#F4F3ED]">{filteredCustomers.length}</strong> of {customers.length} customers
          </span>
          {(searchQuery || selectedTier !== "all" || selectedStatus !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedTier("all");
                setSelectedStatus("all");
              }}
              className="text-[#C6F36A] hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* 3. Customers Table */}
      <div className="rounded-2xl bg-[#22283A] border border-[#2E364F] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-[#141927] border-b border-[#2E364F] text-[#657189] font-mono uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 font-semibold">Customer</th>
                <th className="py-3.5 px-4 font-semibold">Contact & Location</th>
                <th className="py-3.5 px-4 font-semibold">Orders Placed</th>
                <th className="py-3.5 px-4 font-semibold">Total Spend</th>
                <th className="py-3.5 px-4 font-semibold">Tier</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Joined Date</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E364F]/50">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#9AA3B8]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <UsersIcon className="w-8 h-8 text-[#657189]" />
                      <p className="font-semibold text-sm text-[#F4F3ED]">
                        No matching customers found
                      </p>
                      <p className="text-xs text-[#657189]">
                        Try searching with another keyword
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-[#141927]/60 transition-colors group cursor-pointer"
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#141927] border border-[#2E364F] text-xs font-bold flex items-center justify-center text-[#C6F36A] shadow-[0_0_10px_rgba(198,243,106,0.1)] shrink-0">
                          {customer.avatar || customer.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-[#F4F3ED] text-sm">
                            {customer.name}
                          </p>
                          <p className="text-[11px] text-[#657189] font-mono">
                            {customer.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact & Location */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="text-[#F4F3ED] font-mono text-xs">
                          {customer.phone}
                        </span>
                        <span className="text-[11px] text-[#657189]">
                          {customer.city}
                        </span>
                      </div>
                    </td>

                    {/* Orders Placed */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#F4F3ED]">
                      {customer.totalOrders} orders
                    </td>

                    {/* Total Spend */}
                    <td className="py-3.5 px-4 font-mono font-bold text-sm text-[#C6F36A]">
                      ৳ {customer.totalSpend.toLocaleString()}
                    </td>

                    {/* Tier */}
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          customer.tier === "VIP"
                            ? "coral"
                            : customer.tier === "New"
                            ? "lime"
                            : "card"
                        }
                        size="sm"
                      >
                        {customer.tier}
                      </Badge>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={customer.status === "active" ? "lime" : "outline"}
                        size="sm"
                      >
                        {customer.status.toUpperCase()}
                      </Badge>
                    </td>

                    {/* Joined Date */}
                    <td className="py-3.5 px-4 font-mono text-[#9AA3B8] text-[11px]">
                      {customer.joinedDate}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomer(customer);
                        }}
                        className="px-3 py-1 rounded-lg bg-[#141927] border border-[#2E364F] text-[#C6F36A] hover:bg-[#C6F36A] hover:text-[#10131F] font-medium transition-colors"
                      >
                        Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Modal */}
      <CustomerDetailsModal
        customer={selectedCustomer}
        isOpen={Boolean(selectedCustomer)}
        onClose={() => setSelectedCustomer(null)}
      />
    </div>
  );
}
