"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { productSchema } from "@/lib/validators";
import { slugify, normalizeImageUrl } from "@/lib/formatters";
import { ImageUrlsEditor } from "./ImageUrlsEditor";
import { MiniProductPreview } from "./MiniProductPreview";
import { createCategory, getCategories } from "@/lib/firestore";
import type {
  Product,
  Category,
  ProductImage,
  ProductSize,
  ProductColor,
} from "@/types";

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: Omit<Product, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  isSubmitting?: boolean;
}

export function ProductForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCatName, setNewCatName] = useState("");
  const [showAddCat, setShowAddCat] = useState(false);

  // Form states
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [autoSlug, setAutoSlug] = useState(!initialData);
  const [price, setPrice] = useState<string>(
    initialData ? String(initialData.price) : ""
  );
  const [compareAtPrice, setCompareAtPrice] = useState<string>(
    initialData?.compareAtPrice ? String(initialData.compareAtPrice) : ""
  );
  const [shortDescription, setShortDescription] = useState(
    initialData?.shortDescription || ""
  );
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [fabricCare, setFabricCare] = useState(
    initialData?.fabricCare || ""
  );
  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId || ""
  );
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags?.join(", ") || ""
  );
  const [images, setImages] = useState<ProductImage[]>(
    initialData?.images?.length ? initialData.images : [{ url: "", alt: "" }]
  );
  const [sizes, setSizes] = useState<ProductSize[]>(
    initialData?.sizes || [
      { label: "S", stock: 10 },
      { label: "M", stock: 10 },
      { label: "L", stock: 10 },
    ]
  );
  const [colors, setColors] = useState<ProductColor[]>(
    initialData?.colors || []
  );
  const [status, setStatus] = useState<"draft" | "published">(
    initialData?.status || "published"
  );
  const [featured, setFeatured] = useState<boolean>(
    initialData?.featured || false
  );

  // New color state inputs
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#0E1A24");

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadCats() {
      const cats = await getCategories();
      setCategories(cats);
      if (!categoryId && cats.length > 0) {
        setCategoryId(cats[0].id);
      }
    }
    loadCats();
  }, [categoryId]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (autoSlug) {
      setSlug(slugify(val));
    }
  };

  const handleCreateCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      const newCatSlug = slugify(newCatName);
      const catId = await createCategory({
        name: newCatName.trim(),
        slug: newCatSlug,
        order: categories.length + 1,
      });
      const updatedCats = await getCategories();
      setCategories(updatedCats);
      setCategoryId(catId);
      setNewCatName("");
      setShowAddCat(false);
    } catch (e) {
      console.error(e);
      alert("Failed to create category");
    }
  };

  const toggleSize = (sizeLabel: string) => {
    const existing = sizes.find((s) => s.label === sizeLabel);
    if (existing) {
      setSizes(sizes.filter((s) => s.label !== sizeLabel));
    } else {
      setSizes([...sizes, { label: sizeLabel, stock: 10 }]);
    }
  };

  const updateSizeStock = (sizeLabel: string, stock: number) => {
    setSizes(
      sizes.map((s) => (s.label === sizeLabel ? { ...s, stock } : s))
    );
  };

  const addColor = () => {
    if (!newColorName.trim()) return;
    setColors([...colors, { name: newColorName.trim(), hex: newColorHex }]);
    setNewColorName("");
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Filter and normalize valid images
    const validImages = images
      .map((img) => ({
        url: normalizeImageUrl(img.url),
        alt: img.alt?.trim() || "",
      }))
      .filter((img) => img.url.length > 0);

    const parsedTags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const formData = {
      name: name.trim(),
      slug: slugify(slug || name),
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
      shortDescription,
      description,
      fabricCare,
      categoryId,
      tags: parsedTags,
      images: validImages,
      sizes,
      colors,
      status,
      featured,
    };

    const validation = productSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      await onSubmit(formData as unknown as Omit<Product, "id" | "createdAt" | "updatedAt">);
      router.push("/mysystem02/products");
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Failed to save product.";
      setErrors({ form: msg });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {errors.form && (
        <div className="p-3 bg-red-50 text-red-700 text-xs border border-red-200">
          {errors.form}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section: Basic Info */}
          <div className="bg-white border border-line p-6 space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] font-medium text-ink block pb-2 border-hairline-b">
              Basic Garment Details
            </span>

            <div className="space-y-1.5">
              <label className="block text-xs uppercase tracking-wider text-ink-soft">
                Name of Garment *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Architectural Linen Overshirt"
                className="w-full px-3 py-2 text-xs bg-white border border-line focus:border-ink outline-none"
              />
              {errors.name && (
                <p className="text-[11px] text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs uppercase tracking-wider text-ink-soft">
                  URL Slug *
                </label>
                <button
                  type="button"
                  onClick={() => setAutoSlug(!autoSlug)}
                  className="text-[11px] text-ink-soft hover:text-ink"
                >
                  {autoSlug ? "Manual Slug" : "Auto Slug"}
                </button>
              </div>
              <input
                type="text"
                required
                value={slug}
                readOnly={autoSlug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                className={`w-full px-3 py-2 text-xs bg-white border border-line focus:border-ink outline-none ${
                  autoSlug ? "bg-surface text-ink-soft" : ""
                }`}
              />
              {errors.slug && (
                <p className="text-[11px] text-red-600">{errors.slug}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-ink-soft">
                  Price (INR) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="3499"
                  className="w-full px-3 py-2 text-xs bg-white border border-line focus:border-ink outline-none tabular-nums"
                />
                {errors.price && (
                  <p className="text-[11px] text-red-600">{errors.price}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-ink-soft">
                  Compare At Price (INR)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                  placeholder="4499"
                  className="w-full px-3 py-2 text-xs bg-white border border-line focus:border-ink outline-none tabular-nums"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs uppercase tracking-wider text-ink-soft">
                  Category *
                </label>
                <button
                  type="button"
                  onClick={() => setShowAddCat(!showAddCat)}
                  className="text-[11px] text-blue-500 hover:text-ink transition-colors"
                >
                  {showAddCat ? "Cancel" : "+ New Category"}
                </button>
              </div>

              {showAddCat ? (
                <div className="p-3 bg-surface border border-line flex gap-2">
                  <input
                    type="text"
                    placeholder="New category name..."
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-line focus:border-ink outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    className="px-3 py-1.5 text-xs bg-ink text-white uppercase tracking-wider hover:bg-ink/90"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-line focus:border-ink outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Section: Image URLs (PATCH COMPLIANT) */}
          <div className="bg-white border border-line p-6">
            <ImageUrlsEditor
              images={images}
              onChange={setImages}
              error={errors.images}
            />
          </div>

          {/* Section: Descriptions and Fabric Care */}
          <div className="bg-white border border-line p-6 space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] font-medium text-ink block pb-2 border-hairline-b">
              Editorial Copy & Material Care
            </span>

            <div className="space-y-1.5">
              <label className="block text-xs uppercase tracking-wider text-ink-soft">
                Short Description (Card preview & intro) *
              </label>
              <input
                type="text"
                required
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Cut in structured unbleached linen with dropped shoulder seams."
                className="w-full px-3 py-2 text-xs bg-white border border-line focus:border-ink outline-none"
              />
              {errors.shortDescription && (
                <p className="text-[11px] text-red-600">{errors.shortDescription}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs uppercase tracking-wider text-ink-soft">
                Full Description (Editorial statement & silhouette) *
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed garment notes, silhouette specifications, tailored proportions..."
                className="w-full px-3 py-2 text-xs bg-white border border-line focus:border-ink outline-none"
              />
              {errors.description && (
                <p className="text-[11px] text-red-600">{errors.description}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs uppercase tracking-wider text-ink-soft">
                Fabric & Care Notes *
              </label>
              <textarea
                rows={3}
                required
                value={fabricCare}
                onChange={(e) => setFabricCare(e.target.value)}
                placeholder="100% GOTS Organic Raw Linen. Dry clean or cold delicate cycle. Flat dry in shade."
                className="w-full px-3 py-2 text-xs bg-white border border-line focus:border-ink outline-none"
              />
              {errors.fabricCare && (
                <p className="text-[11px] text-red-600">{errors.fabricCare}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs uppercase tracking-wider text-ink-soft">
                Search Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="linen, shirt, minimal, raw white, edition 01"
                className="w-full px-3 py-2 text-xs bg-white border border-line focus:border-ink outline-none"
              />
            </div>
          </div>

          {/* Section: Sizes & Stock */}
          <div className="bg-white border border-line p-6 space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] font-medium text-ink block pb-2 border-hairline-b">
              Sizes & Inventory Count
            </span>

            <p className="text-xs text-ink-soft">
              Select available sizes for this silhouette and specify stock units:
            </p>

            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SIZES.map((sz) => {
                const active = sizes.some((s) => s.label === sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => toggleSize(sz)}
                    className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                      active
                        ? "bg-ink text-white border-ink"
                        : "bg-surface text-ink-soft border-line hover:text-ink"
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>

            {sizes.length > 0 && (
              <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {sizes.map((s) => (
                  <div
                    key={s.label}
                    className="p-2.5 bg-surface border border-line flex items-center justify-between"
                  >
                    <span className="text-xs font-medium text-ink">
                      Size {s.label}:
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={s.stock}
                      onChange={(e) =>
                        updateSizeStock(s.label, Number(e.target.value))
                      }
                      className="w-16 px-2 py-1 text-xs bg-white border border-line focus:border-ink outline-none text-right tabular-nums"
                    />
                  </div>
                ))}
              </div>
            )}
            {errors.sizes && (
              <p className="text-[11px] text-red-600">{errors.sizes}</p>
            )}
          </div>

          {/* Section: Colors (Optional) */}
          <div className="bg-white border border-line p-6 space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] font-medium text-ink block pb-2 border-hairline-b">
              Garment Color Variations (Optional)
            </span>

            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                placeholder="Color name (e.g. Bone White)"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-line focus:border-ink outline-none w-44"
              />
              <div className="flex items-center gap-2 border border-line px-2 py-1 bg-white">
                <input
                  type="color"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="w-6 h-6 border-0 cursor-pointer bg-transparent"
                />
                <span className="text-xs font-mono text-ink-soft">
                  {newColorHex}
                </span>
              </div>
              <button
                type="button"
                onClick={addColor}
                className="px-3 py-1.5 text-xs bg-surface text-ink border border-line hover:bg-white uppercase tracking-wider"
              >
                + Add Color
              </button>
            </div>

            {colors.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {colors.map((c, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-2.5 py-1 bg-surface border border-line text-xs"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-none border border-black/10 shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="text-ink">{c.name}</span>
                    <button
                      type="button"
                      onClick={() => removeColor(idx)}
                      className="text-ink-soft hover:text-red-600 ml-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Mini Preview & Publish Settings */}
        <div className="lg:col-span-4 space-y-6">
          {/* Mini Product Card Preview */}
          <MiniProductPreview
            name={name}
            price={Number(price) || 0}
            compareAtPrice={compareAtPrice ? Number(compareAtPrice) : null}
            images={images.filter((img) => img.url.trim().length > 0)}
            status={status}
            featured={featured}
          />

          {/* Visibility and Controls */}
          <div className="bg-white border border-line p-6 space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] font-medium text-ink block pb-2 border-hairline-b">
              Publication Status
            </span>

            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={status === "published"}
                  onChange={() => setStatus("published")}
                  className="accent-ink"
                />
                <span className="text-xs text-ink">
                  Published (Visible in Storefront)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={status === "draft"}
                  onChange={() => setStatus("draft")}
                  className="accent-ink"
                />
                <span className="text-xs text-ink">
                  Draft (Hidden from Storefront)
                </span>
              </label>
            </div>

            <div className="pt-3 border-hairline-t">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="accent-ink"
                />
                <span className="text-xs text-ink">
                  Feature in Homepage Showcase
                </span>
              </label>
            </div>

            <div className="pt-4 border-hairline-t flex gap-3">
              <button
                type="button"
                onClick={() => router.push("/mysystem02/products")}
                className="flex-1 py-2.5 text-xs uppercase tracking-wider text-ink-soft hover:text-ink border border-line hover:bg-surface text-center"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-ink text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-ink/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Garment"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
