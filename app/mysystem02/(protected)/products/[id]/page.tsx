"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProductById, updateProduct } from "@/lib/firestore";
import type { Product } from "@/types";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const item = await getProductById(id);
        if (item) {
          setProduct(item);
        } else {
          router.replace("/mysystem02/products");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  const handleUpdate = async (
    data: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await updateProduct(id, data);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <span className="text-xs uppercase tracking-[0.25em] text-ink-soft animate-pulse">
          Retrieving garment details...
        </span>
      </div>
    );
  }

  if (!product) return null;

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
        <span className="text-ink truncate max-w-xs">{product.name}</span>
      </div>

      <div className="pb-4 border-hairline-b flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-ink">
            Edit Garment
          </h1>
          <p className="text-xs text-ink-soft mt-1">
            Updating &ldquo;{product.name}&rdquo; ({product.slug})
          </p>
        </div>
      </div>

      <ProductForm
        initialData={product}
        onSubmit={handleUpdate}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
