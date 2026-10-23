"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface FooterProps {
  instagramUrl?: string;
  whatsappNumber?: string;
  contactEmail?: string;
}

export function Footer({
  instagramUrl = "https://instagram.com/yadavya",
  whatsappNumber = "919876543210",
  contactEmail = "concierge@yadavya.com",
}: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-white border-hairline-t pt-14 sm:pt-20 pb-8 sm:pb-12 mt-16 sm:mt-28">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-12">
        <ScrollReveal yOffset={16}>
          {/* Top Section: Newsletter and Link Columns */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 pb-12 sm:pb-16 border-hairline-b">
            {/* Newsletter / Correspondence Column */}
            <div className="md:col-span-5 space-y-3 sm:space-y-4">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-ink-soft block font-medium">
                Correspondence
              </span>
              <p className="text-xs sm:text-sm text-ink-soft max-w-sm leading-relaxed">
                Receive private notices regarding new editions, archival pieces,
                and material inquiries.
              </p>
              {subscribed ? (
                <p className="text-xs uppercase tracking-[0.2em] text-ink font-medium pt-2">
                  Thank you. You have been added to the register.
                </p>
              ) : (
                <form onSubmit={handleSubscribe} className="pt-2 max-w-sm">
                  <div className="relative border-b border-ink focus-within:border-blue-500 transition-colors pb-2 flex items-center justify-between">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full text-xs text-ink placeholder:text-ink-soft/40 bg-transparent outline-none tracking-wide py-1"
                    />
                    <button
                      type="submit"
                      className="text-[11px] uppercase tracking-[0.2em] font-medium text-ink hover:text-blue-500 shrink-0 ml-4 transition-colors touch-manipulation py-1"
                    >
                      Subscribe
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Links Column 1: Shop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:contents gap-8">
              <div className="md:col-span-2 space-y-3 sm:space-y-4">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-ink-soft block font-medium">
                  Catalogue
                </span>
                <ul className="space-y-2.5 text-xs tracking-wider">
                  <li>
                    <Link
                      href="/shop"
                      className="text-ink hover:text-blue-500 transition-colors block py-0.5"
                    >
                      All Garments
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?filter=new"
                      className="text-ink hover:text-blue-500 transition-colors block py-0.5"
                    >
                      New Arrivals
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?filter=featured"
                      className="text-ink hover:text-blue-500 transition-colors block py-0.5"
                    >
                      Featured
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Links Column 2: Assistance */}
              <div className="md:col-span-2 space-y-3 sm:space-y-4">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-ink-soft block font-medium">
                  Assistance
                </span>
                <ul className="space-y-2.5 text-xs tracking-wider">
                  <li>
                    <Link
                      href="/shipping-returns"
                      className="text-ink hover:text-blue-500 transition-colors block py-0.5"
                    >
                      Shipping & Returns
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-ink hover:text-blue-500 transition-colors block py-0.5"
                    >
                      Concierge
                    </Link>
                  </li>
                  <li>
                    <a
                      href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        "Hello YADAVYA Concierge, I would like assistance with an inquiry."
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ink hover:text-blue-500 transition-colors inline-flex items-center gap-1.5 py-0.5"
                    >
                      WhatsApp
                      <Icon name="arrowUpRight" size={12} />
                    </a>
                  </li>
                </ul>
              </div>

              {/* Links Column 3: Atelier */}
              <div className="col-span-2 sm:col-span-1 md:col-span-3 space-y-3 sm:space-y-4">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-ink-soft block font-medium">
                  Atelier
                </span>
                <ul className="space-y-2.5 text-xs tracking-wider">
                  <li>
                    <Link
                      href="/about"
                      className="text-ink hover:text-blue-500 transition-colors block py-0.5"
                    >
                      The Philosophy
                    </Link>
                  </li>
                  <li>
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ink hover:text-blue-500 transition-colors inline-flex items-center gap-1.5 py-0.5"
                    >
                      <Icon name="instagram" size={13} />
                      Instagram
                      <Icon name="arrowUpRight" size={12} />
                    </a>
                  </li>
                  <li className="pt-1 text-[11px] text-ink-soft leading-relaxed break-all">
                    {contactEmail}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Large Typographic Wordmark & Bottom Bar */}
          <div className="pt-10 sm:pt-16 pb-4">
            <div className="text-center overflow-hidden py-2 sm:py-4 select-none">
              <span className="text-3xl sm:text-6xl md:text-8xl lg:text-9xl font-medium tracking-[0.25em] sm:tracking-[0.3em] text-ink/15 uppercase inline-block pl-[0.25em] sm:pl-[0.3em]">
                YADAVYA
              </span>
            </div>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between text-[9px] sm:text-[11px] text-ink-soft/70 tracking-widest uppercase gap-3 text-center sm:text-left">
              <span>© {new Date().getFullYear()} YADAVYA. ALL RIGHTS RESERVED.</span>
              <span>DEMO STOREFRONT • CALM FORM & PROPORTION</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}
