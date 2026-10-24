import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "lime" | "coral" | "card" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "lime", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#10131F]";

    const sizeStyles = {
      sm: "h-9 px-3.5 text-xs rounded-lg gap-1.5",
      md: "h-11 px-5 text-sm rounded-xl gap-2",
      lg: "h-13 px-7 text-base rounded-xl gap-2.5",
      icon: "h-10 w-10 p-0 rounded-xl",
    };

    const variantStyles = {
      lime: "bg-[#C6F36A] text-[#10131F] font-semibold hover:bg-[#D5F788] hover:shadow-[0_0_20px_-3px_rgba(198,243,106,0.4)] active:scale-[0.98] focus-visible:ring-[#C6F36A]",
      coral:
        "bg-[#FF8066] text-[#10131F] font-semibold hover:bg-[#FF9580] hover:shadow-[0_0_20px_-3px_rgba(255,128,102,0.4)] active:scale-[0.98] focus-visible:ring-[#FF8066]",
      card: "bg-[#22283A] text-[#F4F3ED] border border-[#2E364F] hover:bg-[#2B334B] hover:border-[#3E496A] active:scale-[0.98] focus-visible:ring-[#C6F36A]",
      outline:
        "bg-transparent text-[#F4F3ED] border border-[#2E364F] hover:border-[#C6F36A] hover:text-[#C6F36A] active:scale-[0.98] focus-visible:ring-[#C6F36A]",
      ghost:
        "bg-transparent text-[#9AA3B8] hover:text-[#F4F3ED] hover:bg-[#22283A] active:scale-[0.98] focus-visible:ring-[#C6F36A]",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
