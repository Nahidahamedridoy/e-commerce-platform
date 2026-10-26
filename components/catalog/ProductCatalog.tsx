"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  SearchIcon,
  FilterIcon,
  CloseIcon,
  RotateCcwIcon,
  ChevronDownIcon,
} from "@/components/ui/Icons";
import { ProductCard, ProductItem } from "@/components/home/ProductCard";
import { ALL_PRODUCTS } from "@/lib/data/products";
import { productsApi, categoriesApi } from "@/lib/api";

const DEFAULT_CATEGORIES = [
  "All",
  "Electronics",
  "Fashion",
  "Home & Living",
  "Beauty & Care",
  "Accessories",
  "Lifestyle",
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured Picks" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "discount", label: "Biggest Discount" },
];

export const ProductCatalog: React.FC = () => {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get("category");

  const [categoriesList, setCategoriesList] = useState<string[]>(DEFAULT_CATEGORIES);
  const [apiProducts, setApiProducts] = useState<ProductItem[] | null>(null);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState<"connected" | "fallback">("fallback");

  // Derive initial category from URL parameter without an effect
  const initialCategory = useMemo(() => {
    if (!initialCategoryParam) return "All";
    const match = categoriesList.find(
      (c) =>
        c.toLowerCase().replace(/[^a-z0-9]/g, "-") ===
        initialCategoryParam.toLowerCase()
    );
    return match || "All";
  }, [initialCategoryParam, categoriesList]);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [userSelectedCategory, setUserSelectedCategory] = useState<string | null>(null);
  const selectedCategory = userSelectedCategory !== null ? userSelectedCategory : initialCategory;
  const setSelectedCategory = (cat: string) => setUserSelectedCategory(cat);

  const [maxPrice, setMaxPrice] = useState<number>(30000);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [onlyDeals, setOnlyDeals] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Fetch live products & categories from Express backend
  useEffect(() => {
    let mounted = true;
    setIsProductsLoading(true);

    Promise.allSettled([
      productsApi.getAll({ limit: 100 }),
      categoriesApi.getAll(),
    ]).then(([prodRes, catRes]) => {
      if (!mounted) return;

      if (catRes.status === "fulfilled" && catRes.value && catRes.value.length > 0) {
        setCategoriesList(["All", ...catRes.value.map((c) => c.name)]);
      }

      if (prodRes.status === "fulfilled" && prodRes.value?.products?.length > 0) {
        const mapped: ProductItem[] = prodRes.value.products.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category?.name || "General",
          price: p.price,
          rating: 4.8,
          reviewCount: 16,
          image: p.images?.[0] || "/images/hero-showcase.jpg",
          badge: p.stock > 0 && p.stock < 5 ? ("LIMITED" as any) : undefined,
        }));
        setApiProducts(mapped);
        setBackendStatus("connected");
      } else {
        setApiProducts(null);
        setBackendStatus("fallback");
      }
      setIsProductsLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  // Lock body scroll when mobile filter is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileFilterOpen]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "All") count++;
    if (searchQuery.trim()) count++;
    if (maxPrice < 30000 || minPrice > 0) count++;
    if (onlyDeals) count++;
    return count;
  }, [selectedCategory, searchQuery, maxPrice, minPrice, onlyDeals]);

  const sourceProducts = useMemo(() => {
    return apiProducts && apiProducts.length > 0 ? apiProducts : ALL_PRODUCTS;
  }, [apiProducts]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return sourceProducts.filter((product) => {
      // Category filter
      if (selectedCategory !== "All" && product.category !== selectedCategory) {
        return false;
      }
      // Price range filter
      if (product.price < minPrice || product.price > maxPrice) {
        return false;
      }
      // Deals only filter
      if (onlyDeals && !product.discountPercentage) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = product.name.toLowerCase().includes(query);
        const matchCategory = product.category.toLowerCase().includes(query);
        if (!matchName && !matchCategory) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "discount")
        return (b.discountPercentage || 0) - (a.discountPercentage || 0);
      return 0; // featured (default order)
    });
  }, [sourceProducts, selectedCategory, minPrice, maxPrice, onlyDeals, searchQuery, sortBy]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: sourceProducts.length };
    sourceProducts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [sourceProducts]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setMinPrice(0);
    setMaxPrice(30000);
    setOnlyDeals(false);
    setSortBy("featured");
  };

  return (
    <div className="bg-[#10131F] text-[#F4F3ED] min-h-screen py-10 lg:py-16">
      <Container>
        {/* 1. Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[#9AA3B8]">
          <Link href="/" className="hover:text-[#C6F36A] transition-colors">
            Home
          </Link>
          <span className="text-[#657189]">/</span>
          <span className="text-[#C6F36A] font-semibold">Shop</span>
          {selectedCategory !== "All" && (
            <>
              <span className="text-[#657189]">/</span>
              <span className="text-[#F4F3ED]">{selectedCategory}</span>
            </>
          )}
        </nav>

        {/* 2. Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#2E364F]">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <Badge variant="lime" size="sm">
                Curated Catalog
              </Badge>
              <span className="text-xs text-[#657189]">•</span>
              <span className="text-xs font-mono text-[#9AA3B8]">
                Authenticity Guaranteed
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#F4F3ED]">
              Explore All <span className="text-[#C6F36A]">Products</span>
            </h1>

            <p className="mt-3 text-sm sm:text-base text-[#9AA3B8] max-w-xl leading-relaxed">
              Discover verified acoustic monitors, everyday carry gear, smart
              devices, and elevated lifestyle essentials.
            </p>
          </div>

          {/* Live Product Counter */}
          <div className="self-start md:self-end">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#22283A] border border-[#2E364F] text-xs font-mono text-[#F4F3ED]">
              <span className="h-2 w-2 rounded-full bg-[#C6F36A]" />
              <span>
                Showing <strong>{filteredProducts.length}</strong> of{" "}
                <strong>{ALL_PRODUCTS.length}</strong> Products
              </span>
            </span>
          </div>
        </div>

        {/* 3. Search and Mobile Filter Trigger Bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full sm:max-w-md">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#657189] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, category..."
              className="w-full h-11 bg-[#171B2B] text-xs sm:text-sm text-[#F4F3ED] placeholder-[#657189] rounded-xl pl-10 pr-9 border border-[#2E364F] focus:border-[#C6F36A] focus:ring-1 focus:ring-[#C6F36A] outline-none transition-all duration-200 hover:border-[#3E496A]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#657189] hover:text-[#F4F3ED]"
              >
                ×
              </button>
            )}
          </div>

          {/* Right Controls: Sort Dropdown & Mobile Filter Button */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Mobile Filters Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#22283A] text-xs font-semibold text-[#F4F3ED] border border-[#2E364F] hover:border-[#C6F36A] transition-colors cursor-pointer"
            >
              <FilterIcon className="w-4 h-4 text-[#C6F36A]" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C6F36A] text-[10px] font-bold text-[#10131F]">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Select */}
            <div className="relative flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-11 bg-[#22283A] text-xs sm:text-sm text-[#F4F3ED] rounded-xl pl-4 pr-10 border border-[#2E364F] focus:border-[#C6F36A] focus:outline-none appearance-none cursor-pointer transition-colors hover:border-[#3E496A]"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#22283A] text-[#F4F3ED]">
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-3.5 w-4 h-4 text-[#657189] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 4. Main Body: Sidebar Filters & Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-2">
          {/* Desktop Filter Sidebar (3 cols on LG) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24">
            <div className="p-6 rounded-2xl bg-[#22283A] border border-[#2E364F] space-y-6">
              {/* Header with Reset */}
              <div className="flex items-center justify-between pb-4 border-b border-[#2E364F]/70">
                <div className="flex items-center gap-2">
                  <FilterIcon className="w-4 h-4 text-[#C6F36A]" />
                  <h3 className="text-sm font-bold text-[#F4F3ED]">Filters</h3>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-[11px] text-[#9AA3B8] hover:text-[#FF8066] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcwIcon className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#9AA3B8] mb-3">
                  Category
                </h4>
                <div className="space-y-1">
                  {categoriesList.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-[#10131F] text-[#C6F36A] border border-[#C6F36A]/40 font-bold"
                          : "text-[#9AA3B8] hover:bg-[#10131F]/60 hover:text-[#F4F3ED]"
                      }`}
                    >
                      <span>{cat}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#171B2B] text-[#657189]">
                        {categoryCounts[cat] || 0}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="pt-4 border-t border-[#2E364F]/70">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#9AA3B8]">
                    Max Price
                  </h4>
                  <span className="text-xs font-mono font-bold text-[#C6F36A]">
                    ৳{maxPrice.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="30000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#C6F36A] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#657189] font-mono mt-1">
                  <span>৳2,000</span>
                  <span>৳30,000</span>
                </div>

                {/* Quick Price Range Presets */}
                <div className="grid grid-cols-2 gap-1.5 mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMinPrice(0);
                      setMaxPrice(5000);
                    }}
                    className="px-2 py-1.5 text-[11px] rounded-lg bg-[#171B2B] text-[#9AA3B8] hover:text-[#F4F3ED] border border-[#2E364F] hover:border-[#3E496A] text-left transition-colors cursor-pointer"
                  >
                    Under ৳5,000
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMinPrice(5000);
                      setMaxPrice(15000);
                    }}
                    className="px-2 py-1.5 text-[11px] rounded-lg bg-[#171B2B] text-[#9AA3B8] hover:text-[#F4F3ED] border border-[#2E364F] hover:border-[#3E496A] text-left transition-colors cursor-pointer"
                  >
                    ৳5K – ৳15K
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMinPrice(15000);
                      setMaxPrice(30000);
                    }}
                    className="px-2 py-1.5 text-[11px] rounded-lg bg-[#171B2B] text-[#9AA3B8] hover:text-[#F4F3ED] border border-[#2E364F] hover:border-[#3E496A] text-left transition-colors cursor-pointer"
                  >
                    Over ৳15,000
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMinPrice(0);
                      setMaxPrice(30000);
                    }}
                    className="px-2 py-1.5 text-[11px] rounded-lg bg-[#171B2B] text-[#9AA3B8] hover:text-[#F4F3ED] border border-[#2E364F] hover:border-[#3E496A] text-left transition-colors cursor-pointer"
                  >
                    All Prices
                  </button>
                </div>
              </div>

              {/* Deals Only Checkbox */}
              <div className="pt-4 border-t border-[#2E364F]/70">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#F4F3ED]">
                  <input
                    type="checkbox"
                    checked={onlyDeals}
                    onChange={(e) => setOnlyDeals(e.target.checked)}
                    className="h-4 w-4 rounded border-[#2E364F] bg-[#10131F] text-[#C6F36A] focus:ring-[#C6F36A] cursor-pointer accent-[#C6F36A]"
                  />
                  <span>On Sale / Deals Only</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF8066]" />
                </label>
              </div>
            </div>
          </aside>

          {/* Right Product Grid Area (9 cols on LG) */}
          <main className="lg:col-span-9">
            {/* Active Filters Pill Bar */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6 p-3 rounded-xl bg-[#22283A] border border-[#2E364F]">
                <span className="text-xs text-[#657189] font-medium mr-1">
                  Active Filters:
                </span>
                {selectedCategory !== "All" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#10131F] text-xs font-medium text-[#C6F36A] border border-[#C6F36A]/30">
                    <span>{selectedCategory}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory("All")}
                      aria-label="Remove category filter"
                      className="hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#10131F] text-xs font-medium text-[#F4F3ED] border border-[#2E364F]">
                    <span>&quot;{searchQuery}&quot;</span>
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      aria-label="Remove search query"
                      className="hover:text-[#FF8066]"
                    >
                      ×
                    </button>
                  </span>
                )}
                {(maxPrice < 30000 || minPrice > 0) && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#10131F] text-xs font-mono text-[#F4F3ED] border border-[#2E364F]">
                    <span>
                      ৳{minPrice.toLocaleString()} - ৳{maxPrice.toLocaleString()}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setMinPrice(0);
                        setMaxPrice(30000);
                      }}
                      aria-label="Reset price filter"
                      className="hover:text-[#FF8066]"
                    >
                      ×
                    </button>
                  </span>
                )}
                {onlyDeals && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FF8066]/15 text-xs font-medium text-[#FF8066] border border-[#FF8066]/30">
                    <span>Deals Only</span>
                    <button
                      type="button"
                      onClick={() => setOnlyDeals(false)}
                      aria-label="Remove deals filter"
                      className="hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-[#9AA3B8] hover:text-[#FF8066] ml-auto underline transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Product Grid or Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="p-12 sm:p-16 rounded-3xl bg-[#22283A] border border-[#2E364F] text-center flex flex-col items-center justify-center">
                <div className="h-16 w-16 rounded-2xl bg-[#171B2B] border border-[#2E364F] flex items-center justify-center mb-4 text-[#657189]">
                  <SearchIcon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#F4F3ED]">
                  No matching products found
                </h3>
                <p className="text-sm text-[#9AA3B8] max-w-md mt-2 mb-6">
                  We couldn&apos;t find any items matching your current filters.
                  Try clearing your search terms or expanding your price range.
                </p>
                <Button
                  variant="lime"
                  size="md"
                  onClick={handleResetFilters}
                  className="gap-2"
                >
                  <RotateCcwIcon className="w-4 h-4" />
                  <span>Reset All Filters</span>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </Container>

      {/* 5. Responsive Mobile Filter Drawer */}
      <div
        className={`fixed inset-0 z-50 transition-visibility duration-300 lg:hidden ${
          isMobileFilterOpen
            ? "pointer-events-auto visible"
            : "pointer-events-none invisible"
        }`}
        aria-hidden={!isMobileFilterOpen}
      >
        {/* Backdrop */}
        <div
          onClick={() => setIsMobileFilterOpen(false)}
          className={`fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none ${
            isMobileFilterOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Drawer Panel */}
        <div
          className={`fixed right-0 top-0 bottom-0 w-full max-w-sm bg-[#10131F] border-l border-[#2E364F] shadow-2xl flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none ${
            isMobileFilterOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#2E364F]">
              <div className="flex items-center gap-2">
                <FilterIcon className="w-4 h-4 text-[#C6F36A]" />
                <h3 className="text-base font-bold text-[#F4F3ED]">
                  Filter Products
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-lg text-[#9AA3B8] hover:text-white"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Filters Content */}
            <div className="p-5 space-y-6">
              {/* Category */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#9AA3B8] mb-3">
                  Category
                </h4>
                <div className="space-y-1">
                  {categoriesList.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium ${
                        selectedCategory === cat
                          ? "bg-[#22283A] text-[#C6F36A] border border-[#C6F36A]/40 font-bold"
                          : "text-[#9AA3B8] hover:bg-[#22283A]/50"
                      }`}
                    >
                      <span>{cat}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#171B2B] text-[#657189]">
                        {categoryCounts[cat] || 0}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="pt-4 border-t border-[#2E364F]">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#9AA3B8]">
                    Max Price
                  </h4>
                  <span className="text-xs font-mono font-bold text-[#C6F36A]">
                    ৳{maxPrice.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="30000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#C6F36A]"
                />
              </div>

              {/* Deals Only */}
              <div className="pt-4 border-t border-[#2E364F]">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#F4F3ED]">
                  <input
                    type="checkbox"
                    checked={onlyDeals}
                    onChange={(e) => setOnlyDeals(e.target.checked)}
                    className="h-4 w-4 rounded border-[#2E364F] bg-[#10131F] text-[#C6F36A] accent-[#C6F36A]"
                  />
                  <span>On Sale / Deals Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-5 border-t border-[#2E364F] bg-[#171B2B]/50 flex items-center gap-3">
            <Button
              variant="card"
              size="md"
              onClick={handleResetFilters}
              className="flex-1"
            >
              Reset
            </Button>
            <Button
              variant="lime"
              size="md"
              onClick={() => setIsMobileFilterOpen(false)}
              className="flex-1"
            >
              Apply ({filteredProducts.length})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
