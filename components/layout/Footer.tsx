"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  ClockIcon,
  ShieldCheckIcon,
  TruckIcon,
  RotateCcwIcon,
  ArrowUpIcon,
} from "@/components/ui/Icons";

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const usefulLinks = [
    {
      title: "Shop & Collections",
      links: [
        { label: "Electronics", href: "/shop?category=electronics" },
        { label: "Fashion", href: "/shop?category=fashion" },
        { label: "Home & Living", href: "/shop?category=home-living" },
        { label: "Beauty & Care", href: "/shop?category=beauty-care" },
        { label: "Accessories & Lifestyle", href: "/shop?category=accessories" },
        { label: "Limited Flash Deals", href: "/#deals", isDeal: true },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Amar Dokan", href: "/#about" },
        { label: "Authentic Guarantee", href: "/#authenticity" },
        { label: "Careers", href: "/#careers" },
        { label: "Sustainability", href: "/#sustainability" },
        { label: "News & Releases", href: "/#news" },
      ],
    },
    {
      title: "Help & Policies",
      links: [
        { label: "Order Tracking", href: "/#order-tracking" },
        { label: "Shipping Information", href: "/#shipping" },
        { label: "7-Day Easy Returns", href: "/#returns" },
        { label: "Privacy Policy", href: "/#privacy" },
        { label: "Terms of Service", href: "/#terms" },
      ],
    },
  ];

  const trustHighlights = [
    {
      icon: <TruckIcon className="w-5 h-5 text-[#C6F36A]" />,
      title: "Nationwide Express",
      desc: "Dispatched within 24 hours across Bangladesh",
    },
    {
      icon: <ShieldCheckIcon className="w-5 h-5 text-[#C6F36A]" />,
      title: "100% Authentic Gear",
      desc: "Direct verified distributor sourcing",
    },
    {
      icon: <RotateCcwIcon className="w-5 h-5 text-[#FF8066]" />,
      title: "7-Day Hassle-Free Return",
      desc: "Instant replacement or full refund",
    },
    {
      icon: <ClockIcon className="w-5 h-5 text-[#C6F36A]" />,
      title: "24/7 Dedicated Support",
      desc: "Always ready via phone, email & chat",
    },
  ];

  const paymentMethods = [
    "bKash",
    "Nagad",
    "Rocket",
    "Visa",
    "Mastercard",
    "Amex",
  ];

  return (
    <footer className="w-full bg-[#10131F] text-[#F4F3ED] border-t border-[#2E364F] pt-16 pb-12 mt-auto">
      <Container>
        {/* Trust Guarantees Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-14 border-b border-[#2E364F]/60">
          {trustHighlights.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3.5 p-4 rounded-xl bg-[#22283A] border border-[#2E364F] transition-all duration-200 hover:border-[#3E496A] hover:-translate-y-0.5 motion-reduce:transform-none"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#171B2B] border border-[#2E364F]/60">
                {item.icon}
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#F4F3ED]">{item.title}</h4>
                <p className="text-xs text-[#9AA3B8] mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 py-14 border-b border-[#2E364F]/60">
          {/* Brand Info & Mission (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#22283A] border border-[#2E364F] group-hover:border-[#C6F36A] transition-colors">
                <div className="h-3.5 w-3.5 rounded-full bg-[#C6F36A] shadow-[0_0_12px_#C6F36A]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-[#F4F3ED] group-hover:text-[#C6F36A] transition-colors">
                  AMAR DOKAN
                </span>
                <span className="text-[10px] font-semibold tracking-widest text-[#9AA3B8] uppercase">
                  Premium Store
                </span>
              </div>
            </Link>

            <p className="text-sm text-[#9AA3B8] leading-relaxed max-w-sm">
              Amar Dokan is Bangladesh&apos;s premier destination for curated cyber
              electronics, high-fidelity acoustics, bespoke mechanical keyboards,
              and premium lifestyle technology.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22283A] border border-[#2E364F] text-xs text-[#9AA3B8]">
                <span className="h-2 w-2 rounded-full bg-[#C6F36A]" />
                Official Store
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22283A] border border-[#2E364F] text-xs text-[#9AA3B8]">
                <span className="h-2 w-2 rounded-full bg-[#FF8066]" />
                Verified Merchant
              </span>
            </div>
          </div>

          {/* Useful Links Columns (5 Cols) */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {usefulLinks.map((col, idx) => (
              <div key={idx} className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#F4F3ED] border-b border-[#2E364F]/50 pb-2">
                  {col.title}
                </h4>
                <ul className="space-y-2.5 text-xs text-[#9AA3B8]">
                  {col.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <Link
                        href={link.href}
                        className="inline-flex items-center gap-1.5 transition-colors duration-150 hover:text-[#C6F36A] group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-150 motion-reduce:transform-none">
                          {link.label}
                        </span>
                        {link.isDeal && (
                          <Badge
                            variant="coral"
                            size="sm"
                            className="text-[9px] px-1 py-0"
                          >
                            SALE
                          </Badge>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Customer Support Card Section (3 Cols) */}
          <div className="lg:col-span-3">
            <Card className="p-5 border-[#2E364F] bg-[#22283A] shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-[#2E364F]/70">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#F4F3ED]">
                  Customer Support
                </h4>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C6F36A] opacity-75 motion-reduce:animate-none" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C6F36A]" />
                  </span>
                  <span className="text-[10px] font-semibold text-[#C6F36A]">
                    Agents Live
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-3 text-xs text-[#9AA3B8]">
                {/* Phone */}
                <a
                  href="tel:+8801700000000"
                  className="flex items-center gap-2.5 p-2 rounded-lg bg-[#171B2B] hover:bg-[#10131F] hover:text-[#C6F36A] transition-colors border border-[#2E364F]/40"
                >
                  <PhoneIcon className="w-4 h-4 text-[#C6F36A] shrink-0" />
                  <div className="truncate">
                    <div className="text-[10px] text-[#657189] uppercase">
                      Hotline
                    </div>
                    <div className="font-mono text-[#F4F3ED] font-semibold">
                      +880 (1700) 000-000
                    </div>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:support@amardokan.com"
                  className="flex items-center gap-2.5 p-2 rounded-lg bg-[#171B2B] hover:bg-[#10131F] hover:text-[#FF8066] transition-colors border border-[#2E364F]/40"
                >
                  <MailIcon className="w-4 h-4 text-[#FF8066] shrink-0" />
                  <div className="truncate">
                    <div className="text-[10px] text-[#657189] uppercase">
                      Email Inquiries
                    </div>
                    <div className="text-[#F4F3ED] font-medium truncate">
                      [xyz@gmail.com]
                    </div>
                  </div>
                </a>

                {/* Address */}
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-[#171B2B] border border-[#2E364F]/40">
                  <MapPinIcon className="w-4 h-4 text-[#9AA3B8] shrink-0 mt-0.5" />
                  <div className="text-[11px] text-[#9AA3B8] leading-tight">
                    <div className="text-[10px] text-[#657189] uppercase">
                      Flagship Hub
                    </div>
                    <span>Gulshan-2, Dhaka 1212, Bangladesh</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#2E364F]/60 flex items-center justify-between text-[11px] text-[#657189]">
                <span className="flex items-center gap-1.5">
                  <ClockIcon className="w-3.5 h-3.5" />
                  <span>24/7 Dedicated Support</span>
                </span>
                <span className="text-[#C6F36A] font-semibold">365 Days</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Payment Badges & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <div className="text-xs text-[#9AA3B8] flex items-center gap-2">
            <span>© {new Date().getFullYear()} Amar Dokan. All rights reserved.</span>
            <span className="text-[#657189]">•</span>
            <span className="text-[#657189]">Designed for High Performance</span>
          </div>

          {/* Payment Badges */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#657189] mr-1">
              Accepted Payments:
            </span>
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="px-2 py-1 rounded-md bg-[#22283A] border border-[#2E364F] text-[10px] font-mono text-[#F4F3ED] font-semibold hover:border-[#C6F36A] transition-colors"
              >
                {method}
              </span>
            ))}
          </div>

          {/* Back to top button */}
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#22283A] text-xs font-medium text-[#9AA3B8] hover:text-[#C6F36A] border border-[#2E364F] hover:border-[#C6F36A] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer motion-reduce:transform-none"
          >
            <span>Top</span>
            <ArrowUpIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </Container>
    </footer>
  );
};
