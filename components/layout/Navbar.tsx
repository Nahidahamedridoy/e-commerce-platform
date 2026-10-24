"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { toggleCartDrawer, toggleMobileMenu } from "@/store/slices/uiSlice";
import {
  CartIcon,
  SearchIcon,
  UserIcon,
  MenuIcon,
  ChevronDownIcon,
  SparklesIcon,
} from "@/components/ui/Icons";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "./MobileMenu";

export const SAMPLE_CATEGORIES = [
  { name: "Electronics", slug: "electronics", count: 120 },
  { name: "Fashion", slug: "fashion", count: 85 },
  { name: "Home & Living", slug: "home-living", count: 64 },
  { name: "Beauty & Care", slug: "beauty-care", count: 48 },
  { name: "Accessories", slug: "accessories", count: 92 },
  { name: "Lifestyle", slug: "lifestyle", count: 56 },
];

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const totalCartQuantity = useAppSelector((state) => state.cart.totalQuantity);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Skip rendering storefront navbar on /admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // Monitor scroll for elevation styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close categories dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoriesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 motion-reduce:transition-none ${
          isScrolled
            ? "bg-[#10131F]/95 backdrop-blur-md border-b border-[#2E364F] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.7)]"
            : "bg-[#10131F] border-b border-[#2E364F]/60"
        }`}
      >
        <Container>
          <div className="flex h-20 items-center justify-between gap-3 sm:gap-6">
            {/* 1. Amar Dokan Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6F36A] rounded-xl"
            >
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-[#22283A] border border-[#2E364F] shadow-inner transition-transform duration-200 group-hover:scale-105 group-hover:border-[#C6F36A] motion-reduce:transform-none">
                <div className="h-3.5 w-3.5 rounded-full bg-[#C6F36A] shadow-[0_0_12px_#C6F36A]" />
                <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#FF8066]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-[#F4F3ED] transition-colors duration-200 group-hover:text-[#C6F36A]">
                  AMAR DOKAN
                </span>
                <span className="text-[10px] font-semibold tracking-widest text-[#9AA3B8] uppercase">
                  Premium Store
                </span>
              </div>
            </Link>

            {/* 2. Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#9AA3B8]">
              {/* Home */}
              <Link
                href="/"
                className="relative py-1 text-[#F4F3ED] transition-colors duration-200 hover:text-[#C6F36A] group"
              >
                <span>Home</span>
                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#C6F36A] rounded-full scale-x-100 transition-transform duration-200" />
              </Link>

              {/* Shop */}
              <Link
                href="/shop"
                className="relative py-1 transition-colors duration-200 hover:text-[#C6F36A] group"
              >
                <span>Shop</span>
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#C6F36A] rounded-full transition-all duration-200 group-hover:w-full" />
              </Link>

              {/* Categories Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  onMouseEnter={() => setIsCategoriesOpen(true)}
                  className={`flex items-center gap-1.5 py-1 transition-colors duration-200 cursor-pointer focus:outline-none ${
                    isCategoriesOpen
                      ? "text-[#C6F36A]"
                      : "hover:text-[#C6F36A]"
                  }`}
                  aria-expanded={isCategoriesOpen}
                >
                  <span>Categories</span>
                  <ChevronDownIcon
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isCategoriesOpen ? "rotate-180 text-[#C6F36A]" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isCategoriesOpen && (
                  <div
                    onMouseLeave={() => setIsCategoriesOpen(false)}
                    className="absolute top-full left-0 mt-2 w-64 rounded-2xl bg-[#22283A] border border-[#2E364F] p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#657189] border-b border-[#2E364F]/60">
                      Curated Collections
                    </div>
                    <div className="mt-1 space-y-0.5">
                      {SAMPLE_CATEGORIES.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/shop?category=${cat.slug}`}
                          onClick={() => setIsCategoriesOpen(false)}
                          className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-[#F4F3ED] hover:bg-[#10131F] hover:text-[#C6F36A] transition-all duration-150 group"
                        >
                          <span className="group-hover:translate-x-1 transition-transform duration-150 motion-reduce:transform-none">
                            {cat.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#10131F] text-[#9AA3B8] group-hover:text-[#C6F36A] font-mono">
                            {cat.count}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Deals */}
              <Link
                href="/#deals"
                className="relative flex items-center gap-1.5 py-1 transition-colors duration-200 hover:text-[#FF8066] group"
              >
                <span>Deals</span>
                <Badge
                  variant="coral"
                  size="sm"
                  className="px-1.5 py-0 text-[9px] font-bold"
                >
                  <SparklesIcon className="w-2.5 h-2.5 mr-0.5" />
                  HOT
                </Badge>
              </Link>

              {/* Admin Portal Link */}
              <Link
                href="/admin"
                className="relative flex items-center gap-1.5 py-1 text-[#9AA3B8] transition-colors duration-200 hover:text-[#C6F36A] group"
              >
                <span>Admin</span>
                <Badge
                  variant="lime"
                  size="sm"
                  className="px-1.5 py-0 text-[8px] font-bold tracking-wider"
                >
                  DASH
                </Badge>
              </Link>
            </nav>

            {/* 3. Search Bar (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#657189] pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, brands..."
                  className="w-full h-10 bg-[#171B2B] text-xs text-[#F4F3ED] placeholder-[#657189] rounded-xl pl-9 pr-8 border border-[#2E364F] focus:border-[#C6F36A] focus:ring-1 focus:ring-[#C6F36A] outline-none transition-all duration-200 hover:border-[#3E496A]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#657189] hover:text-[#F4F3ED]"
                  >
                    ×
                  </button>
                )}
              </form>
            </div>

            {/* 4. Action Area: Cart, Login/Register, Mobile Toggle */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Cart Icon with Live Badge */}
              <button
                type="button"
                onClick={() => dispatch(toggleCartDrawer())}
                aria-label={`Open shopping cart (${totalCartQuantity} items)`}
                className="group relative flex h-11 w-11 items-center justify-center rounded-xl bg-[#22283A] border border-[#2E364F] hover:border-[#C6F36A] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6F36A]"
              >
                <CartIcon className="w-5 h-5 text-[#F4F3ED] group-hover:text-[#C6F36A] transition-all duration-200 group-hover:scale-110 motion-reduce:transform-none" />

                {/* Animated Badge */}
                <span
                  className={`absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#C6F36A] px-1 text-[11px] font-black text-[#10131F] shadow-[0_0_10px_rgba(198,243,106,0.6)] transition-transform duration-200 ${
                    totalCartQuantity > 0 ? "scale-100" : "scale-90 opacity-80"
                  }`}
                >
                  {totalCartQuantity}
                </span>
              </button>

              {/* Desktop Auth Links */}
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-10 px-3.5 gap-1.5 hover:text-[#F4F3ED] hover:bg-[#22283A] transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-[#9AA3B8]" />
                    <span>Login</span>
                  </Button>
                </Link>

                <Link href="/register">
                  <Button
                    variant="lime"
                    size="sm"
                    className="text-xs h-10 px-4 font-bold shadow-[0_0_16px_rgba(198,243,106,0.3)] hover:shadow-[0_0_24px_rgba(198,243,106,0.5)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transform-none"
                  >
                    <span>Register</span>
                  </Button>
                </Link>
              </div>

              {/* Mobile Hamburger Menu Button */}
              <button
                type="button"
                onClick={() => dispatch(toggleMobileMenu())}
                aria-label="Toggle mobile menu"
                className="flex lg:hidden h-11 w-11 items-center justify-center rounded-xl bg-[#22283A] border border-[#2E364F] text-[#9AA3B8] hover:text-[#F4F3ED] hover:border-[#3E496A] transition-all duration-200 active:scale-95 cursor-pointer motion-reduce:transform-none"
              >
                <MenuIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Responsive Mobile Drawer */}
      <MobileMenu categories={SAMPLE_CATEGORIES} />
    </>
  );
};
