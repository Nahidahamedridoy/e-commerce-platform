"use client";

import React, { useState } from "react";
import { SparklesIcon, CloseIcon } from "@/components/ui/Icons";
import { Badge } from "@/components/ui/Badge";

export const AdminDemoBanner: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-[#181E2E] border-b border-[#2E364F] text-xs">
      <div className="flex items-center gap-2.5">
        <Badge variant="lime" size="sm" className="font-mono text-[9px] px-2">
          LOCAL DEMO
        </Badge>
        <p className="text-[#9AA3B8] text-xs">
          <strong className="text-[#F4F3ED] font-semibold">
            Interactive Admin UI Mode:
          </strong>{" "}
          Using local sample records. Add, Edit, Delete, and Status updates simulate in-session UI state without persistent backend storage.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setIsDismissed(true)}
        className="self-end sm:self-auto text-[#657189] hover:text-[#F4F3ED] p-1 rounded transition-colors"
        aria-label="Dismiss banner"
      >
        <CloseIcon className="w-4 h-4" />
      </button>
    </div>
  );
};
