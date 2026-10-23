"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SafeImage } from "@/components/ui/SafeImage";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { Category } from "@/types";

interface CategoryStripProps {
  categories: Category[];
}

export function CategoryStrip({ categories }: CategoryStripProps) {
  const [hoveredCat, setHoveredCat] = useState<Category | null>(null);

  if (categories.length === 0) return null;

  return (
    <section className="w-full py-12 sm:py-16 md:py-24 border-hairline-t border-hairline-b bg-surface/30 relative overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-12">
        <ScrollReveal yOffset={14}>
          <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-6 sm:mb-8">
            <span className="text-[10px] uppercase tracking-[0.28em] font-medium text-ink-soft">
              Explore Categories
            </span>
            <span className="text-[11px] text-ink-soft hidden md:inline">
              Select a division to filter catalogue
            </span>
          </div>

          {/* Text-based category links - responsive wrapping */}
          <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-3 sm:gap-y-4 text-xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-ink">
            {categories.map((cat, idx) => (
              <React.Fragment key={cat.id}>
                <Link
                  href={`/shop?category=${cat.id}`}
                  onMouseEnter={() => setHoveredCat(cat)}
                  onMouseLeave={() => setHoveredCat(null)}
                  className="relative group transition-colors hover:text-blue-500 py-1 touch-manipulation"
                >
                  <span>{cat.name}</span>
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-[1.5px] bg-blue-500" />
                </Link>
                {idx < categories.length - 1 && (
                  <span className="text-line select-none font-light">—</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* Floating Hover Image Preview on Desktop */}
      <AnimatePresence>
        {hoveredCat?.coverImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="hidden lg:block fixed pointer-events-none z-30 right-24 bottom-24 w-56 h-72 bg-white p-2 border border-line shadow-none"
          >
            <div className="relative w-full h-full bg-surface overflow-hidden">
              <SafeImage
                src={hoveredCat.coverImage}
                alt={hoveredCat.name}
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
