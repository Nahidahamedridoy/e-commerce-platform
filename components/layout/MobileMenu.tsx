"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setMobileMenuOpen } from "@/store/slices/uiSlice";
import {
  CloseIcon,
  SearchIcon,
  ChevronDownIcon,
  UserIcon,
  SparklesIcon,
  PhoneIcon,
  MailIcon,
  ClockIcon,
} from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface MobileMenuProps {
  categories: { name: string; slug: string; count: number }[];
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ categories }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isMobileMenuOpen);
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleClose = useCallback(() => {
    dispatch(setMobileMenuOpen(false));
  }, [dispatch]);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      handleClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-visibility duration-300 ${
        isOpen ? "pointer-events-auto visible" : "pointer-events-none invisible"
      }`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed right-0 top-0 bottom-0 w-full max-w-sm bg-[#10131F] border-l border-[#2E364F] shadow-2xl flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between p-5 border-b border-[#2E364F]">
            <Link
              href="/"
              onClick={handleClose}
              className="flex items-center gap-2.5 group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#22283A] border border-[#2E364F]">
                <div className="h-2.5 w-2.5 rounded-full bg-[#C6F36A] shadow-[0_0_8px_#C6F36A]" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-[#F4F3ED]">
                  AMAR DOKAN
                </span>
                <span className="text-[9px] tracking-widest text-[#9AA3B8] uppercase">
                  Premium Store
                </span>
              </div>
            </Link>

            <button
              onClick={handleClose}
              aria-label="Close mobile menu"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#22283A] text-[#9AA3B8] hover:text-[#F4F3ED] border border-[#2E364F] hover:border-[#3E496A] transition-colors cursor-pointer"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Search Box */}
          <div className="p-5 border-b border-[#2E364F]/50">
            <form onSubmit={handleSearchSubmit} className="relative">
              <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#657189]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands..."
                className="w-full h-11 bg-[#171B2B] text-sm text-[#F4F3ED] placeholder-[#657189] rounded-xl pl-10 pr-4 border border-[#2E364F] focus:border-[#C6F36A] focus:outline-none transition-colors"
              />
            </form>
          </div>

          {/* Nav Links */}
          <nav className="p-5 space-y-1">
            <Link
              href="/"
              onClick={handleClose}
              className="flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium text-[#F4F3ED] hover:bg-[#22283A] hover:text-[#C6F36A] transition-colors"
            >
              <span>Home</span>
              <span className="text-xs text-[#657189]">01</span>
            </Link>

            <Link
              href="/shop"
              onClick={handleClose}
              className="flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium text-[#9AA3B8] hover:bg-[#22283A] hover:text-[#C6F36A] transition-colors"
            >
              <span>Shop All Products</span>
              <span className="text-xs text-[#657189]">02</span>
            </Link>

            {/* Categories Accordion */}
            <div>
              <button
                type="button"
                onClick={() => setCategoriesExpanded(!categoriesExpanded)}
                className="flex items-center justify-between w-full px-3.5 py-3 rounded-xl text-sm font-medium text-[#9AA3B8] hover:bg-[#22283A] hover:text-[#C6F36A] transition-colors cursor-pointer"
              >
                <span>Categories</span>
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform duration-200 ${
                    categoriesExpanded ? "rotate-180 text-[#C6F36A]" : ""
                  }`}
                />
              </button>

              {categoriesExpanded && (
                <div className="pl-4 pr-1 py-1 space-y-1 bg-[#171B2B]/60 rounded-xl mt-1 border border-[#2E364F]/50">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/shop?category=${cat.slug}`}
                      onClick={handleClose}
                      className="flex items-center justify-between px-3 py-2 text-xs text-[#9AA3B8] hover:text-[#C6F36A] rounded-lg transition-colors"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-[#657189] px-1.5 py-0.5 rounded bg-[#22283A]">
                        {cat.count}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/#deals"
              onClick={handleClose}
              className="flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium text-[#9AA3B8] hover:bg-[#22283A] hover:text-[#FF8066] transition-colors"
            >
              <div className="flex items-center gap-2">
                <span>Deals & Offers</span>
                <SparklesIcon className="w-3.5 h-3.5 text-[#FF8066]" />
              </div>
              <Badge variant="coral" size="sm">
                HOT
              </Badge>
            </Link>
          </nav>
        </div>

        {/* Bottom Actions & Support */}
        <div className="p-5 border-t border-[#2E364F] space-y-4 bg-[#171B2B]/30">
          {/* Auth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Link href="/login" onClick={handleClose} className="w-full">
              <Button
                variant="card"
                size="md"
                className="w-full flex items-center justify-center gap-1.5"
              >
                <UserIcon className="w-4 h-4 text-[#9AA3B8]" />
                <span>Login</span>
              </Button>
            </Link>
            <Link href="/register" onClick={handleClose} className="w-full">
              <Button
                variant="lime"
                size="md"
                className="w-full flex items-center justify-center shadow-[0_0_15px_rgba(198,243,106,0.25)]"
              >
                <span>Register</span>
              </Button>
            </Link>
          </div>

          {/* Quick Support Info */}
          <div className="pt-3 border-t border-[#2E364F]/50 text-xs text-[#657189] space-y-2">
            <div className="flex items-center gap-2 text-[#9AA3B8]">
              <PhoneIcon className="w-3.5 h-3.5 text-[#C6F36A]" />
              <span>+880 (1700) 000-000</span>
            </div>
            <div className="flex items-center gap-2 text-[#9AA3B8]">
              <MailIcon className="w-3.5 h-3.5 text-[#FF8066]" />
              <span>support@amardokan.com</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <ClockIcon className="w-3 h-3 text-[#657189]" />
              <span>24/7 Dedicated Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
