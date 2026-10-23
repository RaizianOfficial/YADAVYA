"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";
import { createProduct } from "@/lib/firestore";
import type { Product } from "@/types";

export default function NewProductPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (
    data: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => {
    setIsSubmitting(true);
    try {
      await createProduct(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-ink-soft">
        <Link
          href="/mysystem02/products"
          className="hover:text-ink transition-colors"
        >
          Garments
        </Link>
        <span>/</span>
        <span className="text-ink">New Garment</span>
      </div>

      <div className="pb-4 border-hairline-b">
        <h1 className="text-2xl font-medium tracking-tight text-ink">
          Add New Garment
        </h1>
        <p className="text-xs text-ink-soft mt-1">
          Catalog a new silhouette with editorial descriptions, material specifications, and image URLs.
        </p>
      </div>

      <ProductForm onSubmit={handleCreate} isSubmitting={isSubmitting} />
    </div>
  );
}
