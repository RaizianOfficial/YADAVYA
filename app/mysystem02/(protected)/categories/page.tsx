"use client";

import React, { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/firestore";
import { slugify } from "@/lib/formatters";
import { Icon } from "@/components/ui/Icon";
import { SafeImage } from "@/components/ui/SafeImage";
import type { Category } from "@/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [order, setOrder] = useState<number>(0);
  const [coverImage, setCoverImage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const list = await getCategories();
      setCategories(list);
      setOrder(list.length + 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingId) {
      setSlug(slugify(val));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editingId) {
        await updateCategory(editingId, {
          name: name.trim(),
          slug: slug.trim(),
          order: Number(order),
          coverImage: coverImage.trim() || undefined,
        });
      } else {
        await createCategory({
          name: name.trim(),
          slug: slug.trim(),
          order: Number(order),
          coverImage: coverImage.trim() || undefined,
        });
      }

      setName("");
      setSlug("");
      setCoverImage("");
      setEditingId(null);
      await loadData();
    } catch (e) {
      console.error(e);
      alert("Failed to save category.");
    }
  };

  const handleStartEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setOrder(cat.order);
    setCoverImage(cat.coverImage || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setCoverImage("");
    setOrder(categories.length + 1);
  };

  const handleDelete = async (id: string, catName: string) => {
    if (confirm(`Remove "${catName}" category?`)) {
      try {
        await deleteCategory(id);
        await loadData();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="pb-6 border-hairline-b">
        <span className="text-[10px] uppercase tracking-[0.25em] text-ink-soft block font-medium">
          Taxonomy
        </span>
        <h1 className="text-2xl font-medium tracking-tight text-ink mt-1">
          Categories & Collections
        </h1>
        <p className="text-xs text-ink-soft mt-1">
          Organize garments into cohesive editorial categories with optional cover image URLs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-5 bg-white border border-line p-6 space-y-4 h-fit">
          <span className="text-xs uppercase tracking-[0.2em] font-medium text-ink block pb-2 border-hairline-b">
            {editingId ? "Edit Category" : "Add New Category"}
          </span>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs uppercase tracking-wider text-ink-soft">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Shirts & Overshirts"
                className="w-full px-3 py-2 text-xs bg-white border border-line focus:border-ink outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs uppercase tracking-wider text-ink-soft">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                placeholder="shirts-overshirts"
                className="w-full px-3 py-2 text-xs bg-white border border-line focus:border-ink outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs uppercase tracking-wider text-ink-soft">
                Display Order Index
              </label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-white border border-line focus:border-ink outline-none tabular-nums"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs uppercase tracking-wider text-ink-soft">
                Cover Image URL (Optional)
              </label>
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3 py-2 text-xs bg-white border border-line focus:border-ink outline-none"
              />
              {coverImage && (
                <div className="mt-2 w-28 h-20 bg-surface border border-line relative overflow-hidden">
                  <SafeImage
                    src={coverImage}
                    alt="Category cover"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-xs uppercase tracking-wider text-ink-soft border border-line hover:text-ink"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="flex-1 py-2 bg-ink text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-ink/90 transition-colors"
              >
                {editingId ? "Update Category" : "Save Category"}
              </button>
            </div>
          </form>
        </div>

        {/* List Column */}
        <div className="lg:col-span-7 bg-white border border-line p-6 space-y-4">
          <span className="text-xs uppercase tracking-[0.2em] font-medium text-ink block pb-2 border-hairline-b">
            Existing Categories ({categories.length})
          </span>

          {loading ? (
            <div className="py-12 text-center text-xs text-ink-soft animate-pulse">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <p className="text-xs text-ink-soft py-8 text-center">
              No categories have been established. Create one using the form.
            </p>
          ) : (
            <div className="divide-y divide-line">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="py-3 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-ink-soft w-6">
                      #{cat.order}
                    </span>
                    {cat.coverImage && (
                      <div className="w-10 h-10 bg-surface relative overflow-hidden border border-line shrink-0">
                        <SafeImage
                          src={cat.coverImage}
                          alt={cat.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs font-medium text-ink">
                        {cat.name}
                      </h4>
                      <span className="text-[11px] text-ink-soft">
                        /{cat.slug}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(cat)}
                      className="p-1.5 text-ink-soft hover:text-ink transition-colors"
                      title="Edit"
                    >
                      <Icon name="pencil" size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="p-1.5 text-red-600 hover:text-red-800 transition-colors"
                      title="Delete"
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
