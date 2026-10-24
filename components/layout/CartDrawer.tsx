"use client";

import React, { useEffect, useCallback } from "react";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setCartDrawerOpen } from "@/store/slices/uiSlice";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "@/store/slices/cartSlice";
import {
  CloseIcon,
  CartIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  SparklesIcon,
  ArrowRightIcon,
} from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";

export const CartDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isCartDrawerOpen);
  const { items, totalQuantity, totalAmount } = useAppSelector(
    (state) => state.cart
  );

  const handleClose = useCallback(() => {
    dispatch(setCartDrawerOpen(false));
  }, [dispatch]);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  // Lock body scroll when cart drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Free shipping threshold
  const freeShippingThreshold = 5000;
  const progressPercent = Math.min(
    100,
    Math.round((totalAmount / freeShippingThreshold) * 100)
  );

  return (
    <div
      className={`fixed inset-0 z-50 transition-visibility duration-300 ${
        isOpen ? "pointer-events-auto visible" : "pointer-events-none invisible"
      }`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#10131F] border-l border-[#2E364F] shadow-2xl flex flex-col justify-between overflow-hidden transition-transform duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#2E364F] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#22283A] border border-[#2E364F]">
              <CartIcon className="w-5 h-5 text-[#C6F36A]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#F4F3ED]">Your Cart</h2>
              <p className="text-xs text-[#9AA3B8]">
                {totalQuantity} {totalQuantity === 1 ? "item" : "items"} selected
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            aria-label="Close cart"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#22283A] text-[#9AA3B8] hover:text-[#F4F3ED] border border-[#2E364F] hover:border-[#3E496A] transition-colors cursor-pointer"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="px-5 py-3 bg-[#171B2B] border-b border-[#2E364F]/50">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[#9AA3B8]">
              {totalAmount >= freeShippingThreshold ? (
                <span className="text-[#C6F36A] font-semibold flex items-center gap-1">
                  <SparklesIcon className="w-3.5 h-3.5" /> Free Express Shipping
                  Unlocked!
                </span>
              ) : (
                <span>
                  Add{" "}
                  <strong className="text-[#C6F36A]">
                    ৳{(freeShippingThreshold - totalAmount).toLocaleString()}
                  </strong>{" "}
                  more for Free Shipping
                </span>
              )}
            </span>
            <span className="text-[10px] text-[#657189] font-mono">
              {progressPercent}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-[#22283A] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#C6F36A] to-[#FF8066] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="h-16 w-16 rounded-2xl bg-[#22283A] border border-[#2E364F] flex items-center justify-center mb-4">
                <CartIcon className="w-8 h-8 text-[#657189]" />
              </div>
              <h3 className="text-base font-bold text-[#F4F3ED]">
                Your cart is empty
              </h3>
              <p className="text-xs text-[#9AA3B8] max-w-xs mt-1.5 mb-6">
                Discover limited drops, audio accessories, and exclusive cyber gear in our catalog.
              </p>
              <Link href="/#deals" onClick={handleClose}>
                <Button variant="lime" size="md" className="gap-2">
                  <span>Explore Trending Deals</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3 rounded-xl bg-[#22283A] border border-[#2E364F] items-center"
                >
                  <div className="h-14 w-14 rounded-lg bg-[#171B2B] border border-[#2E364F]/50 flex items-center justify-center shrink-0">
                    <CartIcon className="w-6 h-6 text-[#9AA3B8]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-[#F4F3ED] truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs font-mono text-[#C6F36A] mt-0.5">
                      ৳{item.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-[#2E364F] rounded-lg bg-[#10131F]">
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                id: item.id,
                                quantity: item.quantity - 1,
                              })
                            )
                          }
                          className="p-1 hover:text-[#C6F36A] text-[#9AA3B8]"
                          aria-label="Decrease quantity"
                        >
                          <MinusIcon className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono text-[#F4F3ED]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                id: item.id,
                                quantity: item.quantity + 1,
                              })
                            )
                          }
                          className="p-1 hover:text-[#C6F36A] text-[#9AA3B8]"
                          aria-label="Increase quantity"
                        >
                          <PlusIcon className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="text-[#657189] hover:text-[#FF8066] p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => dispatch(clearCart())}
                  className="text-xs text-[#657189] hover:text-[#FF8066] transition-colors"
                >
                  Clear All
                </button>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer with Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#2E364F] bg-[#171B2B]/40 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#9AA3B8]">
                <span>Subtotal</span>
                <span className="font-mono text-[#F4F3ED]">
                  ৳{totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[#9AA3B8]">
                <span>Shipping</span>
                <span className="font-mono text-[#C6F36A]">
                  {totalAmount >= freeShippingThreshold ? "FREE" : "৳120"}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#F4F3ED] pt-2 border-t border-[#2E364F]">
                <span>Total</span>
                <span className="font-mono text-[#C6F36A]">
                  ৳
                  {(
                    totalAmount +
                    (totalAmount >= freeShippingThreshold ? 0 : 120)
                  ).toLocaleString()}
                </span>
              </div>
            </div>

            <Link href="/#checkout" onClick={handleClose} className="block w-full">
              <Button
                variant="lime"
                size="lg"
                className="w-full gap-2 shadow-[0_0_20px_rgba(198,243,106,0.25)]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Button>
            </Link>

            <p className="text-[11px] text-center text-[#657189]">
              Encrypted 256-bit SSL Checkout • 7-Day Returns
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
