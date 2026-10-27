import { Metadata } from "next";
import { Suspense } from "react";
import { AuthLayout, LoginForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Sign In | Amar Dokan",
  description:
    "Sign in to your Amar Dokan account to manage orders, wishlists, and experience premium dark e-commerce shopping.",
};

export default function LoginPage() {
  return (
    <AuthLayout
      badgeText="MEMBER ACCESS"
      badgeVariant="lime"
      title="Welcome Back"
      subtitle="Sign in to access your orders, track deliveries, and unlock member discounts."
      footerText="Don't have an account yet?"
      footerLinkText="Sign up"
      footerLinkHref="/register"
    >
      <Suspense
        fallback={
          <div className="py-12 flex items-center justify-center text-[#9AA3B8]">
            <span className="h-3 w-3 rounded-full bg-[#C6F36A] animate-pulse" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
