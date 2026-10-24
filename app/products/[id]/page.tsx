import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SearchIcon, RotateCcwIcon, ArrowRightIcon } from "@/components/ui/Icons";
import { ProductCard } from "@/components/home/ProductCard";
import { ProductDetailsView } from "@/components/product";
import { ALL_PRODUCTS, getProductById, getRelatedProducts } from "@/lib/data/products";

interface ProductPageProps {
  params: Promise<{ id: string }>;
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
  const product = getProductById(id);

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
  const product = getProductById(id);

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
