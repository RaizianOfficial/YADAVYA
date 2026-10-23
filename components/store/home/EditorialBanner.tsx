"use client";

import React from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { SiteSettings } from "@/types";

interface EditorialBannerProps {
  settings?: SiteSettings["editorialBanner"];
}

export function EditorialBanner({ settings }: EditorialBannerProps) {
  if (!settings?.imageUrl) return null;

  return (
    <section className="w-full my-16 sm:my-20 md:my-28">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-12">
        <ScrollReveal duration={0.8} yOffset={24}>
          <div className="relative w-full h-[320px] sm:h-[440px] lg:h-[580px] bg-surface overflow-hidden border border-line">
            <SafeImage
              src={settings.imageUrl}
              alt={settings.title || "YADAVYA Editorial"}
              fill
              sizes="100vw"
              className="object-cover"
            />

            {/* Calm overlay text (restrained, no heavy dark gradient) */}
            <div className="absolute inset-0 bg-[#0E1A24]/20 flex flex-col justify-end p-6 sm:p-10 md:p-14 text-white">
              <div className="max-w-xl space-y-2">
                <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-white/80 block">
                  Atelier Campaign
                </span>
                {settings.title && (
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight">
                    {settings.title}
                  </h3>
                )}
                {settings.subtitle && (
                  <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal pt-1">
                    {settings.subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
