"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { clearCart } from "@/store/slices/cartSlice";
import { ordersApi, ApiError, ApiOrder } from "@/lib/api";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  CartIcon,
  CheckIcon,
  AlertCircleIcon,
  SpinnerIcon,
  TruckIcon,
  LockIcon,
  UserIcon,
  ArrowRightIcon,
  SparklesIcon,
} from "@/components/ui/Icons";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, totalQuantity, totalAmount } = useAppSelector((state) => state.cart);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [shippingAddress, setShippingAddress] = useState(user?.address || "");
  const [city, setCity] = useState("Dhaka");
  const [contactPhone, setContactPhone] = useState(user?.phone || "");
  const [paymentMethod, setPaymentMethod] = useState("CASH_ON_DELIVERY");
  const [notes, setNotes] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<ApiOrder | null>(null);
  const [formErrors, setFormErrors] = useState<{
    shippingAddress?: string;
    contactPhone?: string;
  }>({});

  const shippingFee = totalAmount >= 5000 || totalAmount === 0 ? 0 : 120;
  const grandTotal = totalAmount + shippingFee;

  const validate = (): boolean => {
    const errors: { shippingAddress?: string; contactPhone?: string } = {};

    if (!shippingAddress.trim() || shippingAddress.trim().length < 5) {
      errors.shippingAddress = "Full street & house address is required (min 5 chars)";
    }

    if (!contactPhone.trim() || contactPhone.trim().length < 6) {
      errors.contactPhone = "Valid contact phone number is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout");
      return;
    }

    if (!validate()) {
      return;
    }

    if (items.length === 0) {
      setApiError("Your cart is empty. Please add items before placing an order.");
      return;
    }

    setIsLoading(true);

    try {
      const orderPayload = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress: `${shippingAddress.trim()}, ${city.trim()}`,
        contactPhone: contactPhone.trim(),
        paymentMethod,
      };

      const order = await ordersApi.create(orderPayload);
      setConfirmedOrder(order);
      dispatch(clearCart());
    } catch (err: any) {
      if (err instanceof ApiError) {
        setApiError(
          err.message ||
            "Order creation failed. If this is a local setup, ensure PostgreSQL is provisioned."
        );
      } else {
        setApiError(
          "Network error connecting to backend API at http://localhost:5000/api."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Order Confirmed Screen
  if (confirmedOrder) {
    return (
      <div className="bg-[#10131F] text-[#F4F3ED] min-h-screen py-16 sm:py-24">
        <Container>
          <div className="max-w-2xl mx-auto p-8 sm:p-12 rounded-3xl bg-[#22283A] border border-[#C6F36A]/40 shadow-[0_0_50px_rgba(198,243,106,0.15)] text-center animate-fade-in">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-[#C6F36A]/20 text-[#C6F36A] flex items-center justify-center mb-6">
              <CheckIcon className="w-8 h-8" />
            </div>

            <Badge variant="lime" size="sm" className="mb-3 px-3 py-1">
              ORDER CONFIRMED
            </Badge>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4F3ED]">
              Thank You for Your Order!
            </h1>

            <p className="mt-2 text-sm text-[#9AA3B8]">
              Your order has been recorded in the database. A confirmation has been sent to your email.
            </p>

            <div className="mt-6 p-4 rounded-2xl bg-[#171B2B] border border-[#2E364F] text-left space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[#9AA3B8]">Order ID:</span>
                <span className="text-[#C6F36A] font-bold">{confirmedOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9AA3B8]">Status:</span>
                <span className="text-[#F4F3ED] uppercase">{confirmedOrder.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9AA3B8]">Payment Method:</span>
                <span className="text-[#F4F3ED]">{confirmedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9AA3B8]">Total Amount:</span>
                <span className="text-[#C6F36A] font-bold text-sm">
                  ৳{confirmedOrder.totalAmount?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#2E364F]">
                <span className="text-[#9AA3B8]">Delivery Address:</span>
                <span className="text-[#F4F3ED] text-right max-w-xs truncate">
                  {confirmedOrder.shippingAddress}
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/orders">
                <Button variant="lime" size="md" className="gap-2">
                  <span>View My Orders</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/shop">
                <Button variant="card" size="md">
                  <span>Continue Shopping</span>
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-[#10131F] text-[#F4F3ED] min-h-screen py-10 sm:py-16">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C6F36A]">
              SECURE CHECKOUT
            </span>
            <span className="text-[#657189]">•</span>
            <span className="text-xs text-[#9AA3B8]">Real API Integration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4F3ED]">
            Finalize Your Purchase
          </h1>
        </div>

        {/* Auth Guard Banner if not logged in */}
        {!isAuthenticated && (
          <div className="mb-8 p-5 rounded-2xl bg-[#FF8066]/10 border border-[#FF8066]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-[#FF8066]/20 text-[#FF8066] flex items-center justify-center shrink-0 mt-0.5">
                <UserIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#F4F3ED]">
                  Sign In Required for Order Placement
                </h3>
                <p className="text-xs text-[#9AA3B8] mt-0.5">
                  The Express backend requires a verified authentication token to place customer orders.
                </p>
              </div>
            </div>

            <Link href="/login?redirect=/checkout">
              <Button variant="lime" size="sm" className="whitespace-nowrap font-bold">
                Sign In to Continue
              </Button>
            </Link>
          </div>
        )}

        {/* API Error Banner */}
        {apiError && (
          <div
            role="alert"
            className="mb-8 p-5 rounded-2xl bg-[#FF8066]/15 border border-[#FF8066]/40 flex items-start gap-3 text-xs sm:text-sm text-[#FF8066] animate-fade-in"
          >
            <div className="h-5 w-5 rounded-full bg-[#FF8066]/20 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircleIcon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="font-bold">Backend API Error: </span>
              <span>{apiError}</span>
            </div>
          </div>
        )}

        {/* Checkout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Delivery & Payment Details */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handlePlaceOrder} id="checkout-form" className="space-y-6">
              {/* Delivery Address Card */}
              <div className="p-6 rounded-2xl bg-[#22283A] border border-[#2E364F] space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#2E364F]">
                  <TruckIcon className="w-5 h-5 text-[#C6F36A]" />
                  <h2 className="text-base font-bold text-[#F4F3ED]">
                    Shipping & Delivery Details
                  </h2>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F4F3ED] mb-1.5">
                    Street Address & House / Apartment *
                  </label>
                  <Input
                    type="text"
                    value={shippingAddress}
                    onChange={(e) => {
                      setShippingAddress(e.target.value);
                      if (formErrors.shippingAddress) {
                        setFormErrors((prev) => ({ ...prev, shippingAddress: undefined }));
                      }
                    }}
                    placeholder="House 12, Road 4, Sector 7, Uttara"
                    error={!!formErrors.shippingAddress}
                    disabled={isLoading}
                  />
                  {formErrors.shippingAddress && (
                    <p className="mt-1 text-xs text-[#FF8066]">
                      {formErrors.shippingAddress}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#F4F3ED] mb-1.5">
                      City / Division
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-11 bg-[#10131F] text-xs text-[#F4F3ED] rounded-xl px-3 border border-[#2E364F] focus:border-[#C6F36A] outline-none"
                    >
                      <option value="Dhaka">Dhaka</option>
                      <option value="Chittagong">Chittagong</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Khulna">Khulna</option>
                      <option value="Barisal">Barisal</option>
                      <option value="Rangpur">Rangpur</option>
                      <option value="Mymensingh">Mymensingh</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#F4F3ED] mb-1.5">
                      Contact Phone *
                    </label>
                    <Input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => {
                        setContactPhone(e.target.value);
                        if (formErrors.contactPhone) {
                          setFormErrors((prev) => ({ ...prev, contactPhone: undefined }));
                        }
                      }}
                      placeholder="+880 1700 000000"
                      error={!!formErrors.contactPhone}
                      disabled={isLoading}
                    />
                    {formErrors.contactPhone && (
                      <p className="mt-1 text-xs text-[#FF8066]">
                        {formErrors.contactPhone}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F4F3ED] mb-1.5">
                    Order Delivery Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="E.g. Leave with security desk, deliver after 3 PM"
                    className="w-full bg-[#10131F] text-xs text-[#F4F3ED] placeholder-[#657189] rounded-xl p-3 border border-[#2E364F] focus:border-[#C6F36A] outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Payment Method Card */}
              <div className="p-6 rounded-2xl bg-[#22283A] border border-[#2E364F] space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#2E364F]">
                  <LockIcon className="w-5 h-5 text-[#C6F36A]" />
                  <h2 className="text-base font-bold text-[#F4F3ED]">
                    Payment Method
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === "CASH_ON_DELIVERY"
                        ? "bg-[#C6F36A]/10 border-[#C6F36A] text-[#F4F3ED]"
                        : "bg-[#171B2B] border-[#2E364F] text-[#9AA3B8] hover:border-[#3E496A]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CASH_ON_DELIVERY"
                      checked={paymentMethod === "CASH_ON_DELIVERY"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-[#C6F36A]"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-[#F4F3ED]">Cash on Delivery</p>
                      <p className="text-[11px] text-[#9AA3B8]">Pay upon package delivery</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === "ONLINE_PAYMENT"
                        ? "bg-[#C6F36A]/10 border-[#C6F36A] text-[#F4F3ED]"
                        : "bg-[#171B2B] border-[#2E364F] text-[#9AA3B8] hover:border-[#3E496A]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="ONLINE_PAYMENT"
                      checked={paymentMethod === "ONLINE_PAYMENT"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-[#C6F36A]"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-[#F4F3ED]">Digital Payment</p>
                      <p className="text-[11px] text-[#9AA3B8]">bKash, Nagad, Visa, Card</p>
                    </div>
                  </label>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-[#22283A] border border-[#2E364F] space-y-4 sticky top-28">
              <div className="flex items-center justify-between pb-3 border-b border-[#2E364F]">
                <div className="flex items-center gap-2">
                  <CartIcon className="w-5 h-5 text-[#C6F36A]" />
                  <h3 className="text-base font-bold text-[#F4F3ED]">Order Summary</h3>
                </div>
                <span className="text-xs font-mono text-[#9AA3B8]">
                  {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
                </span>
              </div>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                {items.length === 0 ? (
                  <p className="text-xs text-[#9AA3B8] text-center py-4">
                    Your cart is empty.
                  </p>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-xs py-1"
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <p className="font-semibold text-[#F4F3ED] truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-[#9AA3B8]">
                          Qty: {item.quantity} × ৳{item.price.toLocaleString()}
                        </p>
                      </div>
                      <span className="font-mono text-[#C6F36A] font-semibold shrink-0">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Cost Breakdown */}
              <div className="pt-3 border-t border-[#2E364F] space-y-2 text-xs">
                <div className="flex justify-between text-[#9AA3B8]">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#F4F3ED]">
                    ৳{totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[#9AA3B8]">
                  <span>Shipping Fee</span>
                  <span className="font-mono text-[#C6F36A]">
                    {shippingFee === 0 ? "FREE" : `৳${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-[#F4F3ED] pt-2 border-t border-[#2E364F]">
                  <span>Grand Total</span>
                  <span className="font-mono text-[#C6F36A]">
                    ৳{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                form="checkout-form"
                variant="lime"
                size="lg"
                disabled={isLoading || items.length === 0}
                className="w-full text-sm font-bold shadow-[0_0_20px_rgba(198,243,106,0.3)] hover:shadow-[0_0_30px_rgba(198,243,106,0.5)] transition-all"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <SpinnerIcon className="w-4 h-4" />
                    <span>Transacting Order...</span>
                  </div>
                ) : !isAuthenticated ? (
                  <span>Sign In to Place Order</span>
                ) : (
                  <span>Confirm & Place Order (৳{grandTotal.toLocaleString()})</span>
                )}
              </Button>

              <p className="text-[11px] text-center text-[#657189] flex items-center justify-center gap-1.5">
                <SparklesIcon className="w-3.5 h-3.5 text-[#C6F36A]" />
                <span>Verified Express Backend Integration</span>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
