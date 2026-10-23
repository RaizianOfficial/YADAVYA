"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatPrice } from "@/lib/formatters";
import { Icon } from "@/components/ui/Icon";
import { useCartStore } from "@/store/useCartStore";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickModal, setShowQuickModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]?.label || "M");
  const { addItem } = useCartStore();

  const validImages = product.images?.filter((img) => img?.url?.trim()) || [];
  const coverImage = validImages[0]?.url || "";
  const hoverImage = validImages[1]?.url || "";

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        size: selectedSize,
        color: product.colors?.[0]?.name,
        image: coverImage,
      },
      1
    );
    setShowQuickModal(false);
  };

  return (
    <>
      <div
        className="group flex flex-col relative select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container (4:5 Aspect Ratio, calm whitespace, no shadows) */}
        <Link
          href={`/product/${product.slug}`}
          className="relative aspect-[4/5] w-full bg-surface overflow-hidden block touch-manipulation"
        >
          <div className="w-full h-full transform transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] relative">
            {/* Cover Image */}
            <SafeImage
              src={coverImage}
              alt={validImages[0]?.alt || product.name}
              fill
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              containerClassName="absolute inset-0"
              className={`object-cover transition-opacity duration-700 ${
                isHovered && hoverImage ? "opacity-0" : "opacity-100"
              }`}
            />

            {/* Hover Second Image */}
            {hoverImage && (
              <SafeImage
                src={hoverImage}
                alt={validImages[1]?.alt || `${product.name} alternate view`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                containerClassName="absolute inset-0"
                className={`object-cover transition-opacity duration-700 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              />
            )}
          </div>

          {/* Featured pill (restrained) */}
          {product.featured && (
            <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-white/95 px-2 py-0.5 border border-line">
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-medium text-ink">
                Featured
              </span>
            </div>
          )}

          {/* Quick View slide-up trigger (Desktop hover + mobile accessible) */}
          <div
            className={`hidden sm:flex absolute bottom-0 inset-x-0 bg-white/95 py-2.5 px-4 items-center justify-between border-t border-line transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isHovered ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowQuickModal(true);
              }}
              className="text-[10px] uppercase tracking-[0.2em] font-medium text-ink hover:text-blue-500 transition-colors w-full text-center"
            >
              Quick View
            </button>
          </div>
        </Link>

        {/* Product Details */}
        <div className="pt-2.5 sm:pt-3.5 pb-1 flex flex-col justify-between">
          <div className="space-y-0.5 sm:space-y-1">
            <Link
              href={`/product/${product.slug}`}
              className="block group/link touch-manipulation"
            >
              <h3 className="text-[11px] sm:text-xs uppercase font-medium tracking-[0.14em] sm:tracking-[0.16em] text-ink truncate relative inline-block">
                <span>{product.name}</span>
                <span className="block max-w-0 group-hover/link:max-w-full transition-all duration-300 h-px bg-ink" />
              </h3>
            </Link>

            <p className="text-[10px] sm:text-[11px] text-ink-soft truncate font-normal">
              {product.shortDescription}
            </p>
          </div>

          <div className="mt-1.5 sm:mt-2 flex items-center justify-between gap-2 text-xs tabular-nums">
            <div className="flex items-center gap-2">
              <span className="font-medium text-ink text-[11px] sm:text-xs">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-ink-soft/50 line-through text-[10px] sm:text-[11px]">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            {/* Mobile quick add tap icon */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowQuickModal(true);
              }}
              className="sm:hidden text-ink-soft hover:text-ink p-1 touch-manipulation -mr-1"
              aria-label="Quick inquiry"
            >
              <Icon name="plus" size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {showQuickModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQuickModal(false)}
              className="fixed inset-0 bg-[#0E1A24]/30"
            />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-lg bg-white border border-line p-5 sm:p-8 z-10 space-y-5 sm:space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start pb-3 sm:pb-4 border-hairline-b">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-ink-soft block font-medium">
                    Quick Inquiry
                  </span>
                  <h4 className="text-sm sm:text-base uppercase tracking-[0.15em] font-medium text-ink mt-1">
                    {product.name}
                  </h4>
                </div>
                <button
                  onClick={() => setShowQuickModal(false)}
                  className="p-1.5 -mr-1 text-ink-soft hover:text-ink touch-manipulation"
                >
                  <Icon name="close" size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-center">
                <div className="relative aspect-[4/5] bg-surface overflow-hidden">
                  <SafeImage
                    src={coverImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="text-base font-medium tabular-nums text-ink">
                    {formatPrice(product.price)}
                  </div>
                  <p className="text-xs text-ink-soft leading-relaxed line-clamp-3">
                    {product.shortDescription}
                  </p>

                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-ink-soft block">
                      Select Size
                    </span>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {product.sizes?.map((sz) => {
                        const inStock = sz.stock > 0;
                        const isSelected = selectedSize === sz.label;
                        return (
                          <button
                            key={sz.label}
                            type="button"
                            disabled={!inStock}
                            onClick={() => setSelectedSize(sz.label)}
                            className={`min-w-[36px] h-9 px-2 text-xs font-medium border flex items-center justify-center transition-colors touch-manipulation ${
                              !inStock
                                ? "line-through text-ink-soft/40 border-line bg-surface cursor-not-allowed"
                                : isSelected
                                ? "border-ink bg-ink text-white"
                                : "border-line text-ink hover:border-ink"
                            }`}
                          >
                            {sz.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2 space-y-2">
                    <button
                      type="button"
                      onClick={handleQuickAdd}
                      className="w-full py-3 bg-ink text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-ink/90 transition-colors touch-manipulation"
                    >
                      Add to Bag
                    </button>
                    <Link
                      href={`/product/${product.slug}`}
                      onClick={() => setShowQuickModal(false)}
                      className="block text-center text-[11px] uppercase tracking-wider text-ink-soft hover:text-ink py-1 touch-manipulation"
                    >
                      View Complete Garment Details →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
