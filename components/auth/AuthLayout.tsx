"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheckIcon } from "@/components/ui/Icons";

interface AuthLayoutProps {
  badgeText: string;
  badgeVariant?: "lime" | "coral";
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  badgeText,
  badgeVariant = "lime",
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
}) => {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#10131F] overflow-hidden">
      {/* Decorative Ambient Radial Glows */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 -left-32 w-96 h-96 bg-[#C6F36A]/10 rounded-full blur-3xl pointer-events-none transform -translate-y-1/2"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#FF8066]/10 rounded-full blur-3xl pointer-events-none transform translate-y-1/2"
      />

      {/* Decorative Subtle Grid Pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#F4F3ED_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"
      />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 group mb-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C6F36A] rounded-xl px-2 py-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C6F36A] to-[#FF8066] p-0.5 shadow-[0_0_20px_rgba(198,243,106,0.3)] transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-[#10131F] rounded-[10px] flex items-center justify-center">
                <span className="font-mono font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-[#C6F36A] to-[#FF8066]">
                  আ
                </span>
              </div>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-xl tracking-tight text-[#F4F3ED] font-mono leading-none">
                AMAR DOKAN
              </span>
              <span className="text-[10px] text-[#9AA3B8] font-mono tracking-widest uppercase">
                Premium Store
              </span>
            </div>
          </Link>

          <div>
            <Badge variant={badgeVariant} size="sm" className="mb-2">
              {badgeText}
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F4F3ED]">
              {title}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#9AA3B8] leading-relaxed max-w-sm mx-auto">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-[#22283A] border border-[#2E364F] rounded-3xl p-6 sm:p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] backdrop-blur-md transition-all duration-300">
          {children}

          {/* Card Footer Switch Link */}
          <div className="mt-6 pt-6 border-t border-[#2E364F] text-center text-xs sm:text-sm text-[#9AA3B8]">
            <span>{footerText} </span>
            <Link
              href={footerLinkHref}
              className="font-bold text-[#C6F36A] hover:underline transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C6F36A] rounded"
            >
              {footerLinkText}
            </Link>
          </div>
        </div>

        {/* Security / Trust Assurance Footer */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-[#657189] text-center">
          <ShieldCheckIcon className="w-4 h-4 text-[#C6F36A] shrink-0" />
          <span>256-Bit SSL Encrypted • 100% Secure Dokan Guarantee</span>
        </div>
      </div>
    </div>
  );
};
