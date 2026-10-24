import { Metadata } from "next";
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
      <LoginForm />
    </AuthLayout>
  );
}
