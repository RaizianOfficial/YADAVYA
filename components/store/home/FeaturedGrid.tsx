"use client";

import React from "react";
import Link from "next/link";
import { ProductCard } from "@/components/store/ProductCard";
import { Icon } from "@/components/ui/Icon";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import type { Product } from "@/types";

interface FeaturedGridProps {
  products: Product[];
}

export function FeaturedGrid({ products }: FeaturedGridProps) {
  const featuredProducts = products.filter((p) => p.featured);
  const featured = (featuredProducts.length > 0 ? featuredProducts : products).slice(0, 4);

  return (
    <section className="py-14 sm:py-20 md:py-28 max-w-[1360px] mx-auto px-4 sm:px-6 md:px-12">
      {/* Header with Scroll Reveal */}
      <ScrollReveal yOffset={16}>
        <div className="flex items-end justify-between pb-6 sm:pb-8 border-hairline-b mb-8 sm:mb-10">
          <div>
            <span className="text-[10px] uppercase tracking-[0.28em] font-medium text-ink-soft block">
              Curated Selection
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-medium tracking-tight text-ink mt-1">
              Featured Editions
            </h2>
          </div>

          <Link
            href="/shop?filter=featured"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-ink hover:text-blue-500 transition-colors py-1 touch-manipulation"
          >
            <span className="hidden xs:inline">View All Editions</span>
            <span className="xs:hidden">All</span>
            <Icon
              name="arrowRight"
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </ScrollReveal>

      {/* Grid or Elegant Empty State */}
      {featured.length === 0 ? (
        <ScrollReveal>
          <div className="py-16 sm:py-20 text-center border border-dashed border-line bg-surface/30 p-6 sm:p-8">
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-ink-soft font-normal">
              The collection is being prepared.
            </p>
            <p className="text-[11px] sm:text-xs text-ink-soft/70 mt-1">
              New curated editions will be presented shortly.
            </p>
          </div>
        </ScrollReveal>
      ) : (
        <StaggerContainer
          staggerDelay={0.08}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-8"
        >
          {featured.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </section>
  );
}
