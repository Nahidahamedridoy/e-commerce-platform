export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  badge?: "new" | "hot" | "sale" | "limited";
  inStock: boolean;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName?: string;
  itemCount: number;
  image?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface FilterState {
  category: string | null;
  minPrice: number;
  maxPrice: number;
  searchQuery: string;
  sortBy: "featured" | "price-low" | "price-high" | "rating";
}
