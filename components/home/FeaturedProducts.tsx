"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { ProductCard, ProductItem } from "./ProductCard";

export const FEATURED_PRODUCTS_DATA: ProductItem[] = [
  {
    id: "prod-1",
    name: "Obsidian ANC Wireless Studio Headphones",
    category: "Electronics",
    price: 18500,
    originalPrice: 21800,
    discountPercentage: 15,
    rating: 4.9,
    reviewCount: 142,
    image: "/images/hero-showcase.jpg",
    badge: "HOT",
  },
  {
    id: "prod-2",
    name: "Aura Pro Wireless Earbuds & Charging Case",
    category: "Electronics",
    price: 8200,
    originalPrice: 9900,
    discountPercentage: 17,
    rating: 4.8,
    reviewCount: 96,
    image: "/images/cat-electronics.jpg",
    badge: "SALE",
  },
  {
    id: "prod-3",
    name: "Stealth All-Weather Techwear Shell Jacket",
    category: "Fashion",
    price: 14900,
    rating: 4.9,
    reviewCount: 68,
    image: "/images/cat-fashion.jpg",
    badge: "NEW",
  },
  {
    id: "prod-4",
    name: "Komorebi Ceramic Ultrasonic Mist Diffuser",
    category: "Home & Living",
    price: 4800,
    originalPrice: 6000,
    discountPercentage: 20,
    rating: 4.7,
    reviewCount: 84,
    image: "/images/cat-home-living.jpg",
    badge: "POPULAR",
  },
  {
    id: "prod-5",
    name: "Nirvana Midnight Botanical Facial Elixir",
    category: "Beauty & Care",
    price: 3400,
    originalPrice: 4000,
    discountPercentage: 15,
    rating: 4.9,
    reviewCount: 112,
    image: "/images/cat-beauty-care.jpg",
    badge: "HOT",
  },
  {
    id: "prod-6",
    name: "Vanguard Automatic Field Watch & EDC Kit",
    category: "Accessories",
    price: 24500,
    rating: 5.0,
    reviewCount: 53,
    image: "/images/cat-accessories.jpg",
    badge: "POPULAR",
  },
  {
    id: "prod-7",
    name: "Mono Vacuum Insulated Travel Tumbler 500ml",
    category: "Lifestyle",
    price: 2650,
    originalPrice: 3200,
    discountPercentage: 17,
    rating: 4.8,
    reviewCount: 79,
    image: "/images/cat-lifestyle.jpg",
    badge: "SALE",
  },
  {
    id: "prod-8",
    name: "Apex Smartwatch & Magnetic Fast Charger",
    category: "Electronics",
    price: 11900,
    originalPrice: 14000,
    discountPercentage: 15,
    rating: 4.8,
    reviewCount: 124,
    image: "/images/hero-showcase.jpg",
    badge: "NEW",
  },
];

export const FeaturedProducts: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "Electronics",
    "Fashion",
    "Home & Living",
    "Beauty & Care",
    "Accessories",
    "Lifestyle",
  ];

  const filteredProducts =
    selectedCategory === "All"
      ? FEATURED_PRODUCTS_DATA
      : FEATURED_PRODUCTS_DATA.filter((p) => p.category === selectedCategory);

  return (
    <section
      id="featured"
      aria-labelledby="featured-heading"
      className="py-20 lg:py-28 bg-[#10131F] text-[#F4F3ED] relative overflow-hidden"
    >
      <Container>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <Badge variant="lime" size="sm">
                HANDPICKED UPGRADES
              </Badge>
              <span className="text-xs text-[#657189]">•</span>
              <span className="text-xs font-mono text-[#9AA3B8]">
                Top Rated Everyday Finds
              </span>
            </div>

            <h2
              id="featured-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F4F3ED]"
            >
              Featured <span className="text-[#C6F36A]">Products</span>
            </h2>

            <p className="mt-3 text-sm sm:text-base text-[#9AA3B8] max-w-xl leading-relaxed">
              Discover verified premium products crafted for durability, modern
              ergonomics, and effortless living in Bangladesh.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#F4F3ED] hover:text-[#C6F36A] transition-colors duration-200 group self-start md:self-end pb-1 border-b border-[#2E364F] hover:border-[#C6F36A]"
          >
            <span>Browse Full Store</span>
            <ArrowRightIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none" />
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C6F36A] ${
                selectedCategory === cat
                  ? "bg-[#C6F36A] text-[#10131F] shadow-[0_0_15px_rgba(198,243,106,0.3)]"
                  : "bg-[#22283A] text-[#9AA3B8] border border-[#2E364F] hover:border-[#3E496A] hover:text-[#F4F3ED]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 8 Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </Container>
    </section>
  );
};
