"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { AdminDemoBanner } from "@/components/admin/AdminDemoBanner";
import { ProductFormModal } from "@/components/admin/ProductFormModal";
import { AdminProduct } from "@/types/admin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  const handleGlobalProductSave = (product: AdminProduct) => {
    // Notify window for local state listeners if any
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("admin:product-added", { detail: product })
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#10131F] text-[#F4F3ED] flex flex-col antialiased">
      {/* Top Demo Notice */}
      <AdminDemoBanner />

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <AdminSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Top Bar */}
          <AdminTopNav
            onOpenSidebar={() => setIsSidebarOpen(true)}
            onOpenAddProduct={() => setIsAddProductOpen(true)}
          />

          {/* Page Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>

      {/* Global Quick Add Product Modal */}
      <ProductFormModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onSave={handleGlobalProductSave}
      />
    </div>
  );
}
