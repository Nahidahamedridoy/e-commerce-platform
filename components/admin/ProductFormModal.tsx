"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AdminProduct } from "@/types/admin";
import { CloseIcon, UploadIcon, CheckIcon, SparklesIcon } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: AdminProduct) => void;
  initialProduct?: AdminProduct | null;
}

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

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProduct,
}) => {
  const isEditing = Boolean(initialProduct);

  const [name, setName] = useState("");
  const [category, setCategory] = useState<AdminProduct["category"]>("Electronics");
  const [price, setPrice] = useState<number>(10000);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(undefined);
  const [stock, setStock] = useState<number>(20);
  const [sku, setSku] = useState("");
  const [status, setStatus] = useState<AdminProduct["status"]>("published");
  const [badge, setBadge] = useState<AdminProduct["badge"]>("NEW");
  const [image, setImage] = useState("/images/hero-showcase.jpg");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name);
      setCategory(initialProduct.category);
      setPrice(initialProduct.price);
      setOriginalPrice(initialProduct.originalPrice);
      setStock(initialProduct.stock);
      setSku(initialProduct.sku);
      setStatus(initialProduct.status);
      setBadge(initialProduct.badge);
      setImage(initialProduct.image);
      setDescription(initialProduct.description);
    } else {
      setName("");
      setCategory("Electronics");
      setPrice(8500);
      setOriginalPrice(9900);
      setStock(15);
      setSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
      setStatus("published");
      setBadge("NEW");
      setImage("/images/hero-showcase.jpg");
      setDescription("Premium handcrafted product engineered for modern aesthetics and high durability.");
    }
    setErrors({});
  }, [initialProduct, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Product name is required";
    if (price <= 0) newErrors.price = "Price must be greater than 0";
    if (stock < 0) newErrors.stock = "Stock cannot be negative";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!image.trim()) newErrors.image = "Product image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      let stockStatus: AdminProduct["stockStatus"] = "in_stock";
      if (Number(stock) === 0) stockStatus = "out_of_stock";
      else if (Number(stock) <= 8) stockStatus = "low_stock";

      const productData: AdminProduct = {
        id: initialProduct?.id || `prod-${Date.now()}`,
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
        rating: initialProduct?.rating || 4.8,
        reviewCount: initialProduct?.reviewCount || 1,
        salesCount: initialProduct?.salesCount || 0,
        badge: badge || undefined,
        createdAt: initialProduct?.createdAt || new Date().toISOString().split("T")[0],
      };

      onSave(productData);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl my-8 bg-[#1A2030] border border-[#2E364F] rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#2E364F] bg-[#141927]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C6F36A]">
                {isEditing ? "Edit Product" : "New Inventory"}
              </span>
              <span className="text-[#657189]">•</span>
              <span className="text-xs text-[#9AA3B8]">
                {isEditing ? `SKU: ${initialProduct?.sku}` : "Local Catalog"}
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#F4F3ED] mt-0.5">
              {isEditing ? "Update Product Details" : "Add New Product"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#9AA3B8] hover:text-[#F4F3ED] hover:bg-[#22283A] rounded-xl transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold font-mono tracking-wider text-[#9AA3B8] uppercase border-b border-[#2E364F]/50 pb-1.5">
              1. General Information
            </h3>

            <div>
              <label className="block text-xs font-medium text-[#F4F3ED] mb-1.5">
                Product Title <span className="text-[#FF8066]">*</span>
              </label>
              <Input
                type="text"
                placeholder="e.g. Stealth ANC Wireless Studio Headphones"
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
                  className="w-full h-11 bg-[#10131F] text-[#F4F3ED] text-sm rounded-xl border border-[#2E364F] px-3.5 focus:border-[#C6F36A] focus:ring-1 focus:ring-[#C6F36A] outline-none transition-all"
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
                  placeholder="e.g. ELEC-OBS-01"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F4F3ED] mb-1.5">
                Description <span className="text-[#FF8066]">*</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail product features, materials, warranty, and key selling points..."
                className="w-full bg-[#10131F] text-[#F4F3ED] text-sm placeholder-[#657189] rounded-xl border border-[#2E364F] p-3.5 focus:border-[#C6F36A] focus:ring-1 focus:ring-[#C6F36A] outline-none transition-all"
              />
              {errors.description && (
                <p className="mt-1 text-xs text-[#FF8066]">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Section 2: Pricing & Stock */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold font-mono tracking-wider text-[#9AA3B8] uppercase border-b border-[#2E364F]/50 pb-1.5">
              2. Pricing & Inventory
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#F4F3ED] mb-1.5">
                  Selling Price (৳) <span className="text-[#FF8066]">*</span>
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
                  Original Price (৳) <span className="text-[#657189]">(Optional)</span>
                </label>
                <Input
                  type="number"
                  min="0"
                  placeholder="e.g. 12000"
                  value={originalPrice || ""}
                  onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F4F3ED] mb-1.5">
                  Stock Units <span className="text-[#FF8066]">*</span>
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
                  Listing Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as AdminProduct["status"])}
                  className="w-full h-11 bg-[#10131F] text-[#F4F3ED] text-sm rounded-xl border border-[#2E364F] px-3.5 focus:border-[#C6F36A] focus:ring-1 focus:ring-[#C6F36A] outline-none transition-all"
                >
                  <option value="published">Published (Visible on Store)</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F4F3ED] mb-1.5">
                  Merchandising Badge
                </label>
                <select
                  value={badge || ""}
                  onChange={(e) => setBadge(e.target.value ? (e.target.value as AdminProduct["badge"]) : undefined)}
                  className="w-full h-11 bg-[#10131F] text-[#F4F3ED] text-sm rounded-xl border border-[#2E364F] px-3.5 focus:border-[#C6F36A] focus:ring-1 focus:ring-[#C6F36A] outline-none transition-all"
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

          {/* Section 3: Media & Presets */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold font-mono tracking-wider text-[#9AA3B8] uppercase border-b border-[#2E364F]/50 pb-1.5">
              3. Product Imagery
            </h3>

            <div>
              <label className="block text-xs font-medium text-[#F4F3ED] mb-1.5">
                Image Path or URL <span className="text-[#FF8066]">*</span>
              </label>
              <Input
                type="text"
                placeholder="/images/hero-showcase.jpg"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                error={Boolean(errors.image)}
              />
              {errors.image && (
                <p className="mt-1 text-xs text-[#FF8066]">{errors.image}</p>
              )}
            </div>

            {/* Quick Image Presets from Existing Project Assets */}
            <div>
              <span className="block text-[11px] font-medium text-[#9AA3B8] mb-2">
                Or select from authentic project asset library:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => setImage(preset.url)}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs border transition-all ${
                      image === preset.url
                        ? "bg-[#22283A] text-[#C6F36A] border-[#C6F36A] shadow-[0_0_10px_rgba(198,243,106,0.2)]"
                        : "bg-[#141927] text-[#9AA3B8] border-[#2E364F] hover:text-[#F4F3ED] hover:border-[#3E496A]"
                    }`}
                  >
                    <div className="relative w-5 h-5 rounded overflow-hidden bg-[#10131F]">
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

            {/* Preview Banner */}
            <div className="flex items-center gap-4 p-3 rounded-xl bg-[#141927] border border-[#2E364F]">
              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#10131F] border border-[#2E364F] shrink-0">
                <Image
                  src={image || "/images/hero-showcase.jpg"}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#F4F3ED] truncate">
                    {name || "Untitled Product"}
                  </span>
                  {badge && (
                    <Badge variant={badge === "HOT" || badge === "SALE" ? "coral" : "lime"} size="sm">
                      {badge}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono font-bold text-[#C6F36A]">
                    ৳ {Number(price || 0).toLocaleString()}
                  </span>
                  {originalPrice && originalPrice > price && (
                    <span className="text-[11px] text-[#657189] line-through font-mono">
                      ৳ {Number(originalPrice).toLocaleString()}
                    </span>
                  )}
                  <span className="text-[11px] text-[#9AA3B8] font-mono">
                    • {stock} in stock
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2E364F]">
            <Button
              type="button"
              variant="card"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="lime"
              disabled={isSubmitting}
              className="min-w-32"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-[#10131F] border-t-transparent rounded-full animate-spin" />
                  Saving...
                </span>
              ) : isEditing ? (
                "Update Product"
              ) : (
                "Save & Publish"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
