"use client";

import React, { useState } from "react";
import Image, { type ImageProps } from "next/image";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackText?: string;
  aspectRatioClass?: string;
}

export function SafeImage({
  src,
  alt = "YADAVYA",
  className = "",
  fallbackText = "YADAVYA",
  aspectRatioClass = "aspect-[4/5]",
  fill,
  priority,
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // If no source or error occurred, render calm quiet luxury placeholder
  if (!src || error) {
    return (
      <div
        className={`w-full ${fill ? "h-full" : aspectRatioClass} bg-surface flex flex-col items-center justify-center p-4 select-none relative overflow-hidden`}
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
        fill ? "w-full h-full" : aspectRatioClass
      }`}
    >
      <Image
        src={src}
        alt={alt}
        fill={fill}
        priority={priority}
        className={`transition-opacity duration-500 object-cover ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        {...props}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-surface flex items-center justify-center">
          <span className="text-[9px] uppercase font-medium tracking-[0.3em] text-ink-soft/30 animate-pulse">
            YADAVYA
          </span>
        </div>
      )}
    </div>
  );
}
