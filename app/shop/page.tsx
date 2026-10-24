import { Metadata } from "next";
import { Suspense } from "react";
import { ProductCatalog } from "@/components/catalog";

export const metadata: Metadata = {
  title: "Shop All Products | Amar Dokan",
  description:
    "Explore our complete curated catalog of high-performance acoustics, techwear, home living, and premium lifestyle upgrades.",
};

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#10131F] flex items-center justify-center text-[#9AA3B8]">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#C6F36A] animate-pulse" />
            <span className="text-sm font-mono">Loading Amar Dokan Catalog...</span>
          </div>
        </div>
      }
    >
      <ProductCatalog />
    </Suspense>
  );
}
