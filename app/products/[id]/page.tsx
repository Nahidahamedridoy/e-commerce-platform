import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SearchIcon, RotateCcwIcon, ArrowRightIcon } from "@/components/ui/Icons";
import { ProductCard } from "@/components/home/ProductCard";
import { ProductDetailsView } from "@/components/product";
import { ALL_PRODUCTS, getProductById, getRelatedProducts, ProductDetail } from "@/lib/data/products";
import { productsApi } from "@/lib/api";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

async function resolveProduct(idOrSlug: string): Promise<ProductDetail | null> {
  try {
    const apiProd = await productsApi.getById(idOrSlug);
    if (apiProd) {
      return {
        id: apiProd.id,
        name: apiProd.name,
        category: apiProd.category?.name || "General",
        price: apiProd.price,
        rating: 4.8,
        reviewCount: 24,
        image: apiProd.images?.[0] || "/images/hero-showcase.jpg",
        description: apiProd.description,
        gallery: apiProd.images?.length
          ? apiProd.images
          : ["/images/hero-showcase.jpg", "/images/cat-accessories.jpg"],
        features: [
          "Engineered with precision components and premium materials",
          "Official 1-Year Amar Dokan Brand Warranty Included",
          "Fast Express Courier Delivery across all 64 districts",
          "7-Day Hassle-free replacement guarantee",
        ],
        specs: [
          { label: "Category", value: apiProd.category?.name || "General" },
          { label: "Stock Level", value: `${apiProd.stock} units in warehouse` },
          { label: "Authenticity", value: "100% Genuine Guaranteed" },
          { label: "Condition", value: "Factory Sealed Brand New" },
        ],
        stockCount: apiProd.stock,
        sku: `AD-${apiProd.id.slice(0, 8).toUpperCase()}`,
        availability: apiProd.stock > 0 ? "in_stock" : "out_of_stock",
        estimatedDelivery: "24 - 48 Hours Across Bangladesh",
      };
    }
  } catch {
    // Graceful fallback to static/sample product
  }
  return getProductById(idOrSlug) || null;
}

export async function generateStaticParams() {
  return ALL_PRODUCTS.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await resolveProduct(id);

  if (!product) {
    return {
      title: "Product Not Found | Amar Dokan",
      description: "The requested product does not exist.",
    };
  }

  return {
    title: `${product.name} | Amar Dokan`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} - Amar Dokan`,
      description: product.description.slice(0, 160),
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await resolveProduct(id);

  // Handle Invalid Product ID State
  if (!product) {
    const popularPicks = ALL_PRODUCTS.slice(0, 4);

    return (
      <div className="bg-[#10131F] text-[#F4F3ED] min-h-screen py-16 sm:py-24">
        <Container>
          <div className="max-w-2xl mx-auto text-center p-8 sm:p-14 rounded-3xl bg-[#22283A] border border-[#2E364F] shadow-2xl">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-[#171B2B] border border-[#2E364F] flex items-center justify-center mb-6 text-[#FF8066]">
              <SearchIcon className="w-8 h-8" />
            </div>

            <Badge variant="coral" size="sm" className="mb-3">
              404 • ITEM NOT FOUND
            </Badge>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F4F3ED] tracking-tight">
              We Couldn&apos;t Find That Product
            </h1>

            <p className="mt-4 text-sm sm:text-base text-[#9AA3B8] leading-relaxed max-w-lg mx-auto">
              The product you are attempting to view may have been removed, sold
              out, or the product identifier ({id}) is invalid.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/shop">
                <Button variant="lime" size="md" className="gap-2">
                  <RotateCcwIcon className="w-4 h-4" />
                  <span>Browse Full Catalog</span>
                </Button>
              </Link>

              <Link href="/">
                <Button variant="card" size="md" className="gap-2">
                  <span>Return to Homepage</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Popular Alternative Suggestions */}
          <div className="mt-20 pt-12 border-t border-[#2E364F]">
            <div className="mb-8 text-center sm:text-left">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C6F36A]">
                RECOMMENDED ALTERNATIVES
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#F4F3ED] mt-1">
                Explore Popular Picks
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularPicks.map((pick) => (
                <ProductCard key={pick.id} {...pick} />
              ))}
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const relatedProducts = getRelatedProducts(product.id, product.category, 4);

  return (
    <ProductDetailsView product={product} relatedProducts={relatedProducts} />
  );
}
