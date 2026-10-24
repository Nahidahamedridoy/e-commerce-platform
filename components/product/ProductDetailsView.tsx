"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { setCartDrawerOpen } from "@/store/slices/uiSlice";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  StarIcon,
  CartIcon,
  CheckIcon,
  PlusIcon,
  MinusIcon,
  HeartIcon,
  ShieldCheckIcon,
  TruckIcon,
  RotateCcwIcon,
  SparklesIcon,
} from "@/components/ui/Icons";
import { ProductCard, ProductItem } from "@/components/home/ProductCard";
import { ProductDetail } from "@/lib/data/products";

interface ProductDetailsViewProps {
  product: ProductDetail;
  relatedProducts: ProductItem[];
}

export const ProductDetailsView: React.FC<ProductDetailsViewProps> = ({
  product,
  relatedProducts,
}) => {
  const dispatch = useAppDispatch();

  // Active gallery image
  const [selectedImage, setSelectedImage] = useState(
    product.gallery[0] || product.image
  );
  // Quantity state
  const [quantity, setQuantity] = useState(1);
  // Added state feedback
  const [isAdded, setIsAdded] = useState(false);
  // Wishlist toggle
  const [isWishlisted, setIsWishlisted] = useState(false);
  // Active Tab: overview, specs, shipping
  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "shipping">(
    "overview"
  );

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: `cart-${product.id}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
      })
    );

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      dispatch(setCartDrawerOpen(true));
    }, 1200);
  };

  const incrementQty = () => {
    if (quantity < (product.stockCount || 10)) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="bg-[#10131F] text-[#F4F3ED] min-h-screen py-10 lg:py-16">
      <Container>
        {/* 1. Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap items-center gap-2 text-xs text-[#9AA3B8]"
        >
          <Link href="/" className="hover:text-[#C6F36A] transition-colors">
            Home
          </Link>
          <span className="text-[#657189]">/</span>
          <Link href="/shop" className="hover:text-[#C6F36A] transition-colors">
            Shop
          </Link>
          <span className="text-[#657189]">/</span>
          <Link
            href={`/shop?category=${product.category.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
            className="hover:text-[#C6F36A] transition-colors"
          >
            {product.category}
          </Link>
          <span className="text-[#657189]">/</span>
          <span className="text-[#F4F3ED] truncate max-w-xs sm:max-w-md font-semibold">
            {product.name}
          </span>
        </nav>

        {/* 2. Main Product Hero Details (2-Column Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
          {/* Left Column: Image Gallery (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Large Main Showcase Frame */}
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-[#22283A] border border-[#2E364F] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85)]">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-all duration-300 ease-out motion-reduce:transition-none"
              />

              {/* Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#22283A]/60 via-transparent to-transparent pointer-events-none" />

              {/* Badges Container */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
                <span className="px-3 py-1 rounded-full bg-[#10131F]/90 backdrop-blur-md border border-[#2E364F] text-xs font-semibold text-[#9AA3B8] uppercase tracking-wider">
                  {product.category}
                </span>

                {product.discountPercentage ? (
                  <span className="px-2.5 py-1 rounded-full bg-[#FF8066] text-[#10131F] text-xs font-black shadow-[0_0_15px_rgba(255,128,102,0.4)]">
                    -{product.discountPercentage}% OFF
                  </span>
                ) : product.badge ? (
                  <Badge variant={product.badge === "HOT" ? "coral" : "lime"} size="sm">
                    {product.badge}
                  </Badge>
                ) : null}
              </div>
            </div>

            {/* Thumbnail Navigation Row */}
            <div className="grid grid-cols-4 gap-3">
              {product.gallery.map((img, idx) => {
                const isSelected = selectedImage === img;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    aria-label={`View thumbnail ${idx + 1}`}
                    className={`relative aspect-square rounded-xl overflow-hidden bg-[#22283A] border transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C6F36A] hover:-translate-y-0.5 motion-reduce:transform-none ${
                      isSelected
                        ? "border-[#C6F36A] shadow-[0_0_15px_rgba(198,243,106,0.35)] scale-[1.02]"
                        : "border-[#2E364F] opacity-70 hover:opacity-100 hover:border-[#3E496A]"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      fill
                      sizes="120px"
                      className="object-cover object-center"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Product Info & Actions (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Rating Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <span className="text-xs font-mono font-bold tracking-widest text-[#C6F36A] uppercase">
                  SKU: {product.sku}
                </span>

                <div className="flex items-center gap-2">
                  <div className="flex items-center text-[#C6F36A]">
                    <StarIcon className="w-4 h-4 fill-[#C6F36A]" />
                  </div>
                  <span className="text-sm font-bold text-[#F4F3ED] font-mono">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-[#9AA3B8]">
                    ({product.reviewCount} verified reviews)
                  </span>
                </div>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#F4F3ED] leading-tight">
                {product.name}
              </h1>

              {/* Price & Discount Bar */}
              <div className="mt-4 p-4 rounded-2xl bg-[#22283A] border border-[#2E364F] flex flex-wrap items-baseline justify-between gap-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black font-mono text-[#F4F3ED]">
                    ৳{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-base font-mono text-[#657189] line-through">
                      ৳{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {product.originalPrice && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF8066]/15 text-xs font-bold text-[#FF8066] border border-[#FF8066]/30">
                    <SparklesIcon className="w-3.5 h-3.5" />
                    Save ৳{(product.originalPrice - product.price).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Availability Stock Indicator */}
              <div className="mt-4 flex items-center gap-2 text-xs">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C6F36A] opacity-75 motion-reduce:animate-none" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C6F36A]" />
                </span>
                <span className="font-semibold text-[#F4F3ED]">
                  In Stock & Ready to Dispatch
                </span>
                <span className="text-[#657189]">•</span>
                <span className="text-[#9AA3B8]">
                  Only {product.stockCount} units remaining
                </span>
              </div>

              {/* Short Description */}
              <p className="mt-5 text-sm sm:text-base text-[#9AA3B8] leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Interactive Quantity & Action Buttons */}
            <div className="pt-6 border-t border-[#2E364F] space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                {/* Quantity Control Box */}
                <div className="flex items-center border border-[#2E364F] rounded-2xl bg-[#171B2B] p-1">
                  <button
                    type="button"
                    onClick={decrementQty}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-[#9AA3B8] hover:text-[#C6F36A] hover:bg-[#22283A] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-mono font-bold text-sm sm:text-base text-[#F4F3ED]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={incrementQty}
                    disabled={quantity >= product.stockCount}
                    aria-label="Increase quantity"
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-[#9AA3B8] hover:text-[#C6F36A] hover:bg-[#22283A] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Primary Add to Cart Button */}
                <Button
                  variant="lime"
                  size="lg"
                  onClick={handleAddToCart}
                  className="flex-1 min-w-[200px] h-13 text-sm font-bold gap-2.5 shadow-[0_0_25px_rgba(198,243,106,0.3)] hover:shadow-[0_0_35px_rgba(198,243,106,0.5)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transform-none"
                >
                  {isAdded ? (
                    <>
                      <CheckIcon className="w-4 h-4" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <CartIcon className="w-4 h-4" />
                      <span>
                        Add to Cart • ৳{(product.price * quantity).toLocaleString()}
                      </span>
                    </>
                  )}
                </Button>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  aria-label="Add to wishlist"
                  className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isWishlisted
                      ? "bg-[#FF8066]/20 border-[#FF8066] text-[#FF8066] shadow-[0_0_15px_rgba(255,128,102,0.3)]"
                      : "bg-[#22283A] border-[#2E364F] text-[#9AA3B8] hover:text-[#FF8066] hover:border-[#FF8066]/60"
                  }`}
                >
                  <HeartIcon
                    className={`w-5 h-5 ${isWishlisted ? "fill-[#FF8066]" : ""}`}
                  />
                </button>
              </div>

              {/* Delivery Micro Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#2E364F]/60">
                <div className="flex items-center gap-2 text-xs text-[#9AA3B8]">
                  <TruckIcon className="w-4 h-4 text-[#C6F36A] shrink-0" />
                  <span>24-48h Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#9AA3B8]">
                  <RotateCcwIcon className="w-4 h-4 text-[#FF8066] shrink-0" />
                  <span>7-Day Return Policy</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#9AA3B8]">
                  <ShieldCheckIcon className="w-4 h-4 text-[#C6F36A] shrink-0" />
                  <span>100% Genuine</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Product Tabs: Overview, Key Specs, Delivery Details */}
        <div className="mt-16 sm:mt-24">
          {/* Tab Navigation */}
          <div className="flex items-center gap-3 border-b border-[#2E364F] pb-px overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "overview"
                  ? "border-[#C6F36A] text-[#C6F36A]"
                  : "border-transparent text-[#9AA3B8] hover:text-[#F4F3ED]"
              }`}
            >
              Overview & Features
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("specs")}
              className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "specs"
                  ? "border-[#C6F36A] text-[#C6F36A]"
                  : "border-transparent text-[#9AA3B8] hover:text-[#F4F3ED]"
              }`}
            >
              Key Specifications
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("shipping")}
              className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "shipping"
                  ? "border-[#C6F36A] text-[#C6F36A]"
                  : "border-transparent text-[#9AA3B8] hover:text-[#F4F3ED]"
              }`}
            >
              Delivery & Warranty
            </button>
          </div>

          {/* Tab Content Box */}
          <div className="mt-8 rounded-3xl bg-[#22283A] border border-[#2E364F] p-6 sm:p-10">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-[#F4F3ED]">
                  Product Highlights
                </h3>
                <p className="text-sm sm:text-base text-[#9AA3B8] leading-relaxed max-w-3xl">
                  {product.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {product.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 rounded-xl bg-[#171B2B] border border-[#2E364F]/70"
                    >
                      <div className="h-5 w-5 rounded-full bg-[#C6F36A]/15 border border-[#C6F36A]/30 flex items-center justify-center shrink-0 mt-0.5 text-[#C6F36A]">
                        <CheckIcon className="w-3 h-3" />
                      </div>
                      <span className="text-xs sm:text-sm text-[#F4F3ED]">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-[#F4F3ED]">
                  Technical Specifications
                </h3>
                <div className="divide-y divide-[#2E364F]/70 border border-[#2E364F] rounded-2xl overflow-hidden bg-[#171B2B]">
                  {product.specs.map((spec, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 sm:grid-cols-3 p-4 text-xs sm:text-sm"
                    >
                      <div className="font-semibold text-[#9AA3B8]">
                        {spec.label}
                      </div>
                      <div className="sm:col-span-2 font-mono text-[#F4F3ED] mt-1 sm:mt-0">
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-[#F4F3ED]">
                  Delivery & Warranty Guarantee
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-[#171B2B] border border-[#2E364F] space-y-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#C6F36A]">
                      <TruckIcon className="w-4 h-4" />
                      <span>Express Nationwide Logistics</span>
                    </div>
                    <p className="text-xs text-[#9AA3B8] leading-relaxed">
                      Orders are dispatched directly from our Dhaka fulfilment hub.
                      Dhaka metro: 24 hours. Outside Dhaka: 48–72 hours via verified
                      courier partner. Orders over ৳5,000 enjoy 100% Free Shipping.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#171B2B] border border-[#2E364F] space-y-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#FF8066]">
                      <RotateCcwIcon className="w-4 h-4" />
                      <span>7-Day Replacement Policy</span>
                    </div>
                    <p className="text-xs text-[#9AA3B8] leading-relaxed">
                      If you receive a defective or non-matching product, contact
                      our 24/7 support desk within 7 days for a hassle-free instant
                      replacement or full store credit.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 sm:mt-28 pt-12 border-t border-[#2E364F]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <Badge variant="lime" size="sm" className="mb-2">
                  CURATED RECOMMENDATIONS
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F4F3ED]">
                  Related Products & Upgrades
                </h2>
              </div>
              <Link
                href={`/shop?category=${product.category.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                className="text-xs sm:text-sm font-semibold text-[#C6F36A] hover:underline"
              >
                More in {product.category} →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} {...rel} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};
