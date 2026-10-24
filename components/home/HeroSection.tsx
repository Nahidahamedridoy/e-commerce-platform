
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon, SparklesIcon, ShieldCheckIcon, TruckIcon } from "@/components/ui/Icons";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-[#10131F] text-[#F4F3ED] pt-12 pb-20 lg:pt-20 lg:pb-32">
      {/* Ambient Gradient Glows in Background */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#C6F36A]/8 rounded-full blur-[140px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/3 right-10 w-[450px] h-[350px] bg-[#FF8066]/8 rounded-full blur-[130px] pointer-events-none"
      />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Typography & CTAs (7 Cols on LG) */}
          <div className="lg:col-span-7 flex flex-col items-start z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 motion-reduce:animate-none">
            {/* Small Label */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#22283A] border border-[#2E364F] text-xs font-bold tracking-widest text-[#C6F36A] uppercase mb-6 shadow-[0_0_15px_rgba(198,243,106,0.15)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C6F36A] opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C6F36A]" />
              </span>
              <span>YOUR EVERYDAY, UPGRADED</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#F4F3ED] leading-[1.08]">
              Good Finds. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C6F36A] via-[#E2FF9E] to-[#C6F36A]">
                Better Living.
              </span>
            </h1>

            {/* Short Supporting Text */}
            <p className="mt-6 text-base sm:text-lg text-[#9AA3B8] leading-relaxed max-w-xl">
              Discover thoughtfully curated everyday essentials, high-performance
              electronics, and modern lifestyle upgrades crafted for durability,
              superior aesthetics, and effortless living.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto">
              {/* Primary Lime Button */}
              <Link href="/shop" className="w-full sm:w-auto">
                <Button
                  variant="lime"
                  size="lg"
                  className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold gap-2.5 shadow-[0_0_25px_rgba(198,243,106,0.3)] hover:shadow-[0_0_35px_rgba(198,243,106,0.5)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transform-none"
                >
                  <span>Explore Collection</span>
                  <ArrowRightIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none" />
                </Button>
              </Link>

              {/* Secondary Coral Button */}
              <Link href="/#deals" className="w-full sm:w-auto">
                <Button
                  variant="coral"
                  size="lg"
                  className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold gap-2.5 shadow-[0_0_25px_rgba(255,128,102,0.25)] hover:shadow-[0_0_35px_rgba(255,128,102,0.45)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transform-none"
                >
                  <SparklesIcon className="w-4 h-4" />
                  <span>Discover Deals</span>
                </Button>
              </Link>
            </div>

            {/* Trust Micro-Metrics */}
            <div className="mt-12 pt-8 border-t border-[#2E364F]/70 grid grid-cols-3 gap-4 sm:gap-8 w-full max-w-lg">
              <div>
                <div className="text-xl sm:text-2xl font-black font-mono text-[#F4F3ED]">
                  25K+
                </div>
                <div className="text-xs text-[#9AA3B8] mt-0.5">
                  Curated Finds
                </div>
              </div>
              <div className="border-l border-[#2E364F]/70 pl-4 sm:pl-8">
                <div className="text-xl sm:text-2xl font-black font-mono text-[#C6F36A] flex items-center gap-1">
                  <span>100%</span>
                  <ShieldCheckIcon className="w-4 h-4 inline" />
                </div>
                <div className="text-xs text-[#9AA3B8] mt-0.5">
                  Genuine Gear
                </div>
              </div>
              <div className="border-l border-[#2E364F]/70 pl-4 sm:pl-8">
                <div className="text-xl sm:text-2xl font-black font-mono text-[#FF8066] flex items-center gap-1">
                  <span>24h</span>
                  <TruckIcon className="w-4 h-4 inline" />
                </div>
                <div className="text-xs text-[#9AA3B8] mt-0.5">
                  Express Dispatch
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Product Showcase (5 Cols on LG) */}
          <div className="lg:col-span-5 relative animate-in fade-in slide-in-from-bottom-8 duration-1000 motion-reduce:animate-none">
            {/* Visual Frame Container */}
            <div className="group relative rounded-3xl overflow-hidden bg-[#22283A] border border-[#2E364F] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] transition-all duration-300 hover:border-[#3E496A]">
              {/* Image Aspect Box */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#171B2B]">
                <Image
                  src="/images/hero-showcase.jpg"
                  alt="Amar Dokan Hero Product Showcase - Premium Audio and Smart Gear"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transform-none"
                />

                {/* Subtle Ambient Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#22283A] via-transparent to-transparent opacity-60" />
              </div>

              {/* Floating Badge (Top Left) */}
              <div className="absolute top-4 left-4 z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10131F]/90 backdrop-blur-md border border-[#2E364F] text-xs font-semibold text-[#F4F3ED] shadow-lg">
                  <span className="h-2 w-2 rounded-full bg-[#C6F36A] shadow-[0_0_8px_#C6F36A]" />
                  <span>Curated Drop • Studio ANC</span>
                </div>
              </div>

              {/* Floating Card (Bottom Right) */}
              <div className="absolute bottom-4 right-4 left-4 sm:left-auto z-10">
                <div className="p-3.5 rounded-2xl bg-[#22283A]/95 backdrop-blur-md border border-[#2E364F] shadow-xl flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-[#F4F3ED]">
                      Obsidian Acoustics & Smart EDC
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-[#C6F36A]">
                      <span>★ 4.9 Rating</span>
                      <span className="text-[#657189]">•</span>
                      <span className="text-[#9AA3B8]">In Stock & Verified</span>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs font-mono font-bold px-2 py-1 rounded bg-[#10131F] text-[#FF8066] border border-[#FF8066]/30">
                    NEW
                  </span>
                </div>
              </div>
            </div>

            {/* Decorative Corner Glow */}
            <div className="absolute -bottom-4 -left-4 w-28 h-28 bg-[#C6F36A]/10 rounded-full blur-2xl pointer-events-none -z-10" />
            <div className="absolute -top-4 -right-4 w-28 h-28 bg-[#FF8066]/10 rounded-full blur-2xl pointer-events-none -z-10" />
          </div>
        </div>
      </Container>
    </section>
  );
};
