"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getOrders, updateOrderStatus } from "@/lib/firestore";
import { formatPrice, formatDate } from "@/lib/formatters";
import { Icon } from "@/components/ui/Icon";
import type { Order, OrderStatus } from "@/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const list = await getOrders();
      setOrders(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(
        orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (e) {
      console.error(e);
      alert("Failed to update status.");
    }
  };

  const filtered = orders.filter((o) => {
    const matchesStatus =
      statusFilter === "all" || o.status === statusFilter;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.phone?.includes(search);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-hairline-b">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-ink-soft block font-medium">
            Fulfillment
          </span>
          <h1 className="text-2xl font-medium tracking-tight text-ink mt-1">
            Orders Register
          </h1>
        </div>

        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 px-3 py-2 bg-surface text-ink text-xs uppercase tracking-wider border border-line hover:bg-white transition-colors"
        >
          <Icon name="reset" size={14} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-line p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-72 relative">
          <Icon
            name="search"
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft"
          />
          <input
            type="text"
            placeholder="Search order #, customer, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-surface border border-line focus:border-ink outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-surface border border-line focus:border-ink outline-none w-full sm:w-auto"
          >
            <option value="all">All Statuses ({orders.length})</option>
            <option value="New">New</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-line overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <span className="text-xs uppercase tracking-[0.25em] text-ink-soft animate-pulse">
              Loading orders...
            </span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-ink-soft tracking-wide">
              No orders found matching the filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-line bg-surface/50 text-[10px] uppercase tracking-[0.2em] text-ink-soft font-medium">
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-xs">
                {filtered.map((order) => {
                  const itemCount =
                    order.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-surface/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-ink font-mono">
                        <Link
                          href={`/mysystem02/orders/${order.id}`}
                          className="hover:text-blue-500 transition-colors"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-ink">
                          {order.customer?.fullName}
                        </div>
                        <div className="text-[11px] text-ink-soft">
                          {order.customer?.phone}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-ink-soft text-[11px]">
                        {formatDate(order.createdAt)}
                      </td>

                      <td className="py-3 px-4 tabular-nums text-ink">
                        {itemCount} {itemCount === 1 ? "unit" : "units"}
                      </td>

                      <td className="py-3 px-4 tabular-nums font-medium text-ink">
                        {formatPrice(order.total)}
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 bg-surface border border-line text-ink">
                          {order.paymentMethod}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(
                              order.id,
                              e.target.value as OrderStatus
                            )
                          }
                          className="text-[10px] uppercase tracking-wider font-medium px-2 py-1 bg-surface border border-line outline-none cursor-pointer"
                        >
                          <option value="New">New</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/mysystem02/orders/${order.id}`}
                          className="p-1.5 inline-block text-ink-soft hover:text-ink transition-colors"
                          title="Open Order Details"
                        >
                          <Icon name="chevronRight" size={14} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
