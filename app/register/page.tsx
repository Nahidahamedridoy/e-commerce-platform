import { Metadata } from "next";
import { AuthLayout, RegisterForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Create an Account | Amar Dokan",
  description:
    "Join Amar Dokan to discover quality everyday products, exclusive deals, and fast nationwide delivery.",
};

export default function RegisterPage() {
  return (
    <AuthLayout
      badgeText="JOIN AMAR DOKAN"
      badgeVariant="coral"
      title="Create an Account"
      subtitle="Sign up in seconds to start upgrading your everyday lifestyle with exclusive member benefits."
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkHref="/login"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
