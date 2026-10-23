"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getOrderById, updateOrderStatus } from "@/lib/firestore";
import { formatPrice, formatDate } from "@/lib/formatters";
import { Icon } from "@/components/ui/Icon";
import { SafeImage } from "@/components/ui/SafeImage";
import type { Order, OrderStatus } from "@/types";

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const item = await getOrderById(id);
        if (item) {
          setOrder(item);
        } else {
          router.replace("/mysystem02/orders");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order) return;
    setUpdating(true);
    try {
      await updateOrderStatus(order.id, newStatus);
      setOrder({ ...order, status: newStatus });
    } catch (e) {
      console.error(e);
      alert("Failed to update order status.");
    } finally {
      setUpdating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <span className="text-xs uppercase tracking-[0.25em] text-ink-soft animate-pulse">
          Loading order details...
        </span>
      </div>
    );
  }

  if (!order) return null;

  const cleanPhone = order.customer?.phone?.replace(/[^0-9]/g, "") || "";
  const whatsappMessage = encodeURIComponent(
    `Hello ${order.customer?.fullName}, this is YADAVYA Concierge regarding your order ${order.orderNumber}. We are pleased to confirm your order details and delivery schedule.`
  );

  return (
    <div className="space-y-8">
      {/* Navigation and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-hairline-b print:hidden">
        <div className="flex items-center gap-2 text-xs text-ink-soft">
          <Link
            href="/mysystem02/orders"
            className="hover:text-ink transition-colors"
          >
            Orders
          </Link>
          <span>/</span>
          <span className="text-ink font-mono">{order.orderNumber}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-surface text-ink text-xs uppercase tracking-wider border border-line hover:bg-white transition-colors"
          >
            <span>Print Invoice</span>
          </button>
          {cleanPhone && (
            <a
              href={`https://wa.me/${cleanPhone}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-50 text-ink text-xs uppercase tracking-wider border border-blue-100 hover:bg-blue-100/60 transition-colors"
            >
              <span>Message Customer</span>
              <Icon name="arrowUpRight" size={13} />
            </a>
          )}
        </div>
      </div>

      {/* Printable Invoice Header */}
      <div className="bg-white border border-line p-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-hairline-b">
          <div>
            <span className="text-2xl font-medium tracking-[0.28em] text-ink uppercase block pl-[0.28em]">
              YADAVYA
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-ink-soft mt-1 block">
              Private Order Confirmation & Packing Manifest
            </span>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <div className="text-xs font-mono font-medium text-ink">
              {order.orderNumber}
            </div>
            <div className="text-xs text-ink-soft">
              Date: {formatDate(order.createdAt)}
            </div>
            <div className="pt-2 print:hidden">
              <label className="text-[10px] uppercase tracking-wider text-ink-soft block mb-1">
                Fulfillment Status:
              </label>
              <select
                value={order.status}
                disabled={updating}
                onChange={(e) =>
                  handleStatusChange(e.target.value as OrderStatus)
                }
                className="text-xs uppercase tracking-wider font-medium px-3 py-1.5 bg-surface border border-line outline-none"
              >
                <option value="New">New</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Customer & Address Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-ink-soft block pb-1 border-hairline-b">
              Client Contact Information
            </span>
            <p className="font-medium text-ink text-sm">
              {order.customer?.fullName}
            </p>
            <p className="text-ink-soft">{order.customer?.email}</p>
            <p className="text-ink-soft font-mono">{order.customer?.phone}</p>
            <p className="text-ink-soft pt-1">
              Payment Choice:{" "}
              <span className="text-ink font-medium uppercase font-mono">
                {order.paymentMethod === "COD"
                  ? "Cash on Delivery"
                  : "WhatsApp Confirmation"}
              </span>
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-ink-soft block pb-1 border-hairline-b">
              Delivery Destination
            </span>
            <p className="text-ink">{order.address?.street}</p>
            {order.address?.apartment && (
              <p className="text-ink">{order.address?.apartment}</p>
            )}
            <p className="text-ink">
              {order.address?.city}, {order.address?.state}{" "}
              {order.address?.postalCode}
            </p>
            <p className="text-ink-soft">{order.address?.country}</p>
          </div>
        </div>

        {/* Itemized Garments Table */}
        <div className="space-y-3 pt-4">
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-ink-soft block pb-1 border-hairline-b">
            Ordered Garments ({order.items?.length || 0})
          </span>

          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-line bg-surface/50 text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                <th className="py-2.5 px-3">Garment</th>
                <th className="py-2.5 px-3">Size / Option</th>
                <th className="py-2.5 px-3 text-right">Price</th>
                <th className="py-2.5 px-3 text-right">Qty</th>
                <th className="py-2.5 px-3 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {order.items?.map((item, index) => (
                <tr key={index}>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 bg-surface relative overflow-hidden border border-line shrink-0 print:hidden">
                        <SafeImage
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-medium text-ink">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-ink-soft">
                    Size: {item.size}
                    {item.color && ` • ${item.color}`}
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums text-ink">
                    {formatPrice(item.price)}
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums text-ink">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums font-medium text-ink">
                    {formatPrice(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Breakdown */}
        <div className="flex justify-end pt-4 border-hairline-t">
          <div className="w-64 space-y-2 text-xs">
            <div className="flex justify-between text-ink-soft">
              <span>Subtotal</span>
              <span className="tabular-nums font-medium text-ink">
                {formatPrice(order.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-ink-soft">
              <span>Shipping Fee</span>
              <span className="uppercase text-[11px] text-blue-500 font-medium">
                Complimentary
              </span>
            </div>
            <div className="flex justify-between text-ink pt-2 border-hairline-t text-sm font-medium">
              <span>Total Payable</span>
              <span className="tabular-nums">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
