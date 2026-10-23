"use client";

import React, { useState } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatPrice } from "@/lib/formatters";
import type { ProductImage } from "@/types";

interface MiniProductPreviewProps {
  name: string;
  price: number;
  compareAtPrice?: number | null;
  images: ProductImage[];
  status: "draft" | "published";
  featured: boolean;
}

export function MiniProductPreview({
  name,
  price,
  compareAtPrice,
  images,
  status,
  featured,
}: MiniProductPreviewProps) {
  const [isHovered, setIsHovered] = useState(false);

  const validImages = images?.filter((img) => img?.url?.trim()) || [];
  const coverUrl = validImages[0]?.url || "";
  const hoverUrl = validImages[1]?.url || "";

  return (
    <div className="border border-line bg-white p-4 space-y-3">
      <div className="flex items-center justify-between pb-2 border-hairline-b">
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-ink-soft">
          Live Card Preview
        </span>
        <div className="flex items-center gap-1.5">
          {featured && (
            <span className="px-1.5 py-0.5 bg-blue-50 text-blue-500 text-[9px] uppercase tracking-wider font-medium border border-blue-100">
              Featured
            </span>
          )}
          <span
            className={`px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-medium border ${
              status === "published"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-surface text-ink-soft border-line"
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      <div
        className="relative group cursor-pointer max-w-[240px] mx-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Card Image */}
        <div className="relative aspect-[4/5] bg-surface overflow-hidden">
          <SafeImage
            src={coverUrl}
            alt={name || "Preview"}
            fill
            containerClassName="absolute inset-0"
            className={`object-cover transition-opacity duration-500 ${
              isHovered && hoverUrl ? "opacity-0" : "opacity-100"
            }`}
          />
          {hoverUrl && (
            <SafeImage
              src={hoverUrl}
              alt={`${name} alternative`}
              fill
              containerClassName="absolute inset-0"
              className={`object-cover transition-opacity duration-500 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {/* Quick view slide up label on hover */}
          <div
            className={`absolute bottom-0 inset-x-0 bg-white/95 py-2 text-center transition-transform duration-300 ${
              isHovered ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-ink font-medium">
              Quick View
            </span>
          </div>
        </div>

        {/* Card Info */}
        <div className="pt-3 space-y-1">
          <h4 className="text-xs uppercase font-medium tracking-wider text-ink truncate">
            {name || "Untitled Garment"}
          </h4>
          <div className="flex items-center gap-2 text-xs tabular-nums">
            <span className="font-medium text-ink">{formatPrice(price || 0)}</span>
            {compareAtPrice && compareAtPrice > price && (
              <span className="text-ink-soft/60 line-through text-[11px]">
                {formatPrice(compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
