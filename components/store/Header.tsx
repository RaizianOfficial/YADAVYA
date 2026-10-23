"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { Icon } from "@/components/ui/Icon";
import { SearchOverlay } from "./SearchOverlay";
import { BagDrawer } from "./BagDrawer";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openCart, getItemCount } = useCartStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = mounted ? getItemCount() : 0;
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const diff = latest - lastScrollY.current;

    // Detect scrolled past hero threshold
    if (latest > 40) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }

    // Hide header on scroll down, show on scroll up
    if (latest > 120 && diff > 8) {
      setHidden(true);
    } else if (diff < -6 || latest <= 120) {
      setHidden(false);
    }

    lastScrollY.current = latest;
  });

  return (
    <>
      <motion.header
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={`sticky top-0 z-40 w-full transition-colors duration-400 ${
          scrolled || !isHome
            ? "bg-white/95 backdrop-blur-none border-hairline-b"
            : "bg-white/80 backdrop-blur-none border-b border-transparent"
        }`}
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-12 h-16 sm:h-20 flex items-center justify-between">
          {/* Left: Mobile Menu Trigger / Desktop Nav Links */}
          <div className="flex items-center gap-6 sm:gap-8 flex-1">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden flex items-center gap-1.5 text-ink hover:text-ink-soft py-2 px-1 -ml-1 touch-manipulation min-h-[44px]"
              aria-label="Open navigation menu"
            >
              <Icon name="menu" size={19} />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-medium">
                Menu
              </span>
            </button>

            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/shop"
                className="text-[11px] uppercase tracking-[0.22em] font-medium text-ink hover:text-blue-500 transition-colors"
              >
                Shop
              </Link>
              <Link
                href="/shop?filter=new"
                className="text-[11px] uppercase tracking-[0.22em] font-medium text-ink hover:text-blue-500 transition-colors"
              >
                New
              </Link>
              <Link
                href="/about"
                className="text-[11px] uppercase tracking-[0.22em] font-medium text-ink hover:text-blue-500 transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-[11px] uppercase tracking-[0.22em] font-medium text-ink hover:text-blue-500 transition-colors"
              >
                Concierge
              </Link>
            </nav>
          </div>

          {/* Center: Wordmark (Pure Typographic, no icon, wide tracking) */}
          <div className="flex-none text-center">
            <Link
              href="/"
              className="text-lg sm:text-xl md:text-2xl font-medium tracking-[0.28em] sm:tracking-[0.32em] text-ink uppercase inline-block hover:opacity-85 transition-opacity pl-[0.28em] sm:pl-[0.32em]"
            >
              YADAVYA
            </Link>
          </div>

          {/* Right: Search + Bag */}
          <div className="flex items-center justify-end gap-3 sm:gap-6 flex-1">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-1.5 text-ink hover:text-ink-soft transition-colors py-2 px-1 touch-manipulation min-h-[44px]"
              aria-label="Search garments"
            >
              <Icon name="search" size={18} />
              <span className="hidden sm:inline text-[11px] uppercase tracking-[0.2em] font-medium">
                Search
              </span>
            </button>

            <button
              onClick={openCart}
              className="flex items-center gap-1.5 text-ink hover:text-ink-soft transition-colors py-2 px-1 -mr-1 touch-manipulation min-h-[44px]"
              aria-label={`Shopping bag containing ${itemCount} items`}
            >
              <Icon name="bag" size={18} />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-medium tabular-nums">
                <span className="hidden xs:inline">Bag </span>({itemCount})
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Global Overlays */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <BagDrawer />
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
