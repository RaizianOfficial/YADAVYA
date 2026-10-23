"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import type { ProductImage } from "@/types";

interface ImageUrlsEditorProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  error?: string;
}

function ImageRowPreview({ url }: { url: string }) {
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!url) {
    return (
      <div className="w-14 h-16 bg-surface border border-line flex items-center justify-center shrink-0">
        <span className="text-[9px] text-ink-soft/40 tracking-wider">Empty</span>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="w-14 h-16 bg-red-50/50 border border-red-200 flex flex-col items-center justify-center p-1 text-center shrink-0">
        <span className="text-[8px] text-red-600 leading-tight">Could not load</span>
      </div>
    );
  }

  return (
    <div className="w-14 h-16 bg-surface border border-line relative overflow-hidden shrink-0">
      <Image
        src={url}
        alt="Preview"
        fill
        sizes="56px"
        className={`object-cover transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => setHasError(true)}
      />
      {!loaded && (
        <div className="absolute inset-0 bg-surface flex items-center justify-center">
          <span className="text-[8px] text-ink-soft/40 animate-pulse">...</span>
        </div>
      )}
    </div>
  );
}

export function ImageUrlsEditor({
  images,
  onChange,
  error,
}: ImageUrlsEditorProps) {
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchText, setBatchText] = useState("");

  const handleUrlChange = (index: number, newUrl: string) => {
    const updated = [...images];
    updated[index] = { ...updated[index], url: newUrl.trim() };
    onChange(updated);
  };

  const handleAltChange = (index: number, newAlt: string) => {
    const updated = [...images];
    updated[index] = { ...updated[index], alt: newAlt };
    onChange(updated);
  };

  const addRow = () => {
    onChange([...images, { url: "", alt: "" }]);
  };

  const removeRow = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated.length > 0 ? updated : [{ url: "", alt: "" }]);
  };

  const makeCover = (index: number) => {
    if (index === 0) return;
    const target = images[index];
    const rest = images.filter((_, i) => i !== index);
    onChange([target, ...rest]);
  };

  const moveRow = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange(updated);
  };

  const handleBatchImport = () => {
    const lines = batchText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const validUrls = lines.map((url) => ({ url, alt: "" }));

    if (validUrls.length > 0) {
      // If the only existing item is empty, replace it
      if (images.length === 1 && !images[0].url) {
        onChange(validUrls);
      } else {
        onChange([...images, ...validUrls]);
      }
    }
    setBatchText("");
    setShowBatchModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-1 border-hairline-b">
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] font-medium text-ink">
            Product Images (External URLs)
          </span>
          <p className="text-[11px] text-ink-soft">
            First image is the cover; second image crossfades on hover.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowBatchModal(!showBatchModal)}
          className="text-xs text-blue-500 hover:text-ink tracking-wider transition-colors"
        >
          {showBatchModal ? "Hide bulk input" : "Paste multiple URLs"}
        </button>
      </div>

      {showBatchModal && (
        <div className="p-4 bg-surface border border-line space-y-3">
          <label className="block text-xs font-medium text-ink tracking-wide">
            Paste one image URL per line:
          </label>
          <textarea
            rows={4}
            value={batchText}
            onChange={(e) => setBatchText(e.target.value)}
            placeholder="https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2..."
            className="w-full p-2.5 text-xs font-mono bg-white border border-line focus:border-ink outline-none"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowBatchModal(false)}
              className="px-3 py-1.5 text-xs text-ink-soft hover:text-ink"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleBatchImport}
              className="px-4 py-1.5 text-xs bg-ink text-white uppercase tracking-wider hover:bg-ink/90"
            >
              Add Lines to List
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-600 tracking-wide">{error}</p>}

      {/* Rows */}
      <div className="space-y-3">
        {images.map((img, index) => (
          <div
            key={index}
            className={`p-3 bg-white border flex flex-col sm:flex-row items-start sm:items-center gap-3 ${
              index === 0 ? "border-ink" : "border-line"
            }`}
          >
            {/* Live Preview */}
            <ImageRowPreview url={img.url} />

            {/* Inputs */}
            <div className="flex-1 w-full space-y-1.5">
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  placeholder="https://..."
                  value={img.url}
                  onChange={(e) => handleUrlChange(index, e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-line focus:border-ink outline-none"
                />
                {index === 0 && (
                  <span className="shrink-0 px-2 py-0.5 bg-blue-50 text-[10px] uppercase tracking-wider text-ink font-medium border border-blue-100">
                    Cover
                  </span>
                )}
              </div>
              <input
                type="text"
                placeholder="Image alt description (optional)"
                value={img.alt || ""}
                onChange={(e) => handleAltChange(index, e.target.value)}
                className="w-full px-3 py-1 text-[11px] text-ink-soft bg-surface border border-line focus:border-ink outline-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => makeCover(index)}
                  className="px-2 py-1 text-[11px] text-ink hover:bg-surface border border-line"
                  title="Make this the cover image"
                >
                  Make Cover
                </button>
              )}
              <button
                type="button"
                onClick={() => moveRow(index, "up")}
                disabled={index === 0}
                className="p-1.5 text-ink-soft hover:text-ink disabled:opacity-20"
                title="Move up"
              >
                <Icon name="chevronLeft" size={14} className="rotate-90" />
              </button>
              <button
                type="button"
                onClick={() => moveRow(index, "down")}
                disabled={index === images.length - 1}
                className="p-1.5 text-ink-soft hover:text-ink disabled:opacity-20"
                title="Move down"
              >
                <Icon name="chevronRight" size={14} className="rotate-90" />
              </button>
              <button
                type="button"
                onClick={() => removeRow(index)}
                className="p-1.5 text-red-600 hover:text-red-800"
                title="Remove image"
              >
                <Icon name="trash" size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRow}
        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium text-ink hover:text-blue-500 py-1"
      >
        <Icon name="plus" size={14} />
        <span>Add another image URL</span>
      </button>
    </div>
  );
}
