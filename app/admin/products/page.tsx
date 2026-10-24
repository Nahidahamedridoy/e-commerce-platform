"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ADMIN_SAMPLE_PRODUCTS } from "@/lib/data/adminSampleData";
import { AdminProduct } from "@/types/admin";
import {
  PackageIcon,
  SearchIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  ExternalLinkIcon,
  FilterIcon,
  RefreshCwIcon,
  CheckIcon,
  SparklesIcon,
  AlertCircleIcon,
} from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ProductFormModal } from "@/components/admin/ProductFormModal";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>(ADMIN_SAMPLE_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStockStatus, setSelectedStockStatus] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<AdminProduct | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Listen to global "admin:product-added" event
  useEffect(() => {
    const handleGlobalAdd = (e: Event) => {
      const customEvent = e as CustomEvent<AdminProduct>;
      if (customEvent.detail) {
        setProducts((prev) => [customEvent.detail, ...prev]);
        showToast(`Product "${customEvent.detail.name}" added successfully.`);
      }
    };
    window.addEventListener("admin:product-added", handleGlobalAdd);
    return () => window.removeEventListener("admin:product-added", handleGlobalAdd);
  }, []);

  const showToast = (message: string) => {
    setFeedbackToast(message);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      const matchesStock =
        selectedStockStatus === "all" || item.stockStatus === selectedStockStatus;

      const matchesStatus =
        selectedStatus === "all" || item.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStock && matchesStatus;
    });
  }, [products, searchQuery, selectedCategory, selectedStockStatus, selectedStatus]);

  // Inventory KPI calculations
  const totalInventoryValue = useMemo(() => {
    return products.reduce((acc, curr) => acc + curr.price * curr.stock, 0);
  }, [products]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.stockStatus === "low_stock").length;
  }, [products]);

  const outOfStockCount = useMemo(() => {
    return products.filter((p) => p.stockStatus === "out_of_stock").length;
  }, [products]);

  // Save product (Add or Edit)
  const handleSaveProduct = (product: AdminProduct) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? product : p))
      );
      showToast(`Product "${product.name}" updated successfully.`);
    } else {
      setProducts((prev) => [product, ...prev]);
      showToast(`New product "${product.name}" created and added to inventory.`);
    }
    setEditingProduct(null);
  };

  // Delete product
  const handleDeleteProduct = () => {
    if (!deletingProduct) return;
    setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
    showToast(`Product "${deletingProduct.name}" removed from local session.`);
    setDeletingProduct(null);
  };

  // Reset to default sample data
  const handleResetData = () => {
    setProducts(ADMIN_SAMPLE_PRODUCTS);
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedStockStatus("all");
    setSelectedStatus("all");
    showToast("Product inventory reset to default sample dataset.");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-[#10131F] border border-[#C6F36A] text-[#F4F3ED] text-xs font-medium rounded-xl shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
          <CheckIcon className="w-4 h-4 text-[#C6F36A]" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* 1. Header & KPI Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#F4F3ED] tracking-tight">
            Product Catalog & Inventory
          </h2>
          <p className="text-xs text-[#9AA3B8] mt-0.5">
            Manage your store items, pricing, inventory thresholds, and visibility
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="card"
            size="sm"
            onClick={handleResetData}
            title="Reset to default sample data"
          >
            <RefreshCwIcon className="w-3.5 h-3.5 mr-1" />
            <span>Reset Demo</span>
          </Button>

          <Button
            type="button"
            variant="lime"
            size="sm"
            onClick={() => {
              setEditingProduct(null);
              setIsFormOpen(true);
            }}
            className="shadow-[0_0_15px_rgba(198,243,106,0.3)] hover:shadow-[0_0_20px_rgba(198,243,106,0.5)]"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Product</span>
          </Button>
        </div>
      </div>

      {/* 2. Inventory Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-[#22283A] border border-[#2E364F]">
          <span className="text-[11px] font-mono uppercase text-[#9AA3B8]">
            Total Catalog
          </span>
          <p className="text-xl font-bold font-mono text-[#F4F3ED] mt-1">
            {products.length} Products
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#22283A] border border-[#2E364F]">
          <span className="text-[11px] font-mono uppercase text-[#9AA3B8]">
            Inventory Valuation
          </span>
          <p className="text-xl font-bold font-mono text-[#C6F36A] mt-1">
            ৳ {totalInventoryValue.toLocaleString()}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#22283A] border border-[#2E364F]">
          <span className="text-[11px] font-mono uppercase text-[#FF8066]">
            Low Stock Alerts
          </span>
          <p className="text-xl font-bold font-mono text-[#FF8066] mt-1">
            {lowStockCount} Items
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#22283A] border border-[#2E364F]">
          <span className="text-[11px] font-mono uppercase text-[#657189]">
            Out of Stock
          </span>
          <p className="text-xl font-bold font-mono text-[#9AA3B8] mt-1">
            {outOfStockCount} Items
          </p>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#22283A] border border-[#2E364F] space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Search Box */}
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#657189] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, SKU, or category..."
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

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-10 bg-[#10131F] text-xs text-[#F4F3ED] rounded-xl border border-[#2E364F] px-3 focus:border-[#C6F36A] outline-none transition-all"
          >
            <option value="all">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Home & Living">Home & Living</option>
            <option value="Beauty & Care">Beauty & Care</option>
            <option value="Accessories">Accessories</option>
            <option value="Lifestyle">Lifestyle</option>
          </select>

          {/* Stock Filter */}
          <select
            value={selectedStockStatus}
            onChange={(e) => setSelectedStockStatus(e.target.value)}
            className="h-10 bg-[#10131F] text-xs text-[#F4F3ED] rounded-xl border border-[#2E364F] px-3 focus:border-[#C6F36A] outline-none transition-all"
          >
            <option value="all">All Stock Statuses</option>
            <option value="in_stock">In Stock (&gt;8)</option>
            <option value="low_stock">Low Stock (≤8)</option>
            <option value="out_of_stock">Out of Stock (0)</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-10 bg-[#10131F] text-xs text-[#F4F3ED] rounded-xl border border-[#2E364F] px-3 focus:border-[#C6F36A] outline-none transition-all"
          >
            <option value="all">All Visibility</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Filter Results Summary */}
        <div className="flex items-center justify-between text-xs text-[#9AA3B8] pt-1 border-t border-[#2E364F]/50">
          <span>
            Showing <strong className="text-[#F4F3ED]">{filteredProducts.length}</strong> of{" "}
            {products.length} products
          </span>
          {(searchQuery || selectedCategory !== "all" || selectedStockStatus !== "all" || selectedStatus !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedStockStatus("all");
                setSelectedStatus("all");
              }}
              className="text-[#C6F36A] hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* 4. Products Table */}
      <div className="rounded-2xl bg-[#22283A] border border-[#2E364F] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-[#141927] border-b border-[#2E364F] text-[#657189] font-mono uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 font-semibold">Product</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Price</th>
                <th className="py-3.5 px-4 font-semibold">Stock Status</th>
                <th className="py-3.5 px-4 font-semibold">Visibility</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E364F]/50">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#9AA3B8]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <PackageIcon className="w-8 h-8 text-[#657189]" />
                      <p className="font-semibold text-sm text-[#F4F3ED]">
                        No matching products found
                      </p>
                      <p className="text-xs text-[#657189]">
                        Try adjusting your filters or search keywords
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-[#141927]/60 transition-colors group"
                    >
                      {/* Product Name, Image, SKU */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#10131F] border border-[#2E364F] shrink-0 group-hover:border-[#C6F36A] transition-colors">
                            <Image
                              src={product.image || "/images/hero-showcase.jpg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="min-w-0 max-w-xs sm:max-w-md">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#F4F3ED] truncate text-sm">
                                {product.name}
                              </span>
                              {product.badge && (
                                <Badge
                                  variant={
                                    product.badge === "HOT" || product.badge === "SALE"
                                      ? "coral"
                                      : "lime"
                                  }
                                  size="sm"
                                  className="text-[9px] px-1.5 py-0"
                                >
                                  {product.badge}
                                </Badge>
                              )}
                            </div>
                            <span className="text-[11px] font-mono text-[#657189]">
                              SKU: {product.sku}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-[#141927] border border-[#2E364F] text-[#9AA3B8] font-medium text-[11px]">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-mono font-bold text-sm text-[#C6F36A]">
                            ৳ {product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="font-mono text-[10px] text-[#657189] line-through">
                              ৳ {product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock Level & Stock Status */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#F4F3ED]">
                              {product.stock} units
                            </span>
                            {product.stockStatus === "in_stock" && (
                              <Badge variant="lime" size="sm" className="text-[9px]">
                                In Stock
                              </Badge>
                            )}
                            {product.stockStatus === "low_stock" && (
                              <Badge variant="coral" size="sm" className="text-[9px]">
                                Low Stock
                              </Badge>
                            )}
                            {product.stockStatus === "out_of_stock" && (
                              <Badge variant="coral" size="sm" className="text-[9px]">
                                Out of Stock
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={product.status === "published" ? "lime" : "outline"}
                          size="sm"
                        >
                          {product.status.toUpperCase()}
                        </Badge>
                      </td>

                      {/* Action Buttons: Edit, Delete */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct(product);
                              setIsFormOpen(true);
                            }}
                            title="Edit Product"
                            className="p-2 rounded-lg bg-[#141927] border border-[#2E364F] text-[#9AA3B8] hover:text-[#C6F36A] hover:border-[#C6F36A] transition-colors"
                          >
                            <EditIcon className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingProduct(product)}
                            title="Delete Product"
                            className="p-2 rounded-lg bg-[#141927] border border-[#2E364F] text-[#9AA3B8] hover:text-[#FF8066] hover:border-[#FF8066] transition-colors"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        initialProduct={editingProduct}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingProduct)}
        title="Delete Product"
        itemName={deletingProduct?.name || ""}
        itemType="product"
        onConfirm={handleDeleteProduct}
        onClose={() => setDeletingProduct(null)}
      />
    </div>
  );
}
