"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { Icon } from "@/components/ui/Icon";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatPrice, slugify } from "@/lib/formatters";

export function BagDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getSubtotal,
    getItemCount,
  } = useCartStore();

  const subtotal = getSubtotal();
  const itemCount = getItemCount();

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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-[#0E1A24]/30 backdrop-blur-none"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md z-50 bg-white flex flex-col border-hairline-l shadow-none"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping Bag"
          >
            {/* Header */}
            <div className="p-6 border-hairline-b flex items-center justify-between">
              <div>
                <h3 className="text-xs uppercase font-medium tracking-[0.25em] text-ink">
                  Shopping Bag
                </h3>
                <span className="text-[11px] text-ink-soft tracking-wider">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-2 -mr-2 text-ink hover:text-ink-soft transition-colors"
                aria-label="Close bag"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <p className="text-sm text-ink-soft mb-6 tracking-wide">
                    Your bag is currently empty.
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="inline-flex items-center justify-center px-6 py-3 border border-ink text-xs uppercase tracking-[0.2em] font-medium text-ink hover:bg-ink hover:text-white transition-colors"
                  >
                    Explore Catalogue
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-line">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.size}-${item.color || ""}`}
                      className="py-4 flex gap-4 first:pt-0 last:pb-0"
                    >
                      <div className="w-20 h-24 shrink-0 bg-surface relative">
                        <SafeImage
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <Link
                              href={`/product/${item.slug ? slugify(item.slug) : item.productId}`}
                              onClick={closeCart}
                              className="text-xs uppercase font-medium text-ink hover:text-blue-500 transition-colors tracking-wider"
                            >
                              {item.name}
                            </Link>
                            <button
                              onClick={() =>
                                removeItem(item.productId, item.size, item.color)
                              }
                              className="text-ink-soft hover:text-ink p-1 -mr-1"
                              aria-label="Remove item"
                            >
                              <Icon name="trash" size={14} />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-ink-soft">
                            <span>Size: {item.size}</span>
                            {item.color && (
                              <>
                                <span>•</span>
                                <span>{item.color}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity selector */}
                          <div className="flex items-center border border-line">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.size,
                                  item.quantity - 1,
                                  item.color
                                )
                              }
                              className="p-1.5 text-ink hover:bg-surface transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Icon name="minus" size={12} />
                            </button>
                            <span className="px-3 text-xs tabular-nums text-ink font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.size,
                                  item.quantity + 1,
                                  item.color
                                )
                              }
                              className="p-1.5 text-ink hover:bg-surface transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Icon name="plus" size={12} />
                            </button>
                          </div>

                          <span className="text-xs font-medium text-ink tabular-nums">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-hairline-t bg-white space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs tracking-wider text-ink-soft">
                    <span>Subtotal</span>
                    <span className="text-ink font-medium tabular-nums text-sm">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-ink-soft">
                    <span>Shipping</span>
                    <span className="text-blue-500 font-medium uppercase tracking-wider">
                      Complimentary
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center py-4 bg-ink text-white text-xs uppercase tracking-[0.25em] font-medium hover:bg-ink/90 transition-colors"
                >
                  Proceed to Checkout
                </Link>
                <p className="text-[10px] text-center text-ink-soft/80 tracking-wide">
                  Taxes included. Cash on Delivery & WhatsApp confirmation.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
