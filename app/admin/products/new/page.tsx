"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AdminProduct } from "@/types/admin";
import { ArrowRightIcon, ChevronLeftIcon, CheckIcon, SparklesIcon } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Home & Living",
  "Beauty & Care",
  "Accessories",
  "Lifestyle",
] as const;

const PRESET_IMAGES = [
  { label: "Studio Headphones", url: "/images/hero-showcase.jpg" },
  { label: "Wireless Earbuds", url: "/images/cat-electronics.jpg" },
  { label: "Techwear Jacket", url: "/images/cat-fashion.jpg" },
  { label: "Field Watch", url: "/images/cat-accessories.jpg" },
  { label: "Ceramic Diffuser", url: "/images/cat-home-living.jpg" },
  { label: "Botanical Elixir", url: "/images/cat-beauty-care.jpg" },
  { label: "Titanium Pen", url: "/images/cat-lifestyle.jpg" },
];

export default function NewProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<AdminProduct["category"]>("Electronics");
  const [price, setPrice] = useState<number>(12500);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(14500);
  const [stock, setStock] = useState<number>(25);
  const [sku, setSku] = useState(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
  const [status, setStatus] = useState<AdminProduct["status"]>("published");
  const [badge, setBadge] = useState<AdminProduct["badge"]>("NEW");
  const [image, setImage] = useState("/images/hero-showcase.jpg");
  const [description, setDescription] = useState(
    "Handcrafted with precision components, minimal dark aesthetic, and backed by a comprehensive 1-year brand warranty."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Product name is required";
    if (price <= 0) errs.price = "Price must be greater than 0";
    if (stock < 0) errs.stock = "Stock cannot be negative";
    if (!description.trim()) errs.description = "Description is required";
    if (!image.trim()) errs.image = "Product image is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      let stockStatus: AdminProduct["stockStatus"] = "in_stock";
      if (Number(stock) === 0) stockStatus = "out_of_stock";
      else if (Number(stock) <= 8) stockStatus = "low_stock";

      const newProduct: AdminProduct = {
        id: `prod-${Date.now()}`,
        name: name.trim(),
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
        sku: sku || `SKU-${Date.now().toString().slice(-4)}`,
        category,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        stock: Number(stock),
        stockStatus,
        status,
        image: image.trim(),
        description: description.trim(),
        rating: 5.0,
        reviewCount: 1,
        salesCount: 0,
        badge: badge || undefined,
        createdAt: new Date().toISOString().split("T")[0],
      };

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("admin:product-added", { detail: newProduct })
        );
      }

      setIsSubmitting(false);
      setSuccess(true);

      setTimeout(() => {
        router.push("/admin/products");
      }, 1200);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Breadcrumb / Back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs text-[#9AA3B8] hover:text-[#C6F36A] transition-colors"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          <span>Back to Product List</span>
        </Link>

        <Badge variant="lime" size="sm">
          Catalog Editor
        </Badge>
      </div>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-[#F4F3ED] tracking-tight">
          Create New Product
        </h2>
        <p className="text-xs text-[#9AA3B8] mt-0.5">
          Fill in the details below to publish a new item to your online Amar Dokan inventory.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-[#C6F36A]/15 border border-[#C6F36A] text-[#C6F36A] flex items-center gap-3 animate-in fade-in">
          <CheckIcon className="w-5 h-5 shrink-0" />
          <div className="text-xs">
            <p className="font-bold">Product created successfully!</p>
            <p className="text-[#9AA3B8] mt-0.5">Redirecting to product inventory list...</p>
          </div>
        </div>
      )}

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="p-6 sm:p-8 rounded-2xl bg-[#22283A] border border-[#2E364F] space-y-8 shadow-2xl"
      >
        {/* Step 1: Core Details */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#C6F36A] border-b border-[#2E364F] pb-2">
            1. Basic Information
          </h3>

          <div>
            <label className="block text-xs font-medium text-[#F4F3ED] mb-1.5">
              Product Title <span className="text-[#FF8066]">*</span>
            </label>
            <Input
              type="text"
              placeholder="e.g. Apex Obsidian Mechanical Keyboard"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={Boolean(errors.name)}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-[#FF8066]">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#F4F3ED] mb-1.5">
                Category <span className="text-[#FF8066]">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AdminProduct["category"])}
                className="w-full h-11 bg-[#10131F] text-[#F4F3ED] text-sm rounded-xl border border-[#2E364F] px-3.5 focus:border-[#C6F36A] outline-none transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F4F3ED] mb-1.5">
                SKU / Barcode
              </label>
              <Input
                type="text"
                placeholder="e.g. ELEC-KB-01"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#F4F3ED] mb-1.5">
              Full Description <span className="text-[#FF8066]">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe materials, technical specs, warranty, and compatibility..."
              className="w-full bg-[#10131F] text-[#F4F3ED] text-sm rounded-xl border border-[#2E364F] p-3.5 focus:border-[#C6F36A] outline-none transition-all"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-[#FF8066]">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Step 2: Pricing & Stock */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#C6F36A] border-b border-[#2E364F] pb-2">
            2. Pricing & Inventory Controls
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#F4F3ED] mb-1.5">
                Regular Price (৳) <span className="text-[#FF8066]">*</span>
              </label>
              <Input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                error={Boolean(errors.price)}
              />
              {errors.price && (
                <p className="mt-1 text-xs text-[#FF8066]">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F4F3ED] mb-1.5">
                Compare-at Price (৳)
              </label>
              <Input
                type="number"
                min="0"
                placeholder="e.g. 15000"
                value={originalPrice || ""}
                onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F4F3ED] mb-1.5">
                Available Stock <span className="text-[#FF8066]">*</span>
              </label>
              <Input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                error={Boolean(errors.stock)}
              />
              {errors.stock && (
                <p className="mt-1 text-xs text-[#FF8066]">{errors.stock}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#F4F3ED] mb-1.5">
                Catalog Visibility
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AdminProduct["status"])}
                className="w-full h-11 bg-[#10131F] text-[#F4F3ED] text-sm rounded-xl border border-[#2E364F] px-3.5 focus:border-[#C6F36A] outline-none transition-all"
              >
                <option value="published">Published (Visible in Store)</option>
                <option value="draft">Draft (Private in Admin)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F4F3ED] mb-1.5">
                Storefront Badge
              </label>
              <select
                value={badge || ""}
                onChange={(e) => setBadge(e.target.value ? (e.target.value as AdminProduct["badge"]) : undefined)}
                className="w-full h-11 bg-[#10131F] text-[#F4F3ED] text-sm rounded-xl border border-[#2E364F] px-3.5 focus:border-[#C6F36A] outline-none transition-all"
              >
                <option value="">None</option>
                <option value="NEW">NEW</option>
                <option value="HOT">HOT</option>
                <option value="SALE">SALE</option>
                <option value="LIMITED">LIMITED</option>
              </select>
            </div>
          </div>
        </div>

        {/* Step 3: Media */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#C6F36A] border-b border-[#2E364F] pb-2">
            3. Product Image
          </h3>

          <div>
            <label className="block text-xs font-medium text-[#F4F3ED] mb-1.5">
              Image URL / Path <span className="text-[#FF8066]">*</span>
            </label>
            <Input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              error={Boolean(errors.image)}
            />
            {errors.image && (
              <p className="mt-1 text-xs text-[#FF8066]">{errors.image}</p>
            )}
          </div>

          <div>
            <span className="block text-xs font-medium text-[#9AA3B8] mb-2">
              Select existing project image asset:
            </span>
            <div className="flex flex-wrap gap-2.5">
              {PRESET_IMAGES.map((preset) => (
                <button
                  key={preset.url}
                  type="button"
                  onClick={() => setImage(preset.url)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs border transition-all ${
                    image === preset.url
                      ? "bg-[#10131F] text-[#C6F36A] border-[#C6F36A] shadow-[0_0_12px_rgba(198,243,106,0.2)]"
                      : "bg-[#141927] text-[#9AA3B8] border-[#2E364F] hover:text-[#F4F3ED] hover:border-[#3E496A]"
                  }`}
                >
                  <div className="relative w-6 h-6 rounded overflow-hidden bg-[#10131F]">
                    <Image
                      src={preset.url}
                      alt={preset.label}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="p-4 rounded-xl bg-[#141927] border border-[#2E364F] flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#10131F] border border-[#2E364F] shrink-0">
              <Image
                src={image || "/images/hero-showcase.jpg"}
                alt="Product preview"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#F4F3ED]">
                  {name || "Product Name Preview"}
                </span>
                {badge && (
                  <Badge variant={badge === "HOT" || badge === "SALE" ? "coral" : "lime"} size="sm">
                    {badge}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1 font-mono text-xs">
                <span className="font-bold text-[#C6F36A]">
                  ৳ {Number(price || 0).toLocaleString()}
                </span>
                {originalPrice && originalPrice > price && (
                  <span className="text-[#657189] line-through">
                    ৳ {Number(originalPrice).toLocaleString()}
                  </span>
                )}
                <span className="text-[#9AA3B8]">• {stock} units in stock</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2E364F]">
          <Link href="/admin/products">
            <Button type="button" variant="card">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            variant="lime"
            disabled={isSubmitting}
            className="min-w-36 shadow-[0_0_15px_rgba(198,243,106,0.3)] hover:shadow-[0_0_20px_rgba(198,243,106,0.5)]"
          >
            {isSubmitting ? "Publishing..." : "Publish Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
