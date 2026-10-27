"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { AdminProduct } from "@/types/admin";
import {
  productsApi,
  categoriesApi,
  ApiCategory,
  ApiError,
  mapApiProductToAdminProduct,
} from "@/lib/api";
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
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStockStatus, setSelectedStockStatus] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<AdminProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setFeedbackToast(message);
    setTimeout(() => setFeedbackToast(null), 3500);
  }, []);

  // Fetch products from the API
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await productsApi.getAll({ limit: 100, sortBy: "createdAt", sortOrder: "desc" });
      setProducts((data.products || []).map(mapApiProductToAdminProduct));
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to load products from the server.";
      setLoadError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch categories from the API
  const fetchCategories = useCallback(async () => {
    try {
      const cats = await categoriesApi.getAll();
      setCategories(cats || []);
    } catch {
      // Categories are non-critical; filters will remain static if API fails
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    Promise.all([
      productsApi.getAll({ limit: 100, sortBy: "createdAt", sortOrder: "desc" }),
      categoriesApi.getAll().catch(() => []),
    ])
      .then(([productsData, cats]) => {
        if (!ignore) {
          setProducts((productsData.products || []).map(mapApiProductToAdminProduct));
          if (cats) setCategories(cats);
        }
      })
      .catch((err) => {
        if (!ignore) {
          const msg = err instanceof ApiError ? err.message : "Failed to load products from the server.";
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

  // Save product (Add or Edit) — refetch list to keep in sync
  const handleSaveProduct = useCallback(
    (product: AdminProduct) => {
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
    },
    [editingProduct, showToast]
  );

  // Delete product via API
  const handleDeleteProduct = useCallback(async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      await productsApi.delete(deletingProduct.id);
      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
      showToast(`Product "${deletingProduct.name}" deleted from inventory.`);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to delete product.";
      showToast(`Error: ${msg}`);
    } finally {
      setIsDeleting(false);
      setDeletingProduct(null);
    }
  }, [deletingProduct, showToast]);

  // Refresh data from server
  const handleRefreshData = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedStockStatus("all");
    setSelectedStatus("all");
    fetchProducts();
    fetchCategories();
    showToast("Refreshing product data from server...");
  }, [fetchProducts, fetchCategories, showToast]);

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
            onClick={handleRefreshData}
            title="Refresh products from server"
          >
            <RefreshCwIcon className="w-3.5 h-3.5 mr-1" />
            <span>Refresh</span>
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

          {/* Category Filter — dynamic from API */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-10 bg-[#10131F] text-xs text-[#F4F3ED] rounded-xl border border-[#2E364F] px-3 focus:border-[#C6F36A] outline-none transition-all"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
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
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[#9AA3B8]">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-2 border-[#C6F36A] border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs text-[#9AA3B8]">Loading products from server...</p>
                    </div>
                  </td>
                </tr>
              ) : loadError ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#9AA3B8]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircleIcon className="w-8 h-8 text-[#FF8066]" />
                      <p className="font-semibold text-sm text-[#FF8066]">
                        Failed to load products
                      </p>
                      <p className="text-xs text-[#657189] max-w-md">{loadError}</p>
                      <Button type="button" variant="card" size="sm" onClick={fetchProducts} className="mt-2">
                        <RefreshCwIcon className="w-3.5 h-3.5 mr-1" /> Retry
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#9AA3B8]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <PackageIcon className="w-8 h-8 text-[#657189]" />
                      <p className="font-semibold text-sm text-[#F4F3ED]">
                        {products.length === 0 ? "No products in inventory" : "No matching products found"}
                      </p>
                      <p className="text-xs text-[#657189]">
                        {products.length === 0
                          ? "Add your first product to get started"
                          : "Try adjusting your filters or search keywords"}
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
