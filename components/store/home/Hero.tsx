"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SafeImage } from "@/components/ui/SafeImage";
import { Icon } from "@/components/ui/Icon";
import type { SiteSettings } from "@/types";

interface HeroProps {
  settings?: SiteSettings["hero"];
}

export function Hero({ settings }: HeroProps) {
  const headline = settings?.headline || "Quiet form. Measured presence.";
  const subtext =
    settings?.subtext || "An intentional study in silhouette and raw proportion.";
  const ctaLabel = settings?.ctaLabel || "Shop the collection";
  const imageUrl = settings?.imageUrl;

  const headlineLines = headline.split(".").filter(Boolean);

  return (
    <section className="relative w-full min-h-[78vh] sm:min-h-[85vh] lg:min-h-[92vh] flex flex-col justify-between pt-4 sm:pt-8 pb-8 sm:pb-12 px-4 sm:px-6 md:px-12 max-w-[1360px] mx-auto overflow-hidden">
      {/* Editorial Asymmetric Layout (12 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center flex-1 my-auto py-4">
        {/* Left Editorial Copy (7 cols) */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-medium text-ink-soft block mb-2 sm:mb-3">
              YADAVYA Edition 01
            </span>
          </motion.div>

          {/* Headline with masked line reveal */}
          <div className="space-y-1">
            {headlineLines.map((line, idx) => (
              <div key={idx} className="overflow-hidden">
                <motion.h1
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.15 + idx * 0.15,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-[-0.03em] text-ink leading-[1.1]"
                >
                  {line.trim()}.
                </motion.h1>
              </div>
            ))}
          </div>

          {/* Subtext and CTA */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6 sm:space-y-8 max-w-lg pt-1 sm:pt-2"
          >
            <p className="text-sm sm:text-base md:text-lg text-ink-soft font-normal leading-relaxed">
              {subtext}
            </p>

            <div>
              <Link
                href="/shop"
                className="group inline-flex items-center gap-3 text-xs uppercase tracking-[0.25em] font-medium text-ink relative py-2 touch-manipulation"
              >
                <span>{ctaLabel}</span>
                <Icon
                  name="arrowRight"
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-ink transform scale-x-100 group-hover:scale-x-0 transition-transform duration-300 origin-right" />
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right Hero Visual / Fallback Typography Panel (5 cols) */}
        <div className="lg:col-span-5 relative w-full h-[360px] sm:h-[480px] lg:h-[620px]">
          {imageUrl ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full relative overflow-hidden bg-surface border border-line"
            >
              <SafeImage
                src={imageUrl}
                alt="YADAVYA Editorial Campaign"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full bg-surface border border-line p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="space-y-1 sm:space-y-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-ink-soft block">
                  Studio Archive
                </span>
                <span className="text-xs sm:text-sm text-ink-soft font-normal">
                  Refined Silhouettes • Unbleached Fibers
                </span>
              </div>
              <div className="select-none py-6">
                <span className="text-5xl sm:text-7xl font-medium tracking-[0.25em] text-ink/10 uppercase block pl-[0.25em]">
                  YADAVYA
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom Scroll Indicator in text form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="pt-4 sm:pt-6 border-hairline-t flex items-center justify-between text-[9px] sm:text-[10px] uppercase tracking-[0.22em] sm:tracking-[0.25em] text-ink-soft"
      >
        <span>Edition 2026</span>
        <span className="animate-pulse">[ Scroll ↓ ]</span>
        <span className="hidden xs:inline">Made with Restraint</span>
      </motion.div>
    </section>
  );
}
