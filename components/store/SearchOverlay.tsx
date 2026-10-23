"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatPrice } from "@/lib/formatters";
import { getProducts } from "@/lib/firestore";
import type { Product } from "@/types";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
      loadAllProducts();
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const loadAllProducts = async () => {
    setLoading(true);
    try {
      const all = await getProducts({ status: "published" });
      setProducts(all);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
        );
      })
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 bg-white/98 backdrop-blur-none flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Search garments"
        >
          {/* Top Bar */}
          <div className="w-full max-w-[1360px] mx-auto px-6 md:px-12 py-6 flex items-center justify-between border-hairline-b">
            <span className="text-[11px] font-medium tracking-[0.25em] text-ink-soft uppercase">
              Search Catalogue
            </span>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-ink hover:text-ink-soft transition-colors flex items-center gap-2"
              aria-label="Close search"
            >
              <span className="text-[12px] tracking-[0.2em] uppercase font-normal hidden sm:inline">
                Close
              </span>
              <Icon name="close" size={18} />
            </button>
          </div>

          {/* Search Input */}
          <div className="w-full max-w-[800px] mx-auto px-6 md:px-12 pt-12 pb-8">
            <div className="relative border-hairline-b focus-within:border-ink transition-colors pb-3 flex items-center gap-4">
              <Icon name="search" size={20} className="text-ink-soft" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by silhouette, material, or keyword..."
                className="w-full text-lg md:text-2xl text-ink placeholder:text-ink-soft/40 bg-transparent outline-none tracking-tight font-normal"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-xs uppercase tracking-widest text-ink-soft hover:text-ink"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Search Results Area */}
          <div className="w-full max-w-[800px] mx-auto px-6 md:px-12 flex-1 overflow-y-auto pb-16">
            {loading && query.trim() ? (
              <div className="py-12 text-center text-sm text-ink-soft">
                Searching collection...
              </div>
            ) : query.trim() && filteredProducts.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-base text-ink font-normal mb-1">
                  No garments match &ldquo;{query}&rdquo;
                </p>
                <p className="text-sm text-ink-soft">
                  Try searching for terms such as shirt, linen, trouser, or coat.
                </p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="divide-y divide-line">
                <p className="text-[11px] uppercase tracking-[0.25em] text-ink-soft py-4">
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1 ? "Result" : "Results"}
                </p>
                {filteredProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-5 py-4 group hover:bg-surface/50 px-2 transition-colors"
                  >
                    <div className="w-14 h-18 shrink-0 bg-surface relative">
                      <SafeImage
                        src={p.images?.[0]?.url || ""}
                        alt={p.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-ink group-hover:text-blue-500 transition-colors truncate">
                        {p.name}
                      </h4>
                      <p className="text-xs text-ink-soft truncate mt-0.5">
                        {p.shortDescription}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-ink tabular-nums">
                      {formatPrice(p.price)}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-[11px] uppercase tracking-[0.25em] text-ink-soft">
                  Popular searches: Linen Shirt, Wool Trouser, Overcoat, Tee
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
