"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/formatters";
import { createOrder, getSiteSettings } from "@/lib/firestore";
import { checkoutSchema } from "@/lib/validators";
import { SafeImage } from "@/components/ui/SafeImage";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { SiteSettings } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const subtotal = getSubtotal();

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const country = "India";
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "WHATSAPP">("COD");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function load() {
      try {
        const s = await getSiteSettings();
        setSettings(s);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  if (!mounted) {
    return (
      <div className="py-24 text-center">
        <span className="text-xs uppercase tracking-[0.25em] text-ink-soft animate-pulse">
          Preparing checkout...
        </span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center space-y-6">
        <h1 className="text-xl sm:text-2xl font-medium tracking-tight text-ink">
          Your shopping bag is empty
        </h1>
        <p className="text-xs text-ink-soft max-w-sm mx-auto leading-relaxed">
          Select pieces from our current editions to proceed with private checkout.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center px-8 py-3.5 bg-ink text-white text-xs uppercase tracking-[0.25em] font-medium hover:bg-ink/90 transition-colors touch-manipulation"
        >
          Explore Catalogue
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const formData = {
      fullName,
      email,
      phone,
      street,
      apartment,
      city,
      state,
      postalCode,
      country,
      paymentMethod,
    };

    const result = checkoutSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      window.scrollTo({ top: 80, behavior: "smooth" });
      return;
    }

    setSubmitting(true);

    try {
      // 1. Create order in Firestore
      const orderData = {
        items,
        customer: {
          fullName,
          email,
          phone,
        },
        address: {
          street,
          apartment,
          city,
          state,
          postalCode,
          country,
        },
        subtotal,
        shippingFee: 0,
        total: subtotal,
        paymentMethod,
        status: "New" as const,
      };

      const createdOrder = await createOrder(orderData);

      // 2. Clear bag
      clearCart();

      // 3. Handle WhatsApp confirmation if selected
      if (paymentMethod === "WHATSAPP") {
        const targetNumber = (
          settings?.whatsappNumber || "919876543210"
        ).replace(/[^0-9]/g, "");

        const itemsList = items
          .map((i) => `• ${i.name} (Size: ${i.size}) x${i.quantity} - ${formatPrice(i.price * i.quantity)}`)
          .join("\n");

        const msg = `*NEW ORDER - YADAVYA*\nOrder Ref: *${createdOrder.orderNumber}*\n\nCustomer: ${fullName}\nPhone: ${phone}\nAddress: ${street}, ${city}, ${state} ${postalCode}\n\n*Ordered Pieces:*\n${itemsList}\n\n*Total Payable:* ${formatPrice(subtotal)}\nMethod: WhatsApp Confirmation\n\nKindly confirm my order dispatch. Thank you.`;

        const waUrl = `https://wa.me/${targetNumber}?text=${encodeURIComponent(msg)}`;
        window.open(waUrl, "_blank");
      }

      // 4. Navigate to order confirmation
      router.push(`/checkout/confirmation?orderId=${createdOrder.id}`);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Failed to process order. Please try again.";
      setErrors({ form: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-12 md:py-20">
      <ScrollReveal yOffset={14}>
        <div className="pb-6 sm:pb-8 border-hairline-b mb-6 sm:mb-10">
          <span className="text-[10px] uppercase tracking-[0.28em] font-medium text-ink-soft block">
            Private Checkout
          </span>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink mt-1">
            Finalize Your Order
          </h1>
        </div>
      </ScrollReveal>

      {errors.form && (
        <div className="p-3.5 bg-red-50 text-red-700 text-xs border border-red-200 mb-6">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Form: Client Details & Shipping Address */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8">
          {/* Section 1: Contact Information */}
          <div className="bg-white border border-line p-5 sm:p-8 space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] font-medium text-ink block pb-2 border-hairline-b">
              1. Contact Information
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <div className="space-y-1 sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-ink-soft">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Aarav Sharma"
                  className="w-full px-3 py-2.5 text-xs bg-white border border-line focus:border-ink outline-none"
                />
                {errors.fullName && (
                  <p className="text-[11px] text-red-600">{errors.fullName}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider text-ink-soft">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aarav@domain.com"
                  className="w-full px-3 py-2.5 text-xs bg-white border border-line focus:border-ink outline-none"
                />
                {errors.email && (
                  <p className="text-[11px] text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider text-ink-soft">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full px-3 py-2.5 text-xs bg-white border border-line focus:border-ink outline-none font-mono"
                />
                {errors.phone && (
                  <p className="text-[11px] text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Shipping Destination */}
          <div className="bg-white border border-line p-5 sm:p-8 space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] font-medium text-ink block pb-2 border-hairline-b">
              2. Shipping Destination
            </span>

            <div className="space-y-3.5 sm:space-y-4">
              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider text-ink-soft">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="House 42, Civil Lines"
                  className="w-full px-3 py-2.5 text-xs bg-white border border-line focus:border-ink outline-none"
                />
                {errors.street && (
                  <p className="text-[11px] text-red-600">{errors.street}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider text-ink-soft">
                  Apartment, Suite, Unit (Optional)
                </label>
                <input
                  type="text"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  placeholder="Floor 3, Apt 12B"
                  className="w-full px-3 py-2.5 text-xs bg-white border border-line focus:border-ink outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
                <div className="space-y-1">
                  <label className="block text-xs uppercase tracking-wider text-ink-soft">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="New Delhi"
                    className="w-full px-3 py-2.5 text-xs bg-white border border-line focus:border-ink outline-none"
                  />
                  {errors.city && (
                    <p className="text-[11px] text-red-600">{errors.city}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs uppercase tracking-wider text-ink-soft">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Delhi"
                    className="w-full px-3 py-2.5 text-xs bg-white border border-line focus:border-ink outline-none"
                  />
                  {errors.state && (
                    <p className="text-[11px] text-red-600">{errors.state}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs uppercase tracking-wider text-ink-soft">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="110001"
                    className="w-full px-3 py-2.5 text-xs bg-white border border-line focus:border-ink outline-none font-mono"
                  />
                  {errors.postalCode && (
                    <p className="text-[11px] text-red-600">{errors.postalCode}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Payment & Confirmation Method */}
          <div className="bg-white border border-line p-5 sm:p-8 space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] font-medium text-ink block pb-2 border-hairline-b">
              3. Payment & Confirmation Method
            </span>

            <div className="space-y-3">
              <label
                className={`flex items-start gap-3 p-3.5 sm:p-4 border cursor-pointer transition-colors touch-manipulation ${
                  paymentMethod === "COD"
                    ? "border-ink bg-surface/40"
                    : "border-line bg-white hover:border-ink/40"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="mt-0.5 accent-ink"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-medium text-ink uppercase tracking-wider block">
                    Cash on Delivery (COD)
                  </span>
                  <p className="text-[11px] text-ink-soft leading-relaxed">
                    Pay securely in cash or via UPI at the time of delivery at your doorstep.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3.5 sm:p-4 border cursor-pointer transition-colors touch-manipulation ${
                  paymentMethod === "WHATSAPP"
                    ? "border-ink bg-surface/40"
                    : "border-line bg-white hover:border-ink/40"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="WHATSAPP"
                  checked={paymentMethod === "WHATSAPP"}
                  onChange={() => setPaymentMethod("WHATSAPP")}
                  className="mt-0.5 accent-ink"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-medium text-ink uppercase tracking-wider block">
                    Confirm via WhatsApp Concierge
                  </span>
                  <p className="text-[11px] text-ink-soft leading-relaxed">
                    Saves your order and opens WhatsApp with your pre-filled order summary for immediate concierge confirmation.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Summary Column */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-line p-5 sm:p-8 space-y-5 sm:space-y-6 lg:sticky lg:top-28">
            <span className="text-xs uppercase tracking-[0.2em] font-medium text-ink block pb-2 border-hairline-b">
              Order Summary ({items.length})
            </span>

            {/* Bag items list */}
            <div className="divide-y divide-line max-h-72 sm:max-h-80 overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}-${item.color || ""}`}
                  className="py-3 flex gap-3 first:pt-0 last:pb-0"
                >
                  <div className="w-14 h-16 bg-surface relative overflow-hidden border border-line shrink-0">
                    <SafeImage
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-medium text-ink uppercase tracking-wider truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-ink-soft">
                        Size: {item.size} {item.color ? `• ${item.color}` : ""}
                      </p>
                    </div>
                    <div className="flex justify-between items-center text-xs tabular-nums">
                      <span className="text-ink-soft">Qty: {item.quantity}</span>
                      <span className="font-medium text-ink">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div className="space-y-2 pt-4 border-hairline-t text-xs">
              <div className="flex justify-between text-ink-soft">
                <span>Subtotal</span>
                <span className="font-medium tabular-nums text-ink">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>Shipping</span>
                <span className="text-blue-500 font-medium uppercase text-[11px]">
                  Complimentary
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-hairline-t text-sm font-medium text-ink">
                <span>Total Payable</span>
                <span className="tabular-nums text-base">
                  {formatPrice(subtotal)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-ink text-white text-xs uppercase tracking-[0.25em] font-medium hover:bg-ink/90 transition-colors disabled:opacity-50 touch-manipulation"
            >
              {submitting
                ? "Recording Order..."
                : paymentMethod === "WHATSAPP"
                ? "Confirm via WhatsApp"
                : "Place Order (COD)"}
            </button>

            <p className="text-[10px] text-center text-ink-soft leading-relaxed tracking-wide">
              By placing this order you acknowledge that YADAVYA operates as a private atelier with dedicated dispatch.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
