"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatPrice } from "@/lib/formatters";
import { Icon } from "@/components/ui/Icon";
import { useCartStore } from "@/store/useCartStore";
import { ProductCard } from "@/components/store/ProductCard";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import type { Product } from "@/types";

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
  shippingNote?: string;
}

export function ProductDetailView({
  product,
  relatedProducts,
  shippingNote = "Orders dispatched within 24-48 hours. Delivered nationwide within 3-5 business days.",
}: ProductDetailViewProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes?.find((s) => s.stock > 0)?.label || product.sizes?.[0]?.label || ""
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors?.[0]?.name || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>("details");

  const { addItem } = useCartStore();

  const images = product.images?.length > 0 ? product.images : [{ url: "", alt: product.name }];
  const currentSizeObj = product.sizes?.find((s) => s.label === selectedSize);
  const isOutOfStock = !currentSizeObj || currentSizeObj.stock <= 0;

  const handleAddToBag = () => {
    if (isOutOfStock) return;
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        size: selectedSize,
        color: selectedColor || undefined,
        image: images[0]?.url || "",
      },
      quantity
    );
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-12 py-6 sm:py-10 md:py-16">
      {/* Breadcrumbs */}
      <ScrollReveal yOffset={10}>
        <div className="pb-6 sm:pb-8 flex items-center gap-2 text-xs text-ink-soft overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-ink transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-ink transition-colors">
            Shop
          </Link>
          <span>/</span>
          <span className="text-ink truncate max-w-[180px] sm:max-w-xs">
            {product.name}
          </span>
        </div>
      </ScrollReveal>

      {/* Main Grid: Left Gallery + Right Sticky Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7">
          {/* Desktop: Vertical Stack with Scroll Reveal */}
          <div className="hidden lg:flex flex-col gap-6">
            {images.map((img, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.08} yOffset={24}>
                <div
                  onClick={() => {
                    setSelectedImageIndex(idx);
                    setLightboxOpen(true);
                  }}
                  className="relative aspect-[4/5] bg-surface overflow-hidden border border-line cursor-zoom-in group"
                >
                  <SafeImage
                    src={img.url}
                    alt={img.alt || `${product.name} photo ${idx + 1}`}
                    fill
                    priority={idx === 0}
                    sizes="58vw"
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Mobile: Swipeable Carousel with Dot Indicators and Touch Support */}
          <div className="lg:hidden space-y-3">
            <div
              className="relative aspect-[4/5] bg-surface overflow-hidden border border-line cursor-zoom-in touch-pan-y"
              onClick={() => setLightboxOpen(true)}
            >
              <SafeImage
                src={images[selectedImageIndex]?.url || ""}
                alt={images[selectedImageIndex]?.alt || product.name}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute bottom-3 right-3 bg-white/90 px-2 py-1 text-[10px] tracking-wider text-ink border border-line">
                {selectedImageIndex + 1} / {images.length}
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex items-center justify-center gap-2 pt-1">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`h-1.5 transition-all duration-300 touch-manipulation ${
                      selectedImageIndex === idx
                        ? "bg-ink w-6"
                        : "bg-line w-2 hover:bg-ink-soft"
                    }`}
                    aria-label={`Show image ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Product Purchase Details */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6 sm:space-y-8">
          {/* Header & Pricing */}
          <ScrollReveal yOffset={12}>
            <div className="space-y-2 sm:space-y-3 pb-6 border-hairline-b">
              <span className="text-[10px] uppercase tracking-[0.25em] font-medium text-ink-soft block">
                Architectural Silhouette
              </span>
              <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 text-lg tabular-nums pt-1">
                <span className="font-medium text-ink">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-ink-soft/50 line-through text-sm">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-ink-soft leading-relaxed pt-1">
                {product.shortDescription}
              </p>
            </div>
          </ScrollReveal>

          {/* Color Selector (if available) */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-ink-soft">
                  Color Option
                </span>
                <span className="text-ink font-medium">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex items-center gap-2 px-3 py-2 text-xs border transition-colors touch-manipulation ${
                      selectedColor === c.name
                        ? "border-ink bg-surface font-medium"
                        : "border-line bg-white hover:border-ink/50"
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 border border-black/10 shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-ink-soft">
                Select Size
              </span>
              {isOutOfStock && (
                <span className="text-red-600 text-[11px] font-medium">
                  Sold Out
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              {product.sizes?.map((sz) => {
                const available = sz.stock > 0;
                const selected = selectedSize === sz.label;

                return (
                  <button
                    key={sz.label}
                    type="button"
                    disabled={!available}
                    onClick={() => setSelectedSize(sz.label)}
                    className={`min-w-[42px] h-11 px-2 text-xs font-medium border flex items-center justify-center transition-colors relative touch-manipulation ${
                      !available
                        ? "line-through text-ink-soft/40 border-line bg-surface cursor-not-allowed"
                        : selected
                        ? "border-ink bg-ink text-white"
                        : "border-line bg-white text-ink hover:border-ink"
                    }`}
                  >
                    {sz.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity and Add to Bag */}
          <div className="space-y-3 sm:space-y-4 pt-2">
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Quantity */}
              <div className="flex items-center border border-line bg-white h-12 shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 h-full text-ink hover:bg-surface transition-colors touch-manipulation"
                  aria-label="Decrease quantity"
                >
                  <Icon name="minus" size={13} />
                </button>
                <span className="px-2 sm:px-3 text-xs font-medium tabular-nums text-ink">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity(
                      Math.min(currentSizeObj?.stock || 10, quantity + 1)
                    )
                  }
                  className="px-3 h-full text-ink hover:bg-surface transition-colors touch-manipulation"
                  aria-label="Increase quantity"
                >
                  <Icon name="plus" size={13} />
                </button>
              </div>

              {/* Full-width Solid --ink Add to Bag Button */}
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToBag}
                className="flex-1 h-12 bg-ink text-white text-xs uppercase tracking-[0.25em] font-medium hover:bg-ink/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation"
              >
                {isOutOfStock ? "Out of Stock" : "Add to Bag"}
              </button>
            </div>

            <p className="text-[10px] text-center text-ink-soft tracking-wider">
              Complimentary shipping across India. Cash on Delivery available.
            </p>
          </div>

          {/* Accordion Sections: Details, Fabric & Care, Shipping & Returns */}
          <div className="divide-y divide-line border-hairline-t border-hairline-b pt-2">
            {/* 1. Silhouette & Details */}
            <div className="py-4">
              <button
                type="button"
                onClick={() => toggleAccordion("details")}
                className="w-full flex items-center justify-between text-xs uppercase tracking-[0.2em] font-medium text-ink hover:text-blue-500 transition-colors text-left touch-manipulation py-1"
              >
                <span>Silhouette & Tailoring Details</span>
                <Icon
                  name="chevronDown"
                  size={15}
                  className={`transition-transform duration-300 ${
                    openAccordion === "details" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openAccordion === "details" && (
                <div className="pt-3 text-xs text-ink-soft leading-relaxed space-y-2">
                  <p>{product.description}</p>
                </div>
              )}
            </div>

            {/* 2. Fabric and Care */}
            <div className="py-4">
              <button
                type="button"
                onClick={() => toggleAccordion("care")}
                className="w-full flex items-center justify-between text-xs uppercase tracking-[0.2em] font-medium text-ink hover:text-blue-500 transition-colors text-left touch-manipulation py-1"
              >
                <span>Fabric & Material Care</span>
                <Icon
                  name="chevronDown"
                  size={15}
                  className={`transition-transform duration-300 ${
                    openAccordion === "care" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openAccordion === "care" && (
                <div className="pt-3 text-xs text-ink-soft leading-relaxed space-y-2">
                  <p>{product.fabricCare}</p>
                </div>
              )}
            </div>

            {/* 3. Shipping and Returns */}
            <div className="py-4">
              <button
                type="button"
                onClick={() => toggleAccordion("shipping")}
                className="w-full flex items-center justify-between text-xs uppercase tracking-[0.2em] font-medium text-ink hover:text-blue-500 transition-colors text-left touch-manipulation py-1"
              >
                <span>Shipping & Returns Policy</span>
                <Icon
                  name="chevronDown"
                  size={15}
                  className={`transition-transform duration-300 ${
                    openAccordion === "shipping" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openAccordion === "shipping" && (
                <div className="pt-3 text-xs text-ink-soft leading-relaxed space-y-2">
                  <p>{shippingNote}</p>
                  <p>
                    Returns accepted within 7 days of delivery in pristine, unworn
                    condition with original tags intact.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox / Zoom Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <div
            className="fixed inset-0 z-50 bg-white/98 flex flex-col justify-between p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex justify-between items-center pb-3 border-hairline-b">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-ink font-medium truncate max-w-[240px]">
                {product.name} — Image {selectedImageIndex + 1} / {images.length}
              </span>
              <button
                onClick={() => setLightboxOpen(false)}
                className="p-2 text-ink hover:text-ink-soft touch-manipulation"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <div className="flex-1 relative my-4 max-w-4xl mx-auto w-full flex items-center justify-center">
              <SafeImage
                src={images[selectedImageIndex]?.url || ""}
                alt="Enlarged view"
                fill
                sizes="95vw"
                className="object-contain"
              />
            </div>

            <div className="flex justify-between items-center pt-3 border-hairline-t">
              <button
                onClick={() =>
                  setSelectedImageIndex(
                    (selectedImageIndex - 1 + images.length) % images.length
                  )
                }
                className="px-4 py-2.5 border border-line text-xs uppercase tracking-wider text-ink hover:bg-surface touch-manipulation"
              >
                ← Prev
              </button>
              <button
                onClick={() =>
                  setSelectedImageIndex(
                    (selectedImageIndex + 1) % images.length
                  )
                }
                className="px-4 py-2.5 border border-line text-xs uppercase tracking-wider text-ink hover:bg-surface touch-manipulation"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Related Products Section with Scroll Reveal */}
      {relatedProducts.length > 0 && (
        <section className="pt-20 sm:pt-28 pb-12 border-hairline-t mt-20 sm:mt-28">
          <ScrollReveal yOffset={16}>
            <div className="flex items-end justify-between pb-6 sm:pb-8 border-hairline-b mb-8 sm:mb-10">
              <div>
                <span className="text-[10px] uppercase tracking-[0.28em] font-medium text-ink-soft block">
                  Harmonious Silhouettes
                </span>
                <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-ink mt-1">
                  Related Garments
                </h3>
              </div>

              <Link
                href="/shop"
                className="text-xs uppercase tracking-[0.2em] font-medium text-ink hover:text-blue-500 transition-colors py-1"
              >
                Shop All Catalogue →
              </Link>
            </div>
          </ScrollReveal>

          <StaggerContainer
            staggerDelay={0.08}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-8"
          >
            {relatedProducts.slice(0, 4).map((p) => (
              <StaggerItem key={p.id}>
                <ProductCard product={p} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      )}
    </div>
  );
}
