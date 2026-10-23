"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/ui/Icon";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const links = [
    { label: "Shop All", href: "/shop" },
    { label: "New Arrivals", href: "/shop?filter=new" },
    { label: "About YADAVYA", href: "/about" },
    { label: "Shipping & Returns", href: "/shipping-returns" },
    { label: "Concierge / Contact", href: "/contact" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#0E1A24]/30 backdrop-blur-none"
            aria-hidden="true"
          />

          {/* Menu Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm z-50 bg-white flex flex-col border-hairline-r shadow-none"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
          >
            <div className="p-6 border-hairline-b flex items-center justify-between">
              <span className="text-[11px] font-medium tracking-[0.25em] text-ink uppercase">
                Navigation
              </span>
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-ink hover:text-ink-soft"
                aria-label="Close menu"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <nav className="flex-1 px-8 py-10 space-y-6">
              {links.map((link) => (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="block text-lg tracking-tight font-medium text-ink hover:text-blue-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
            </nav>

            <div className="p-8 border-hairline-t bg-surface/40 space-y-3">
              <span className="block text-[10px] uppercase tracking-[0.25em] text-ink-soft">
                YADAVYA Private Atelier
              </span>
              <p className="text-xs text-ink-soft/80 leading-relaxed">
                Quiet luxury garments crafted with architectural precision and restraint.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
