import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { CategoryCard, CategoryCardProps } from "./CategoryCard";

export const CATEGORIES_DATA: CategoryCardProps[] = [
  {
    id: "electronics",
    name: "Electronics",
    subtitle: "High-performance audio, smart gadgets & tech",
    itemCount: "120+ Items",
    image: "/images/cat-electronics.jpg",
    href: "/shop?category=electronics",
    accent: "lime",
  },
  {
    id: "fashion",
    name: "Fashion",
    subtitle: "Modern apparel, outerwear & everyday essentials",
    itemCount: "85+ Items",
    image: "/images/cat-fashion.jpg",
    href: "/shop?category=fashion",
    accent: "coral",
  },
  {
    id: "home-living",
    name: "Home & Living",
    subtitle: "Aroma diffusers, ceramicware & ambient accents",
    itemCount: "64+ Items",
    image: "/images/cat-home-living.jpg",
    href: "/shop?category=home-living",
    accent: "lime",
  },
  {
    id: "beauty-care",
    name: "Beauty & Care",
    subtitle: "Organic botanicals, oils & grooming treatments",
    itemCount: "48+ Items",
    image: "/images/cat-beauty-care.jpg",
    href: "/shop?category=beauty-care",
    accent: "coral",
  },
  {
    id: "accessories",
    name: "Accessories",
    subtitle: "Everyday carry, precision watches & minimalist gear",
    itemCount: "92+ Items",
    image: "/images/cat-accessories.jpg",
    href: "/shop?category=accessories",
    accent: "lime",
  },
  {
    id: "lifestyle",
    name: "Lifestyle",
    subtitle: "Insulated drinkware, artisan journals & desk tools",
    itemCount: "56+ Items",
    image: "/images/cat-lifestyle.jpg",
    href: "/shop?category=lifestyle",
    accent: "coral",
  },
];

export const CategorySection: React.FC = () => {
  return (
    <section
      id="categories"
      aria-labelledby="categories-heading"
      className="py-20 lg:py-28 bg-[#10131F] text-[#F4F3ED] relative overflow-hidden"
    >
      {/* Background Subtle Ambience Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-0 w-96 h-96 bg-[#C6F36A]/5 rounded-full blur-[140px] pointer-events-none -translate-y-1/2"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/2 right-0 w-96 h-96 bg-[#FF8066]/5 rounded-full blur-[140px] pointer-events-none -translate-y-1/2"
      />

      <Container>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 mb-3">
              <Badge variant="lime" size="sm">
                Curated Collections
              </Badge>
              <span className="text-xs text-[#657189]">•</span>
              <span className="text-xs font-mono text-[#9AA3B8]">
                6 Core Sectors
              </span>
            </div>

            <h2
              id="categories-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F4F3ED]"
            >
              Browse by <span className="text-[#C6F36A]">Category</span>
            </h2>

            <p className="mt-3 text-sm sm:text-base text-[#9AA3B8] leading-relaxed">
              Explore thoughtfully selected items designed to elevate your routine,
              workstation, and lifestyle with guaranteed authenticity.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#F4F3ED] hover:text-[#C6F36A] transition-colors duration-200 group self-start md:self-end pb-1 border-b border-[#2E364F] hover:border-[#C6F36A]"
          >
            <span>View All Collections</span>
            <ArrowRightIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none" />
          </Link>
        </div>

        {/* 6 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {CATEGORIES_DATA.map((cat) => (
            <CategoryCard key={cat.id} {...cat} />
          ))}
        </div>
      </Container>
    </section>
  );
};
