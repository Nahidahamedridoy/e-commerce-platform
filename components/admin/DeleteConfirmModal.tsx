"use client";

import React from "react";
import { AlertCircleIcon, CloseIcon } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  itemName: string;
  itemType?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title,
  itemName,
  itemType = "product",
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-[#1A2030] border border-[#FF8066]/40 rounded-2xl shadow-2xl p-6 z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#FF8066]/15 border border-[#FF8066]/30 text-[#FF8066] shrink-0">
            <AlertCircleIcon className="w-6 h-6" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-[#F4F3ED]">{title}</h3>
            <p className="mt-1.5 text-xs text-[#9AA3B8] leading-relaxed">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-[#F4F3ED] break-words">
                &ldquo;{itemName}&rdquo;
              </span>
              ? This action will remove the {itemType} from the local active session.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-[#657189] hover:text-[#F4F3ED] p-1 rounded"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#2E364F]">
          <Button type="button" variant="card" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="coral"
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Delete {itemType}
          </Button>
        </div>
      </div>
    </div>
  );
};
