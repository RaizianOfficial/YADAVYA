import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Atelier & Philosophy",
  description: "An intentional study in silhouette, raw material, and calm discipline by YADAVYA.",
};

export default function AboutPage() {
  return (
    <div className="max-w-[1080px] mx-auto px-6 md:px-12 py-16 md:py-28 space-y-16">
      {/* Header */}
      <div className="space-y-4 pb-8 border-hairline-b">
        <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-ink-soft block">
          The Atelier
        </span>
        <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-ink">
          Quiet Form. Measured Presence.
        </h1>
      </div>

      {/* Main Philosophy Copy */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 text-sm md:text-base leading-relaxed text-ink-soft">
        <div className="md:col-span-5 space-y-4">
          <p className="text-ink font-medium text-lg leading-snug">
            YADAVYA was conceived as an antidote to decorative excess and seasonal obsolescence.
          </p>
          <p>
            We view clothing not as dynamic novelty, but as personal architecture—a calm, tactile layer that frames human presence with quiet confidence.
          </p>
        </div>

        <div className="md:col-span-7 space-y-6">
          <p>
            Every silhouette begins with raw, unadorned material: unbleached organic flax linen, high-twist tropical virgin wools, hand-spun textured raw silks, and dense long-staple cotton jerseys. We honor the inherent nature of each fiber, allowing natural drape and structure to dictate cut rather than applied embellishment.
          </p>
          <p>
            Our garments are produced in disciplined, numbered editions. Proportions are calibrated for longevity—generous shoulders, clean vertical lines, and discreet closures that disappear into the seam architecture.
          </p>
          <div className="pt-6 border-hairline-t">
            <span className="text-[10px] uppercase tracking-[0.25em] font-medium text-ink block mb-2">
              The Principles
            </span>
            <ul className="space-y-2 text-xs tracking-wide">
              <li>• Restraint over decoration.</li>
              <li>• Honesty of unadorned material.</li>
              <li>• Architectural balance in proportion.</li>
              <li>• Quiet luxury made to endure.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
