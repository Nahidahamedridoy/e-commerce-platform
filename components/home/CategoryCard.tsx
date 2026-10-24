import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/Icons";

export interface CategoryCardProps {
  id: string;
  name: string;
  subtitle: string;
  itemCount: string;
  image: string;
  href: string;
  accent?: "lime" | "coral";
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  subtitle,
  itemCount,
  image,
  href,
  accent = "lime",
}) => {
  const isCoral = accent === "coral";

  return (
    <Link
      href={href}
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-[#22283A] border border-[#2E364F] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] motion-reduce:transform-none motion-reduce:transition-none focus:outline-none focus-visible:ring-2 ${
        isCoral
          ? "hover:border-[#FF8066]/70 focus-visible:ring-[#FF8066]"
          : "hover:border-[#C6F36A]/70 focus-visible:ring-[#C6F36A]"
      }`}
    >
      {/* Visual Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#171B2B]">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-108 motion-reduce:transform-none"
        />

        {/* Gradient Overlay for Text Readability & Mood */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#22283A] via-[#22283A]/30 to-transparent opacity-85 group-hover:opacity-75 transition-opacity duration-300" />

        {/* Accent Top Badge */}
        <div className="absolute top-3.5 right-3.5">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold backdrop-blur-md border ${
              isCoral
                ? "bg-[#FF8066]/15 text-[#FF8066] border-[#FF8066]/30 shadow-[0_0_10px_rgba(255,128,102,0.2)]"
                : "bg-[#C6F36A]/15 text-[#C6F36A] border-[#C6F36A]/30 shadow-[0_0_10px_rgba(198,243,106,0.2)]"
            }`}
          >
            {itemCount}
          </span>
        </div>
      </div>

      {/* Card Content Footer */}
      <div className="p-5 flex items-center justify-between gap-3 border-t border-[#2E364F]/50 bg-[#22283A]">
        <div>
          <h3
            className={`text-lg font-bold text-[#F4F3ED] transition-colors duration-200 ${
              isCoral ? "group-hover:text-[#FF8066]" : "group-hover:text-[#C6F36A]"
            }`}
          >
            {name}
          </h3>
          <p className="text-xs text-[#9AA3B8] mt-0.5 line-clamp-1">
            {subtitle}
          </p>
        </div>

        {/* Interactive Action Icon Circle */}
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#171B2B] border border-[#2E364F] transition-all duration-200 ${
            isCoral
              ? "group-hover:bg-[#FF8066] group-hover:border-[#FF8066] group-hover:text-[#10131F]"
              : "group-hover:bg-[#C6F36A] group-hover:border-[#C6F36A] group-hover:text-[#10131F]"
          } text-[#9AA3B8]`}
        >
          <ArrowRightIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none" />
        </div>
      </div>
    </Link>
  );
};
