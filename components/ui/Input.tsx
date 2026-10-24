import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", icon, rightElement, error, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-3.5 text-[#657189] pointer-events-none flex items-center">
            {icon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            "w-full h-11 bg-[#10131F] text-[#F4F3ED] placeholder-[#657189] text-sm rounded-xl border border-[#2E364F] px-4 transition-all duration-200 outline-none",
            error
              ? "border-[#FF8066] focus:border-[#FF8066] focus:ring-1 focus:ring-[#FF8066]"
              : "focus:border-[#C6F36A] focus:ring-1 focus:ring-[#C6F36A] hover:border-[#3E496A]",
            icon ? "pl-11" : "",
            rightElement ? "pr-11" : "",
            className
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3.5 flex items-center text-[#657189]">
            {rightElement}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
