import React from "react";
import { getSiteSettings, getProducts, getCategories } from "@/lib/firestore";
import { Hero } from "@/components/store/home/Hero";
import { CategoryStrip } from "@/components/store/home/CategoryStrip";
import { FeaturedGrid } from "@/components/store/home/FeaturedGrid";
import { BrandStatement } from "@/components/store/home/BrandStatement";
import { AllProductsGrid } from "@/components/store/home/AllProductsGrid";
import { EditorialBanner } from "@/components/store/home/EditorialBanner";

export const revalidate = 60; // ISR revalidation

export default async function HomePage() {
  const [settings, products, categories] = await Promise.all([
    getSiteSettings(),
    getProducts({ status: "published" }),
    getCategories(),
  ]);

  return (
    <div className="w-full space-y-4">
      {/* 1. Hero */}
      <Hero settings={settings.hero} />

      {/* 2. Category Strip */}
      <CategoryStrip categories={categories} />

      {/* 3. New Arrivals / Featured Products */}
      <FeaturedGrid products={products} />

      {/* 4. Brand Statement */}
      <BrandStatement text={settings.brandStatement?.text} />

      {/* 5. All Products Grid (Preview 8) */}
      <AllProductsGrid products={products} />

      {/* 6. Editorial Banner */}
      <EditorialBanner settings={settings.editorialBanner} />
    </div>
  );
}
