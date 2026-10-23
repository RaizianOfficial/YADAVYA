import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getProductBySlug,
  getProducts,
  getSiteSettings,
} from "@/lib/firestore";
import { ProductDetailView } from "@/components/store/ProductDetailView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Garment Not Found",
    };
  }

  const coverImage = product.images?.[0]?.url || "";

  return {
    title: `${product.name} — YADAVYA`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} — YADAVYA`,
      description: product.shortDescription,
      images: coverImage ? [{ url: coverImage }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getSiteSettings(),
  ]);

  if (!product || product.status !== "published") {
    notFound();
  }

  const allProducts = await getProducts({
    categoryId: product.categoryId,
    status: "published",
    limitCount: 5,
  });

  const related = allProducts.filter((p) => p.id !== product.id);

  // JSON-LD Product Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images?.map((i) => i.url) || [],
    description: product.description,
    brand: {
      "@type": "Brand",
      name: "YADAVYA",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: product.sizes?.some((s) => s.stock > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "YADAVYA",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailView
        product={product}
        relatedProducts={related}
        shippingNote={settings.shippingNote}
      />
    </>
  );
}
