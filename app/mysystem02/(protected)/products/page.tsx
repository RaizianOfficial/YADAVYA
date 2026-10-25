"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts, getCategories, deleteProduct, updateProduct } from "@/lib/firestore";
import { formatPrice, slugify } from "@/lib/formatters";
import { Icon } from "@/components/ui/Icon";
import { SafeImage } from "@/components/ui/SafeImage";
import type { Product, Category } from "@/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you certain you wish to remove "${name}" from the catalogue?`)) {
      try {
        await deleteProduct(id);
        setProducts(products.filter((p) => p.id !== id));
      } catch (e) {
        console.error(e);
        alert("Failed to delete product.");
      }
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    try {
      const newFeatured = !product.featured;
      await updateProduct(product.id, { featured: newFeatured });
      setProducts(
        products.map((p) =>
          p.id === product.id ? { ...p, featured: newFeatured } : p
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      categoryFilter === "all" || p.categoryId === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-hairline-b">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-ink-soft block font-medium">
            Inventory
          </span>
          <h1 className="text-2xl font-medium tracking-tight text-ink mt-1">
            Garment Catalogue
          </h1>
        </div>

        <Link
          href="/mysystem02/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-ink text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-ink/90 transition-colors shrink-0"
        >
          <Icon name="plus" size={14} />
          <span>Add Garment</span>
        </Link>
      </div>

      {/* Filter and Search controls */}
      <div className="bg-white border border-line p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-72 relative">
          <Icon
            name="search"
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft"
          />
          <input
            type="text"
            placeholder="Search by name or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-surface border border-line focus:border-ink outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-surface border border-line focus:border-ink outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-surface border border-line focus:border-ink outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-line overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <span className="text-xs uppercase tracking-[0.25em] text-ink-soft animate-pulse">
              Loading catalogue...
            </span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <p className="text-sm text-ink-soft tracking-wide">
              {products.length === 0
                ? "No garments found in database. The collection is currently empty."
                : "No garments match the current filters."}
            </p>
            {products.length === 0 && (
              <Link
                href="/mysystem02/products/new"
                className="inline-flex items-center gap-2 px-4 py-2 border border-ink text-xs uppercase tracking-[0.2em] font-medium text-ink hover:bg-ink hover:text-white transition-colors"
              >
                <Icon name="plus" size={14} />
                <span>Create First Garment</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-line bg-surface/50 text-[10px] uppercase tracking-[0.2em] text-ink-soft font-medium">
                  <th className="py-3 px-4 w-16">Item</th>
                  <th className="py-3 px-4">Garment</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Total Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-xs">
                {filtered.map((product) => {
                  const coverImage = product.images?.[0]?.url;
                  const totalStock =
                    product.sizes?.reduce((sum, s) => sum + (s.stock || 0), 0) || 0;

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-surface/40 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="w-10 h-12 bg-surface relative overflow-hidden border border-line">
                          <SafeImage
                            src={coverImage || ""}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>

                      <td className="py-3 px-4 font-medium text-ink">
                        <Link
                          href={`/mysystem02/products/${product.id}`}
                          className="hover:text-blue-500 transition-colors"
                        >
                          {product.name}
                        </Link>
                        <Link
                          href={`/product/${product.slug ? slugify(product.slug) : product.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-ink-soft hover:text-blue-500 inline-block font-normal mt-0.5"
                          title="Open live product page"
                        >
                          /{product.slug || product.id} ↗
                        </Link>
                      </td>

                      <td className="py-3 px-4 tabular-nums text-ink font-medium">
                        {formatPrice(product.price)}
                        {product.compareAtPrice && (
                          <span className="text-[11px] text-ink-soft/60 line-through ml-1.5">
                            {formatPrice(product.compareAtPrice)}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 tabular-nums text-ink">
                        <span
                          className={`font-medium ${
                            totalStock === 0
                              ? "text-red-600"
                              : totalStock <= 5
                              ? "text-orange-600"
                              : "text-ink"
                          }`}
                        >
                          {totalStock} units
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium border ${
                            product.status === "published"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-surface text-ink-soft border-line"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(product)}
                          className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium border transition-colors ${
                            product.featured
                              ? "bg-blue-50 text-blue-500 border-blue-100"
                              : "text-ink-soft/50 border-line hover:text-ink"
                          }`}
                        >
                          {product.featured ? "Featured" : "Regular"}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right space-x-2">
                        <Link
                          href={`/mysystem02/products/${product.id}`}
                          className="p-1.5 inline-block text-ink-soft hover:text-ink transition-colors"
                          title="Edit Garment"
                        >
                          <Icon name="pencil" size={14} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-1.5 inline-block text-red-600 hover:text-red-800 transition-colors"
                          title="Delete Garment"
                        >
                          <Icon name="trash" size={14} />
                        </button>
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
