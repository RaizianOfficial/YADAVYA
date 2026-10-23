"use client";

import React, { useState, useEffect } from "react";
import Image, { type ImageProps } from "next/image";
import { normalizeImageUrl } from "@/lib/formatters";

interface SafeImageProps extends Omit<ImageProps, "onError" | "src"> {
  src?: string | null;
  fallbackText?: string;
  aspectRatioClass?: string;
  containerClassName?: string;
}

export function SafeImage({
  src,
  alt = "YADAVYA",
  className = "",
  containerClassName = "",
  fallbackText = "YADAVYA",
  aspectRatioClass = "aspect-[4/5]",
  fill,
  priority,
  unoptimized = true,
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const cleanUrl = typeof src === "string" ? normalizeImageUrl(src) : "";

  // Reset error and load state when src changes
  useEffect(() => {
    setError(false);
    setIsLoaded(false);
  }, [cleanUrl]);

  // If no source or error occurred, render calm quiet luxury placeholder
  if (!cleanUrl || error) {
    return (
      <div
        className={`${
          fill ? "w-full h-full" : `w-full ${aspectRatioClass}`
        } bg-surface flex flex-col items-center justify-center p-4 select-none relative overflow-hidden ${containerClassName}`}
        aria-label={alt}
      >
        <span className="text-[10px] uppercase font-medium tracking-[0.25em] text-ink-soft/40">
          {fallbackText}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-surface ${
        fill ? "w-full h-full" : `w-full ${aspectRatioClass}`
      } ${containerClassName}`}
    >
      <Image
        src={cleanUrl}
        alt={alt}
        fill={fill}
        priority={priority}
        unoptimized={unoptimized}
        referrerPolicy="no-referrer"
        className={`transition-opacity duration-500 object-cover ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        {...props}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-surface flex items-center justify-center pointer-events-none">
          <span className="text-[9px] uppercase font-medium tracking-[0.3em] text-ink-soft/30 animate-pulse">
            YADAVYA
          </span>
        </div>
      )}
    </div>
  );
}

