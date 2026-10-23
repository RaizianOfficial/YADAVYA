import React from "react";
import { getSiteSettings } from "@/lib/firestore";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Returns Policy",
  description: "Complimentary nationwide shipping policy and straightforward return terms for YADAVYA garments.",
};

export default async function ShippingReturnsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-[1080px] mx-auto px-6 md:px-12 py-16 md:py-28 space-y-16">
      {/* Header */}
      <div className="space-y-4 pb-8 border-hairline-b">
        <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-ink-soft block">
          Client Assurance
        </span>
        <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-ink">
          Shipping & Returns
        </h1>
        <p className="text-xs sm:text-sm text-ink-soft max-w-xl leading-relaxed">
          {settings.shippingNote}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-xs sm:text-sm text-ink-soft leading-relaxed">
        {/* Shipping */}
        <div className="space-y-6">
          <span className="text-xs uppercase tracking-[0.2em] font-medium text-ink block pb-2 border-hairline-b">
            Domestic & Regional Shipping
          </span>
          <div className="space-y-4">
            <h4 className="font-medium text-ink text-sm">Complimentary Delivery</h4>
            <p>
              We provide complimentary insured courier shipping on every order across all pin codes in India.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-ink text-sm">Preparation & Timelines</h4>
            <p>
              Garments are carefully inspected, pressed, and wrapped in acid-free unbleached tissue prior to dispatch. Orders are dispatched from our New Delhi atelier within 24 to 48 hours. Standard transit time is 3 to 5 business days.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-ink text-sm">Discreet Packaging</h4>
            <p>
              All shipments arrive in unbranded, recyclable rigid cardboard envelopes or boxes with sealed paper security tape.
            </p>
          </div>
        </div>

        {/* Returns */}
        <div className="space-y-6">
          <span className="text-xs uppercase tracking-[0.2em] font-medium text-ink block pb-2 border-hairline-b">
            Returns & Exchange Protocol
          </span>
          <div className="space-y-4">
            <h4 className="font-medium text-ink text-sm">7-Day Return Window</h4>
            <p>
              If a piece does not suit your proportions or expectations, we accept returns within 7 calendar days from the recorded delivery date.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-ink text-sm">Condition Requirements</h4>
            <p>
              Garments must remain in their original unworn, unwashed, and undamaged condition, with all fabric tags and security seals attached. Pieces showing signs of wear or perfume will be returned to the client.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-ink text-sm">Initiating a Return</h4>
            <p>
              Simply message our WhatsApp concierge with your order reference number, and we will arrange a reverse pickup at no additional expense.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
