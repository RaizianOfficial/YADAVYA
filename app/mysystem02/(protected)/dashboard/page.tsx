"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts, getOrders } from "@/lib/firestore";
import { formatPrice, formatDate } from "@/lib/formatters";
import { Icon } from "@/components/ui/Icon";
import type { Product, Order } from "@/types";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodList, ordList] = await Promise.all([
          getProducts(),
          getOrders(),
        ]);
        setProducts(prodList);
        setOrders(ordList);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <span className="text-xs uppercase tracking-[0.25em] text-ink-soft animate-pulse">
          Loading metrics...
        </span>
      </div>
    );
  }

  // Metrics
  const totalProducts = products.length;
  const publishedProducts = products.filter((p) => p.status === "published").length;
  const totalOrders = orders.length;
  const newOrders = orders.filter((o) => o.status === "New").length;
  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + (o.total || 0), 0);

  // Low stock check (stock <= 3)
  const lowStockItems: {
    product: Product;
    size: string;
    stock: number;
  }[] = [];

  products.forEach((p) => {
    p.sizes?.forEach((s) => {
      if (s.stock <= 3) {
        lowStockItems.push({
          product: p,
          size: s.label,
          stock: s.stock,
        });
      }
    });
  });

  return (
    <div className="space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-hairline-b">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-ink-soft block font-medium">
            Overview
          </span>
          <h1 className="text-2xl font-medium tracking-tight text-ink mt-1">
            Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/mysystem02/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-ink text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-ink/90 transition-colors"
          >
            <Icon name="plus" size={14} />
            <span>Add Garment</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards (Sharp rectangles, hairline borders, zero blur/gradients) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 bg-white border border-line">
          <span className="text-[10px] uppercase tracking-[0.22em] text-ink-soft block font-medium">
            Total Orders
          </span>
          <div className="mt-2 text-2xl font-medium tabular-nums text-ink">
            {totalOrders}
          </div>
          <span className="text-xs text-ink-soft mt-1 block">
            {newOrders} pending review
          </span>
        </div>

        <div className="p-6 bg-white border border-line">
          <span className="text-[10px] uppercase tracking-[0.22em] text-ink-soft block font-medium">
            Gross Volume
          </span>
          <div className="mt-2 text-2xl font-medium tabular-nums text-ink">
            {formatPrice(totalRevenue)}
          </div>
          <span className="text-xs text-ink-soft mt-1 block">
            Across confirmed orders
          </span>
        </div>

        <div className="p-6 bg-white border border-line">
          <span className="text-[10px] uppercase tracking-[0.22em] text-ink-soft block font-medium">
            Total Catalogue
          </span>
          <div className="mt-2 text-2xl font-medium tabular-nums text-ink">
            {totalProducts}
          </div>
          <span className="text-xs text-ink-soft mt-1 block">
            {publishedProducts} published active
          </span>
        </div>

        <div className="p-6 bg-white border border-line">
          <span className="text-[10px] uppercase tracking-[0.22em] text-ink-soft block font-medium">
            Low Stock Alerts
          </span>
          <div className="mt-2 text-2xl font-medium tabular-nums text-ink">
            {lowStockItems.length}
          </div>
          <span className="text-xs text-ink-soft mt-1 block">
            Sizes with ≤ 3 units remaining
          </span>
        </div>
      </div>

      {/* Grid: Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-7 bg-white border border-line p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-hairline-b">
            <span className="text-xs uppercase font-medium tracking-[0.2em] text-ink">
              Recent Orders
            </span>
            <Link
              href="/mysystem02/orders"
              className="text-xs text-blue-500 hover:text-ink tracking-wider transition-colors"
            >
              View all ({orders.length})
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="text-xs text-ink-soft py-8 text-center">
              No orders have been recorded yet.
            </p>
          ) : (
            <div className="divide-y divide-line">
              {orders.slice(0, 5).map((ord) => (
                <div
                  key={ord.id}
                  className="py-3.5 flex items-center justify-between gap-4 hover:bg-surface/50 px-2 transition-colors"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/mysystem02/orders/${ord.id}`}
                      className="text-xs font-medium text-ink hover:text-blue-500 tracking-wider truncate block"
                    >
                      {ord.orderNumber}
                    </Link>
                    <span className="text-[11px] text-ink-soft">
                      {ord.customer?.fullName} • {formatDate(ord.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 text-right">
                    <span className="text-xs font-medium text-ink tabular-nums">
                      {formatPrice(ord.total)}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium border ${
                        ord.status === "New"
                          ? "bg-blue-50 text-blue-500 border-blue-100"
                          : ord.status === "Delivered"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : ord.status === "Cancelled"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-surface text-ink-soft border-line"
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Watchlist */}
        <div className="lg:col-span-5 bg-white border border-line p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-hairline-b">
            <span className="text-xs uppercase font-medium tracking-[0.2em] text-ink">
              Low Inventory Watchlist
            </span>
            <Link
              href="/mysystem02/products"
              className="text-xs text-blue-500 hover:text-ink tracking-wider transition-colors"
            >
              Inventory
            </Link>
          </div>

          {lowStockItems.length === 0 ? (
            <p className="text-xs text-ink-soft py-8 text-center">
              All sizes and garments are adequately stocked.
            </p>
          ) : (
            <div className="divide-y divide-line">
              {lowStockItems.slice(0, 6).map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.size}-${idx}`}
                  className="py-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/mysystem02/products/${item.product.id}`}
                      className="text-xs font-medium text-ink hover:text-blue-500 truncate block tracking-wide"
                    >
                      {item.product.name}
                    </Link>
                    <span className="text-[11px] text-ink-soft">
                      Size: {item.size}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-red-50 text-red-700 text-[10px] font-medium border border-red-200 tabular-nums">
                    {item.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
