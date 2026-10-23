import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-ink-soft block">
          Notice 404
        </span>
        <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-ink">
          Page Not Found
        </h1>
      </div>

      <p className="text-xs sm:text-sm text-ink-soft max-w-sm leading-relaxed">
        The garment, collection, or destination you are seeking cannot be located in the current register.
      </p>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-ink text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-ink/90 transition-colors"
        >
          Return Home
        </Link>
        <Link
          href="/shop"
          className="px-6 py-3 border border-ink text-xs uppercase tracking-[0.2em] font-medium text-ink hover:bg-surface transition-colors"
        >
          Explore Catalogue
        </Link>
      </div>
    </div>
  );
}
