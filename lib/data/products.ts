import { ProductItem } from "@/components/home/ProductCard";

export interface ProductDetail extends ProductItem {
  description: string;
  gallery: string[];
  features: string[];
  specs: { label: string; value: string }[];
  stockCount: number;
  sku: string;
  availability: "in_stock" | "low_stock" | "out_of_stock";
  estimatedDelivery: string;
}

export const ALL_PRODUCTS: ProductItem[] = [
  // 1. Electronics
  {
    id: "elec-1",
    name: "Obsidian ANC Wireless Studio Headphones",
    category: "Electronics",
    price: 18500,
    originalPrice: 21800,
    discountPercentage: 15,
    rating: 4.9,
    reviewCount: 142,
    image: "/images/hero-showcase.jpg",
    badge: "HOT",
  },
  {
    id: "elec-2",
    name: "Aura Pro Wireless Earbuds & Charging Case",
    category: "Electronics",
    price: 8200,
    originalPrice: 9900,
    discountPercentage: 17,
    rating: 4.8,
    reviewCount: 96,
    image: "/images/cat-electronics.jpg",
    badge: "SALE",
  },
  {
    id: "elec-3",
    name: "Apex Smartwatch & Magnetic Fast Charger",
    category: "Electronics",
    price: 11900,
    originalPrice: 14000,
    discountPercentage: 15,
    rating: 4.8,
    reviewCount: 124,
    image: "/images/hero-showcase.jpg",
    badge: "NEW",
  },
  {
    id: "elec-4",
    name: "Flux 3-in-1 Fast Wireless Charging Station",
    category: "Electronics",
    price: 4950,
    originalPrice: 5800,
    discountPercentage: 15,
    rating: 4.7,
    reviewCount: 63,
    image: "/images/hero-showcase.jpg",
    badge: "POPULAR",
  },

  // 2. Fashion
  {
    id: "fash-1",
    name: "Stealth All-Weather Techwear Shell Jacket",
    category: "Fashion",
    price: 14900,
    rating: 4.9,
    reviewCount: 68,
    image: "/images/cat-fashion.jpg",
    badge: "NEW",
  },
  {
    id: "fash-2",
    name: "Arcane Polarized Matte Black Sunglasses",
    category: "Fashion",
    price: 4200,
    originalPrice: 5200,
    discountPercentage: 19,
    rating: 4.7,
    reviewCount: 45,
    image: "/images/cat-fashion.jpg",
    badge: "SALE",
  },
  {
    id: "fash-3",
    name: "Minimalist Bifold Full-Grain Leather Wallet",
    category: "Fashion",
    price: 2800,
    rating: 4.8,
    reviewCount: 52,
    image: "/images/cat-fashion.jpg",
    badge: "POPULAR",
  },

  // 3. Home & Living
  {
    id: "home-1",
    name: "Komorebi Ceramic Ultrasonic Mist Diffuser",
    category: "Home & Living",
    price: 4800,
    originalPrice: 6000,
    discountPercentage: 20,
    rating: 4.7,
    reviewCount: 84,
    image: "/images/cat-home-living.jpg",
    badge: "POPULAR",
  },
  {
    id: "home-2",
    name: "Handcrafted Dark Stoneware Coffee Mug 350ml",
    category: "Home & Living",
    price: 1650,
    rating: 4.9,
    reviewCount: 110,
    image: "/images/cat-home-living.jpg",
    badge: "NEW",
  },
  {
    id: "home-3",
    name: "Geometric Matte Desk Planter & Saucer",
    category: "Home & Living",
    price: 2200,
    originalPrice: 2600,
    discountPercentage: 15,
    rating: 4.6,
    reviewCount: 39,
    image: "/images/cat-home-living.jpg",
    badge: "SALE",
  },

  // 4. Beauty & Care
  {
    id: "beauty-1",
    name: "Nirvana Midnight Botanical Facial Elixir 50ml",
    category: "Beauty & Care",
    price: 3400,
    originalPrice: 4000,
    discountPercentage: 15,
    rating: 4.9,
    reviewCount: 112,
    image: "/images/cat-beauty-care.jpg",
    badge: "HOT",
  },
  {
    id: "beauty-2",
    name: "Volcanic Mineral Exfoliating Facial Bar",
    category: "Beauty & Care",
    price: 1250,
    rating: 4.7,
    reviewCount: 58,
    image: "/images/cat-beauty-care.jpg",
    badge: "NEW",
  },
  {
    id: "beauty-3",
    name: "Organic Beard Conditioning Serum 30ml",
    category: "Beauty & Care",
    price: 2100,
    originalPrice: 2500,
    discountPercentage: 16,
    rating: 4.8,
    reviewCount: 71,
    image: "/images/cat-beauty-care.jpg",
    badge: "POPULAR",
  },

  // 5. Accessories
  {
    id: "acc-1",
    name: "Vanguard Automatic Field Watch & EDC Kit",
    category: "Accessories",
    price: 24500,
    rating: 5.0,
    reviewCount: 53,
    image: "/images/cat-accessories.jpg",
    badge: "POPULAR",
  },
  {
    id: "acc-2",
    name: "Aerospace Titanium Hex Bead Paracord Bracelet",
    category: "Accessories",
    price: 3200,
    originalPrice: 3800,
    discountPercentage: 16,
    rating: 4.8,
    reviewCount: 41,
    image: "/images/cat-accessories.jpg",
    badge: "SALE",
  },
  {
    id: "acc-3",
    name: "Carbon Fiber RFID-Blocking Slim Cardholder",
    category: "Accessories",
    price: 2950,
    rating: 4.9,
    reviewCount: 88,
    image: "/images/cat-accessories.jpg",
    badge: "HOT",
  },

  // 6. Lifestyle
  {
    id: "life-1",
    name: "Mono Vacuum Insulated Travel Tumbler 500ml",
    category: "Lifestyle",
    price: 2650,
    originalPrice: 3200,
    discountPercentage: 17,
    rating: 4.8,
    reviewCount: 79,
    image: "/images/cat-lifestyle.jpg",
    badge: "SALE",
  },
  {
    id: "life-2",
    name: "Full-Grain Leather Bound Journal & Solid Brass Pen",
    category: "Lifestyle",
    price: 3800,
    rating: 4.9,
    reviewCount: 64,
    image: "/images/cat-lifestyle.jpg",
    badge: "NEW",
  },
];

// Map of extended product details
const DETAILED_META: Record<
  string,
  {
    description: string;
    features: string[];
    specs: { label: string; value: string }[];
    gallery: string[];
    stockCount: number;
    sku: string;
  }
> = {
  "elec-1": {
    description:
      "Crafted for discerning audiophiles and focused creators, the Obsidian Studio ANC Headphones combine 40mm custom beryllium dynamic drivers with cutting-edge hybrid active noise cancellation. Plush memory foam ear cushions enveloped in supple protein leather ensure exceptional acoustic isolation for all-day listening sessions.",
    features: [
      "Advanced Hybrid Active Noise Cancellation with Transparency Mode",
      "Custom 40mm Beryllium Drivers delivering studio-grade reference sound",
      "Up to 45 hours playback with ultra-low latency wireless audio",
      "Ultra-soft memory foam cushions and aerospace aluminum headband",
      "Multipoint Bluetooth 5.4 connection with seamless device handoff",
    ],
    specs: [
      { label: "Driver Size", value: "40mm Beryllium Dynamic" },
      { label: "Frequency Range", value: "10Hz - 42,000Hz" },
      { label: "Battery Life", value: "45 Hours (ANC On) / 60h (Off)" },
      { label: "Connectivity", value: "Bluetooth 5.4, 3.5mm AUX, USB-C" },
      { label: "Weight", value: "268 grams" },
      { label: "Official Warranty", value: "1 Year Replacement Warranty" },
    ],
    gallery: [
      "/images/hero-showcase.jpg",
      "/images/cat-electronics.jpg",
      "/images/cat-accessories.jpg",
      "/images/hero-showcase.jpg",
    ],
    stockCount: 8,
    sku: "AD-OBS-ANC-01",
  },
  "fash-1": {
    description:
      "Engineered from high-density 3-layer breathable ripstop nylon, the Stealth Techwear Shell delivers impenetrable wind and water protection without sacrificing urban silhouette aesthetics. Waterproof sealed YKK zippers, articulated sleeves, and modular storm collar provide uncompromising defense against unpredictable downpours.",
    features: [
      "20,000mm Waterproof & 15,000g/m² Breathability rating",
      "Fully taped seams with waterproof dual-slider YKK zippers",
      "Articulated ergonomic sleeve construction for natural mobility",
      "Concealed magnetic utility pockets and chest stash compartments",
      "Reflective stealth accents for low-light metropolitan visibility",
    ],
    specs: [
      { label: "Material", value: "3-Layer GORE-Level Ripstop Nylon" },
      { label: "Zippers", value: "YKK Aquaguard Sealed Zippers" },
      { label: "Fit Type", value: "Modern Regular / Layering Cut" },
      { label: "Origin", value: "Crafted in Dhaka, Bangladesh" },
      { label: "Care", value: "Machine Wash Cold, Hang Dry" },
      { label: "Warranty", value: "6 Months Craftsmanship Guarantee" },
    ],
    gallery: [
      "/images/cat-fashion.jpg",
      "/images/cat-accessories.jpg",
      "/images/cat-lifestyle.jpg",
      "/images/cat-fashion.jpg",
    ],
    stockCount: 14,
    sku: "AD-STH-JKT-04",
  },
  "home-1": {
    description:
      "The Komorebi Ceramic Diffuser combines architectural stoneware craftsmanship with whisper-quiet 2.4MHz ultrasonic mist technology. Designed to elevate your living room or desk sanctuary with gentle humidification, ambient glow lighting, and continuous essential oil dispersal.",
    features: [
      "Hand-finished matte ceramic stoneware exterior shell",
      "Ultra-fine ultrasonic mist with 8-hour continuous runtime",
      "Warm ambient breathing LED ring mimicking gentle candlelight",
      "Auto shut-off sensor when water reservoir reaches empty",
      "BPA-free medical grade internal water reservoir",
    ],
    specs: [
      { label: "Capacity", value: "280 ml Water Reservoir" },
      { label: "Coverage Area", value: "Up to 350 sq. ft." },
      { label: "Sound Level", value: "< 20 dB (Whisper Silent)" },
      { label: "Power", value: "USB-C Powered (15W)" },
      { label: "Dimensions", value: "115mm x 115mm x 195mm" },
      { label: "Warranty", value: "1 Year Official Warranty" },
    ],
    gallery: [
      "/images/cat-home-living.jpg",
      "/images/cat-lifestyle.jpg",
      "/images/hero-showcase.jpg",
      "/images/cat-home-living.jpg",
    ],
    stockCount: 11,
    sku: "AD-KMR-DIF-09",
  },
  "acc-1": {
    description:
      "Forged from Grade 5 aerospace titanium and powered by a 24-jewel Japanese automatic movement, the Vanguard Field Watch is built for precision and rugged permanence. Featuring a scratchproof sapphire crystal lens with anti-reflective coating and 100m water resistance.",
    features: [
      "Grade 5 aerospace-grade titanium brushed case",
      "24-Jewel self-winding automatic movement with 41h reserve",
      "Scratchproof double-domed sapphire crystal with AR coating",
      "Swiss Super-LumiNova markers for nocturnal legibility",
      "Quick-release ballistic nylon strap and titanium hardware",
    ],
    specs: [
      { label: "Case Diameter", value: "39mm (11.2mm Thickness)" },
      { label: "Movement", value: "Japanese NH35A Automatic" },
      { label: "Water Resistance", value: "10 ATM / 100 Meters" },
      { label: "Lug Width", value: "20mm Interchangeable" },
      { label: "Weight", value: "58g (Ultra Lightweight)" },
      { label: "Warranty", value: "2 Year Mechanical Warranty" },
    ],
    gallery: [
      "/images/cat-accessories.jpg",
      "/images/hero-showcase.jpg",
      "/images/cat-fashion.jpg",
      "/images/cat-accessories.jpg",
    ],
    stockCount: 5,
    sku: "AD-VNG-WTC-12",
  },
};

export const getProductById = (id: string): ProductDetail | undefined => {
  const base = ALL_PRODUCTS.find((p) => p.id === id);
  if (!base) return undefined;

  const meta = DETAILED_META[id] || {
    description: `${base.name} represents the pinnacle of everyday refinement in the ${base.category} category. Precision engineered with premium materials, high-contrast aesthetics, and lasting resilience for modern living.`,
    features: [
      "Curated premium materials engineered for longevity",
      "Minimalist dark luxury aesthetics with ergonomic form factor",
      "Exclusively authenticated and verified distributor stock",
      "Covered by Amar Dokan 100% Genuine Guarantee",
    ],
    specs: [
      { label: "Category", value: base.category },
      { label: "Condition", value: "Brand New / Sealed Box" },
      { label: "Origin", value: "Verified Authentic Import" },
      { label: "Warranty", value: "1 Year Official Warranty" },
      { label: "Return Policy", value: "7-Day Easy Replacement" },
    ],
    gallery: [
      base.image,
      "/images/hero-showcase.jpg",
      "/images/cat-accessories.jpg",
      "/images/cat-lifestyle.jpg",
    ],
    stockCount: 12,
    sku: `AD-${base.id.toUpperCase()}-2026`,
  };

  return {
    ...base,
    ...meta,
    availability: meta.stockCount > 0 ? "in_stock" : "out_of_stock",
    estimatedDelivery: "24 - 48 Hours Across Bangladesh",
  };
};

export const getRelatedProducts = (
  currentId: string,
  category: string,
  limit = 4
): ProductItem[] => {
  const sameCategory = ALL_PRODUCTS.filter(
    (p) => p.id !== currentId && p.category === category
  );
  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }
  const others = ALL_PRODUCTS.filter(
    (p) => p.id !== currentId && p.category !== category
  );
  return [...sameCategory, ...others].slice(0, limit);
};
