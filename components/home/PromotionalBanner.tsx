import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SparklesIcon, ArrowRightIcon, ShieldCheckIcon } from "@/components/ui/Icons";

export const PromotionalBanner: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#10131F] text-[#F4F3ED] relative overflow-hidden">
      <Container>
        {/* Banner Card Container with Striking Dual Coral & Lime Contrast */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#22283A] via-[#1A1F30] to-[#131726] border border-[#2E364F] p-8 sm:p-12 lg:p-16 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] animate-in fade-in slide-in-from-bottom-4 duration-700 motion-reduce:animate-none">
          {/* Striking Neon Ambience Glows */}
          <div
            aria-hidden="true"
            className="absolute -top-24 -right-24 w-96 h-96 bg-[#FF8066]/20 rounded-full blur-[120px] pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#C6F36A]/15 rounded-full blur-[120px] pointer-events-none"
          />

          {/* Decorative Corner Watermark */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 right-12 -translate-y-1/2 text-[140px] font-black text-white/[0.02] select-none pointer-events-none hidden xl:block font-mono tracking-tighter"
          >
            UPGRADE
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content Area (8 Cols) */}
            <div className="lg:col-span-8 flex flex-col items-start">
              {/* Promotional Label Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10131F]/90 backdrop-blur-md border border-[#FF8066]/40 text-xs font-bold tracking-widest text-[#FF8066] uppercase mb-6 shadow-[0_0_15px_rgba(255,128,102,0.2)]">
                <SparklesIcon className="w-3.5 h-3.5 text-[#FF8066]" />
                <span>LIMITED TIME CURATED PROMOTION</span>
              </div>

              {/* Exact Requested Heading */}
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#F4F3ED] leading-[1.1]">
                A Little Upgrade <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8066] via-[#FFD085] to-[#C6F36A]">
                  Goes a Long Way.
                </span>
              </h2>

              {/* Short Promotional Text */}
              <p className="mt-5 text-sm sm:text-base lg:text-lg text-[#9AA3B8] leading-relaxed max-w-2xl">
                Elevate your workstation, daily carry, and personal rituals with
                up to 40% off hand-selected cyber electronics, acoustic monitors,
                and lifestyle essentials. Engineered for longevity and everyday luxury.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <Link href="/#deals" className="w-full sm:w-auto">
                  <Button
                    variant="coral"
                    size="lg"
                    className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold gap-2 shadow-[0_0_25px_rgba(255,128,102,0.35)] hover:shadow-[0_0_35px_rgba(255,128,102,0.55)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transform-none"
                  >
                    <span>Shop the Deals</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </Button>
                </Link>

                <Link href="/shop" className="w-full sm:w-auto">
                  <Button
                    variant="card"
                    size="lg"
                    className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold border-[#2E364F] hover:border-[#C6F36A] hover:text-[#C6F36A] transition-all duration-200"
                  >
                    <span>Browse All Categories</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Card: Deal Highlight & Countdown (4 Cols) */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="w-full max-w-sm rounded-2xl bg-[#171B2B]/90 backdrop-blur-md border border-[#2E364F] p-6 shadow-2xl relative">
                {/* Neon Accent Corner Strip */}
                <div className="absolute top-0 right-8 w-16 h-1 bg-gradient-to-r from-[#FF8066] to-[#C6F36A] rounded-b-full shadow-[0_0_10px_rgba(255,128,102,0.5)]" />

                <div className="flex items-center justify-between border-b border-[#2E364F]/70 pb-3">
                  <span className="text-xs font-mono font-bold tracking-wider text-[#9AA3B8] uppercase">
                    PROMO CODE
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#FF8066]/20 border border-[#FF8066]/40 text-[#FF8066] text-[10px] font-mono font-bold">
                    UPGRADE26
                  </span>
                </div>

                <div className="my-5 text-center">
                  <div className="text-4xl sm:text-5xl font-black font-mono text-[#C6F36A] tracking-tight">
                    40% OFF
                  </div>
                  <div className="text-xs text-[#9AA3B8] mt-1">
                    On All Curated Seasonal Bundles
                  </div>
                </div>

                {/* Micro Guarantee Note */}
                <div className="pt-3 border-t border-[#2E364F]/70 flex items-center justify-between text-[11px] text-[#657189]">
                  <span className="flex items-center gap-1.5 text-[#9AA3B8]">
                    <ShieldCheckIcon className="w-3.5 h-3.5 text-[#C6F36A]" />
                    <span>Free Nationwide Express</span>
                  </span>
                  <span className="font-mono text-[#C6F36A]">৳0 Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
