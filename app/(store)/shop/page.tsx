import React from "react";
import { getProducts, getCategories } from "@/lib/firestore";
import { ShopView } from "@/components/store/ShopView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Catalogue",
  description: "Explore the full collection of minimal luxury garments by YADAVYA.",
};

export const revalidate = 60;

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    filter?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts({ status: "published" }),
    getCategories(),
  ]);

  return (
    <ShopView
      products={products}
      categories={categories}
      initialCategory={params.category}
      initialFilter={params.filter}
    />
  );
}
