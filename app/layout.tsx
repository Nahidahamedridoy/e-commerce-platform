import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import StoreProvider from "@/store/StoreProvider";
import { Navbar, Footer, CartDrawer } from "@/components/layout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Amar Dokan | Premium Dark E-Commerce",
  description:
    "Amar Dokan - Unique dark e-commerce shopping experience with modern aesthetics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full bg-[#10131F] text-[#F4F3ED] antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#10131F] text-[#F4F3ED] selection:bg-[#C6F36A]/20 selection:text-[#C6F36A]">
        <StoreProvider>
          <div className="flex min-h-screen flex-col bg-[#10131F] text-[#F4F3ED]">
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
            <CartDrawer />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
