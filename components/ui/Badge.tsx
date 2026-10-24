import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "lime" | "coral" | "card" | "outline" | "subtle";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "lime",
  size = "md",
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center font-medium rounded-full uppercase tracking-wider transition-colors";

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  const variantStyles = {
    lime: "bg-[#C6F36A]/15 text-[#C6F36A] border border-[#C6F36A]/30 shadow-[0_0_12px_rgba(198,243,106,0.15)]",
    coral:
      "bg-[#FF8066]/15 text-[#FF8066] border border-[#FF8066]/30 shadow-[0_0_12px_rgba(255,128,102,0.15)]",
    card: "bg-[#22283A] text-[#F4F3ED] border border-[#2E364F]",
    outline: "bg-transparent text-[#9AA3B8] border border-[#2E364F]",
    subtle: "bg-[#171B2B] text-[#9AA3B8] border border-[#1C2233]",
  };

  return (
    <span
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
};
