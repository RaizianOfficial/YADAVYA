"use client";

import React, { useState, useMemo } from "react";
import { ProductCard } from "@/components/store/ProductCard";
import { Icon } from "@/components/ui/Icon";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import type { Product, Category } from "@/types";

interface ShopViewProps {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
  initialFilter?: string;
}

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];

export function ShopView({
  products,
  categories,
  initialCategory,
  initialFilter,
}: ShopViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || "all"
  );
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">(
    initialFilter === "new" ? "newest" : "newest"
  );
  const [featuredOnly, setFeaturedOnly] = useState<boolean>(
    initialFilter === "featured"
  );
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Filtering and sorting logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.categoryId === selectedCategory);
    }

    if (featuredOnly) {
      result = result.filter((p) => p.featured);
    }

    if (selectedSize !== "all") {
      result = result.filter((p) =>
        p.sizes?.some((s) => s.label === selectedSize && s.stock > 0)
      );
    }

    if (inStockOnly) {
      result = result.filter((p) =>
        p.sizes?.some((s) => s.stock > 0)
      );
    }

    // Sort
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else {
      result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }

    return result;
  }, [
    products,
    selectedCategory,
    selectedSize,
    inStockOnly,
    sortBy,
    featuredOnly,
  ]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleReset = () => {
    setSelectedCategory("all");
    setSelectedSize("all");
    setInStockOnly(false);
    setFeaturedOnly(false);
    setSortBy("newest");
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedSize !== "all" ||
    inStockOnly ||
    featuredOnly;

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-12 md:py-16 space-y-6 sm:space-y-8">
      {/* Page Title with Scroll Reveal */}
      <ScrollReveal yOffset={14}>
        <div className="pb-6 sm:pb-8 border-hairline-b flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.28em] font-medium text-ink-soft block">
              Catalogue
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-ink mt-1">
              All Garments
            </h1>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
            <span className="text-xs text-ink-soft tracking-wider tabular-nums">
              Showing {displayedProducts.length} of {filteredProducts.length}{" "}
              pieces
            </span>

            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden inline-flex items-center gap-2 px-3 py-2 bg-surface text-xs uppercase tracking-wider text-ink border border-line touch-manipulation min-h-[40px]"
            >
              <Icon name="filter" size={14} />
              <span>{mobileFilterOpen ? "Close" : "Filter"}</span>
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Filter and Sort Bar (Desktop inline, mobile collapsible) */}
      <div
        className={`${
          mobileFilterOpen ? "block" : "hidden"
        } md:block bg-surface/50 border border-line p-4 md:p-5 space-y-4 transition-all duration-300`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-ink-soft mr-2 w-full sm:w-auto">
              Category:
            </span>
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-colors touch-manipulation ${
                selectedCategory === "all"
                  ? "bg-ink text-white font-medium"
                  : "bg-white text-ink hover:bg-surface border border-line"
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-colors touch-manipulation ${
                  selectedCategory === c.id
                    ? "bg-ink text-white font-medium"
                    : "bg-white text-ink hover:bg-surface border border-line"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2 pt-2 sm:pt-0">
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-ink-soft">
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as "newest" | "price-asc" | "price-desc"
                )
              }
              className="px-3 py-1.5 text-xs bg-white border border-line focus:border-ink outline-none tracking-wider text-ink"
            >
              <option value="newest">Newest Editions</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Secondary filters: Size and Availability */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-hairline-t">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-ink-soft mr-2 w-full sm:w-auto">
              Size:
            </span>
            <button
              onClick={() => setSelectedSize("all")}
              className={`px-2.5 py-1 text-xs border touch-manipulation ${
                selectedSize === "all"
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-white text-ink-soft hover:text-ink"
              }`}
            >
              All
            </button>
            {ALL_SIZES.map((sz) => (
              <button
                key={sz}
                onClick={() => setSelectedSize(sz)}
                className={`px-2.5 py-1 text-xs border touch-manipulation ${
                  selectedSize === sz
                    ? "border-ink bg-ink text-white"
                    : "border-line bg-white text-ink-soft hover:text-ink"
                }`}
              >
                {sz}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs text-ink cursor-pointer touch-manipulation py-1">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-ink"
              />
              <span>In stock only</span>
            </label>

            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="text-xs text-ink-soft hover:text-ink underline tracking-wider touch-manipulation py-1"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Grid with Staggered Scroll Entrance */}
      {displayedProducts.length === 0 ? (
        <ScrollReveal>
          <div className="py-20 sm:py-24 text-center border border-dashed border-line bg-surface/30 p-6 sm:p-8 space-y-3">
            <p className="text-sm sm:text-base uppercase tracking-[0.2em] font-medium text-ink">
              {products.length === 0
                ? "The collection is being prepared."
                : "No garments match current criteria."}
            </p>
            <p className="text-xs text-ink-soft max-w-md mx-auto">
              {products.length === 0
                ? "The atelier is assembling the new collection. Please return shortly."
                : "Try adjusting your filters or selecting a different category."}
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="mt-4 px-4 py-2 border border-ink text-xs uppercase tracking-wider hover:bg-ink hover:text-white transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </ScrollReveal>
      ) : (
        <StaggerContainer
          staggerDelay={0.06}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-8"
        >
          {displayedProducts.map((product, idx) => (
            <StaggerItem key={product.id}>
              <ProductCard
                product={product}
                priority={idx < 4}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {/* Load More Text Button */}
      {hasMore && (
        <div className="text-center pt-8 sm:pt-12">
          <button
            onClick={() => setVisibleCount((prev) => prev + 8)}
            className="w-full sm:w-auto px-8 py-3.5 border border-ink text-xs uppercase tracking-[0.25em] font-medium text-ink hover:bg-ink hover:text-white transition-colors touch-manipulation"
          >
            Load More Silhouettes ({filteredProducts.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
