import React from "react";
import { getSiteSettings } from "@/lib/firestore";
import { Icon } from "@/components/ui/Icon";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Concierge & Inquiries",
  description: "Connect with the YADAVYA concierge for sizing guidance, fabric samples, and private consultations.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, "");

  return (
    <div className="max-w-[1080px] mx-auto px-6 md:px-12 py-16 md:py-28 space-y-16">
      {/* Header */}
      <div className="space-y-4 pb-8 border-hairline-b">
        <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-ink-soft block">
          Client Services
        </span>
        <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-ink">
          Concierge Inquiries
        </h1>
        <p className="text-xs sm:text-sm text-ink-soft max-w-xl leading-relaxed">
          Our private atelier team is available to assist with silhouette sizing, material advice, and order inquiries.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 bg-surface/50 border border-line space-y-4">
          <span className="text-[10px] uppercase tracking-[0.25em] font-medium text-ink-soft block">
            Direct Messaging
          </span>
          <h3 className="text-base font-medium text-ink">WhatsApp Concierge</h3>
          <p className="text-xs text-ink-soft leading-relaxed">
            Real-time correspondence with our atelier client concierge for quick sizing, delivery, and styling inquiries.
          </p>
          <a
            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              "Hello YADAVYA Concierge, I would like to inquire about a garment."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-medium text-ink hover:text-blue-500 pt-2"
          >
            <span>Initiate Chat</span>
            <Icon name="arrowUpRight" size={13} />
          </a>
        </div>

        <div className="p-8 bg-surface/50 border border-line space-y-4">
          <span className="text-[10px] uppercase tracking-[0.25em] font-medium text-ink-soft block">
            Written Correspondence
          </span>
          <h3 className="text-base font-medium text-ink">Electronic Mail</h3>
          <p className="text-xs text-ink-soft leading-relaxed">
            For bespoke inquiries, press, and archival acquisition requests:
          </p>
          <a
            href={`mailto:${settings.contactEmail}`}
            className="inline-block text-xs font-mono text-ink hover:text-blue-500 pt-2 underline underline-offset-4"
          >
            {settings.contactEmail}
          </a>
        </div>

        <div className="p-8 bg-surface/50 border border-line space-y-4">
          <span className="text-[10px] uppercase tracking-[0.25em] font-medium text-ink-soft block">
            Atelier Hours
          </span>
          <h3 className="text-base font-medium text-ink">Private Schedule</h3>
          <p className="text-xs text-ink-soft leading-relaxed">
            Monday through Saturday
            <br />
            10:00 — 19:00 IST
          </p>
          <p className="text-[11px] text-ink-soft/70 pt-2">
            Dispatches operate weekdays from New Delhi.
          </p>
        </div>
      </div>
    </div>
  );
}
