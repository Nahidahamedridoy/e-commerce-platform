"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { CartIcon, StarIcon, CheckIcon } from "@/components/ui/Icons";

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: "HOT" | "SALE" | "NEW" | "POPULAR";
}

export const ProductCard: React.FC<ProductItem> = ({
  id,
  name,
  category,
  price,
  originalPrice,
  discountPercentage,
  rating,
  reviewCount,
  image,
  badge,
}) => {
  const dispatch = useAppDispatch();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      addToCart({
        id: `cart-${id}-${Date.now()}`,
        productId: id,
        name,
        price,
        image,
        quantity: 1,
      })
    );

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#22283A] border border-[#2E364F] transition-all duration-300 hover:border-[#3E496A] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] motion-reduce:transform-none motion-reduce:transition-none">
      {/* Top Image Area */}
      <Link href={`/products/${id}`} className="block focus:outline-none">
        <div className="relative aspect-square w-full overflow-hidden bg-[#171B2B]">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-108 motion-reduce:transform-none"
          />

          {/* Vignette Overlay for dark contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#22283A] via-transparent to-transparent opacity-50 group-hover:opacity-30 transition-opacity duration-300" />

          {/* Badges Container */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            {/* Category Pill */}
            <span className="px-2.5 py-1 rounded-full bg-[#10131F]/80 backdrop-blur-md border border-[#2E364F] text-[10px] font-semibold uppercase tracking-wider text-[#9AA3B8]">
              {category}
            </span>

            {/* Status / Discount Badge */}
            {discountPercentage ? (
              <span className="px-2 py-0.5 rounded-full bg-[#FF8066] text-[#10131F] text-[11px] font-black tracking-tight shadow-[0_0_12px_rgba(255,128,102,0.4)]">
                -{discountPercentage}%
              </span>
            ) : badge ? (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${
                  badge === "HOT" || badge === "SALE"
                    ? "bg-[#FF8066]/20 text-[#FF8066] border border-[#FF8066]/40"
                    : "bg-[#C6F36A]/20 text-[#C6F36A] border border-[#C6F36A]/40"
                }`}
              >
                {badge}
              </span>
            ) : null}
          </div>
        </div>
      </Link>

      {/* Product Content Details */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          {/* Rating & Review Count */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center text-[#C6F36A]">
              <StarIcon className="w-3.5 h-3.5 fill-[#C6F36A]" />
            </div>
            <span className="text-xs font-semibold text-[#F4F3ED] font-mono">
              {rating.toFixed(1)}
            </span>
            <span className="text-[11px] text-[#657189]">
              ({reviewCount} reviews)
            </span>
          </div>

          {/* Product Title */}
          <Link href={`/products/${id}`} className="block group/title focus:outline-none">
            <h3 className="text-sm sm:text-base font-bold text-[#F4F3ED] line-clamp-2 leading-snug group-hover/title:text-[#C6F36A] transition-colors duration-200">
              {name}
            </h3>
          </Link>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="pt-3 border-t border-[#2E364F]/50 flex items-center justify-between gap-3">
          {/* Price */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black font-mono text-[#F4F3ED]">
                ৳{price.toLocaleString()}
              </span>
            </div>
            {originalPrice && (
              <span className="text-xs font-mono text-[#657189] line-through">
                ৳{originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            aria-label={`Add ${name} to cart`}
            className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 active:scale-95 motion-reduce:transform-none ${
              isAdded
                ? "bg-[#C6F36A] text-[#10131F] shadow-[0_0_15px_rgba(198,243,106,0.4)]"
                : "bg-[#171B2B] text-[#F4F3ED] border border-[#2E364F] hover:bg-[#C6F36A] hover:border-[#C6F36A] hover:text-[#10131F] hover:shadow-[0_0_15px_rgba(198,243,106,0.25)] focus-visible:ring-[#C6F36A]"
            }`}
          >
            {isAdded ? (
              <>
                <CheckIcon className="w-3.5 h-3.5" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <CartIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
