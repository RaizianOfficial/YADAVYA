"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getOrderById } from "@/lib/firestore";
import { formatPrice, formatDate } from "@/lib/formatters";
import { SafeImage } from "@/components/ui/SafeImage";
import type { Order } from "@/types";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!orderId) {
        setLoading(false);
        return;
      }
      try {
        const ord = await getOrderById(orderId);
        setOrder(ord);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [orderId]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <span className="text-xs uppercase tracking-[0.25em] text-ink-soft animate-pulse">
          Loading order verification...
        </span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-[700px] mx-auto px-6 py-28 text-center space-y-4">
        <h1 className="text-2xl font-medium tracking-tight text-ink">
          Order Confirmation
        </h1>
        <p className="text-xs text-ink-soft">
          Thank you for your order. If you need assistance, please contact the concierge.
        </p>
        <Link
          href="/shop"
          className="inline-block mt-4 px-6 py-3 bg-ink text-white text-xs uppercase tracking-widest"
        >
          Return to Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto px-6 md:px-12 py-16 md:py-24 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 pb-8 border-hairline-b">
        <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-ink-soft block">
          Order Registered
        </span>
        <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-ink">
          Thank You, {order.customer?.fullName?.split(" ")[0]}
        </h1>
        <p className="text-xs text-ink-soft max-w-md mx-auto leading-relaxed">
          Your order has been recorded into our private dispatch queue. A confirmation email has been dispatched to{" "}
          <span className="text-ink font-medium">{order.customer?.email}</span>.
        </p>
      </div>

      {/* Order Info Card */}
      <div className="bg-white border border-line p-6 md:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-hairline-b">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-ink-soft block">
              Reference Identifier
            </span>
            <span className="text-sm font-mono font-medium text-ink mt-0.5 block">
              {order.orderNumber}
            </span>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-ink-soft block">
              Date Placed
            </span>
            <span className="text-xs text-ink mt-0.5 block">
              {formatDate(order.createdAt)}
            </span>
          </div>
        </div>

        {/* Ordered Items */}
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-[0.2em] font-medium text-ink block pb-1 border-hairline-b">
            Garments in Shipment ({order.items?.length})
          </span>

          <div className="divide-y divide-line">
            {order.items?.map((item, idx) => (
              <div key={idx} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                <div className="w-16 h-20 bg-surface relative overflow-hidden border border-line shrink-0">
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
        </div>

        {/* Summary Breakdown */}
        <div className="pt-6 border-hairline-t flex flex-col sm:flex-row justify-between gap-8 text-xs">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-ink-soft block">
              Delivery Destination
            </span>
            <p className="text-ink font-medium">{order.customer?.fullName}</p>
            <p className="text-ink-soft">{order.address?.street}</p>
            {order.address?.apartment && (
              <p className="text-ink-soft">{order.address?.apartment}</p>
            )}
            <p className="text-ink-soft">
              {order.address?.city}, {order.address?.state}{" "}
              {order.address?.postalCode}
            </p>
            <p className="text-ink-soft">{order.address?.country}</p>
          </div>

          <div className="space-y-2 sm:text-right">
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-ink-soft block">
              Payment & Total
            </span>
            <p className="text-ink">
              Method:{" "}
              <span className="font-medium font-mono uppercase">
                {order.paymentMethod === "COD"
                  ? "Cash on Delivery"
                  : "WhatsApp Confirmation"}
              </span>
            </p>
            <p className="text-ink-soft">
              Shipping:{" "}
              <span className="text-blue-500 font-medium uppercase text-[11px]">
                Complimentary
              </span>
            </p>
            <p className="text-sm font-medium text-ink pt-1 tabular-nums">
              Total Amount: {formatPrice(order.total)}
            </p>
          </div>
        </div>
      </div>

      {/* Concierge & Next Steps */}
      <div className="text-center space-y-4 pt-4">
        <Link
          href="/shop"
          className="inline-flex items-center justify-center px-8 py-3.5 bg-ink text-white text-xs uppercase tracking-[0.25em] font-medium hover:bg-ink/90 transition-colors"
        >
          Continue Exploring Catalogue
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-ink-soft animate-pulse">
            Loading order details...
          </span>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
