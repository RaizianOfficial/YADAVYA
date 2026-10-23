"use client";

import React, { useEffect, useState } from "react";
import { getSiteSettings, updateSiteSettings } from "@/lib/firestore";
import { SafeImage } from "@/components/ui/SafeImage";
import { normalizeImageUrl } from "@/lib/formatters";
import type { SiteSettings } from "@/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSiteSettings();
        setSettings(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setSuccess(false);

    try {
      const cleaned: SiteSettings = {
        ...settings,
        hero: {
          ...settings.hero,
          imageUrl: normalizeImageUrl(settings.hero?.imageUrl),
        },
        editorialBanner: {
          ...settings.editorialBanner,
          imageUrl: normalizeImageUrl(settings.editorialBanner?.imageUrl),
        },
      };
      await updateSiteSettings(cleaned);
      setSettings(cleaned);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      console.error(e);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <span className="text-xs uppercase tracking-[0.25em] text-ink-soft animate-pulse">
          Loading site configurations...
        </span>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="pb-6 border-hairline-b">
        <span className="text-[10px] uppercase tracking-[0.25em] text-ink-soft block font-medium">
          Configuration
        </span>
        <h1 className="text-2xl font-medium tracking-tight text-ink mt-1">
          Site Settings & Editorial Copy
        </h1>
        <p className="text-xs text-ink-soft mt-1">
          Manage live storefront messaging, hero imagery, brand statements, and contact channels.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
        {success && (
          <div className="p-3 bg-green-50 text-green-800 text-xs tracking-wide border border-green-200">
            Site settings successfully updated and live on storefront.
          </div>
        )}

        {/* Announcement Bar */}
        <div className="bg-white border border-line p-6 space-y-4">
          <span className="text-xs uppercase tracking-[0.2em] font-medium text-ink block pb-2 border-hairline-b">
            Top Announcement Bar
          </span>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.announcementBar?.enabled ?? true}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  announcementBar: {
                    ...settings.announcementBar,
                    enabled: e.target.checked,
                  },
                })
              }
              className="accent-ink"
            />
            <span className="text-xs text-ink">Enable Announcement Banner</span>
          </label>

          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-wider text-ink-soft">
              Banner Message
            </label>
            <input
              type="text"
              value={settings.announcementBar?.text || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  announcementBar: {
                    ...settings.announcementBar,
                    text: e.target.value,
                  },
                })
              }
              placeholder="COMPLIMENTARY SHIPPING ACROSS INDIA ON ALL ORDERS"
              className="w-full px-3 py-2 text-xs bg-white border border-line focus:border-ink outline-none"
            />
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white border border-line p-6 space-y-4">
          <span className="text-xs uppercase tracking-[0.2em] font-medium text-ink block pb-2 border-hairline-b">
            Homepage Hero Editorial
          </span>

          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-wider text-ink-soft">
              Hero Image URL (External)
            </label>
            <input
              type="url"
              value={settings.hero?.imageUrl || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  hero: { ...settings.hero, imageUrl: e.target.value },
                })
              }
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3 py-2 text-xs bg-white border border-line focus:border-ink outline-none"
            />
            {settings.hero?.imageUrl && (
              <div className="mt-2 w-48 h-32 bg-surface border border-line relative overflow-hidden">
                <SafeImage
                  src={settings.hero.imageUrl}
                  alt="Hero Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-wider text-ink-soft">
              Headline
            </label>
            <input
              type="text"
              required
              value={settings.hero?.headline || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  hero: { ...settings.hero, headline: e.target.value },
                })
              }
              placeholder="Quiet form. Measured presence."
              className="w-full px-3 py-2 text-xs bg-white border border-line focus:border-ink outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-wider text-ink-soft">
              Subtext
            </label>
            <input
              type="text"
              required
              value={settings.hero?.subtext || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  hero: { ...settings.hero, subtext: e.target.value },
                })
              }
              placeholder="An intentional study in silhouette and raw proportion."
              className="w-full px-3 py-2 text-xs bg-white border border-line focus:border-ink outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-wider text-ink-soft">
              Call to Action Button Label
            </label>
            <input
              type="text"
              required
              value={settings.hero?.ctaLabel || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  hero: { ...settings.hero, ctaLabel: e.target.value },
                })
              }
              placeholder="Shop the collection"
              className="w-full px-3 py-2 text-xs bg-white border border-line focus:border-ink outline-none"
            />
          </div>
        </div>

        {/* Brand Statement Section */}
        <div className="bg-white border border-line p-6 space-y-4">
          <span className="text-xs uppercase tracking-[0.2em] font-medium text-ink block pb-2 border-hairline-b">
            Brand Statement (Scroll Typography Section)
          </span>

          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-wider text-ink-soft">
              Statement Paragraph
            </label>
            <textarea
              rows={4}
              required
              value={settings.brandStatement?.text || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  brandStatement: { text: e.target.value },
                })
              }
              placeholder="YADAVYA exists in the quiet cadence between architectural precision..."
              className="w-full px-3 py-2 text-xs bg-white border border-line focus:border-ink outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Editorial Banner */}
        <div className="bg-white border border-line p-6 space-y-4">
          <span className="text-xs uppercase tracking-[0.2em] font-medium text-ink block pb-2 border-hairline-b">
            Full-Width Editorial Banner
          </span>

          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-wider text-ink-soft">
              Banner Image URL (External)
            </label>
            <input
              type="url"
              value={settings.editorialBanner?.imageUrl || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  editorialBanner: {
                    ...settings.editorialBanner,
                    imageUrl: e.target.value,
                  },
                })
              }
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3 py-2 text-xs bg-white border border-line focus:border-ink outline-none"
            />
            {settings.editorialBanner?.imageUrl && (
              <div className="mt-2 w-56 h-28 bg-surface border border-line relative overflow-hidden">
                <SafeImage
                  src={settings.editorialBanner.imageUrl}
                  alt="Banner preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs uppercase tracking-wider text-ink-soft">
                Overlay Title
              </label>
              <input
                type="text"
                value={settings.editorialBanner?.title || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    editorialBanner: {
                      ...settings.editorialBanner,
                      title: e.target.value,
                    },
                  })
                }
                placeholder="Edition 01 / Monolith"
                className="w-full px-3 py-2 text-xs bg-white border border-line focus:border-ink outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs uppercase tracking-wider text-ink-soft">
                Overlay Subtitle
              </label>
              <input
                type="text"
                value={settings.editorialBanner?.subtitle || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    editorialBanner: {
                      ...settings.editorialBanner,
                      subtitle: e.target.value,
                    },
                  })
                }
                placeholder="Explorations in hand-loomed texture..."
                className="w-full px-3 py-2 text-xs bg-white border border-line focus:border-ink outline-none"
              />
            </div>
          </div>
        </div>

        {/* Contact & Legal Details */}
        <div className="bg-white border border-line p-6 space-y-4">
          <span className="text-xs uppercase tracking-[0.2em] font-medium text-ink block pb-2 border-hairline-b">
            Channels & Concierge Information
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs uppercase tracking-wider text-ink-soft">
                Contact Email
              </label>
              <input
                type="email"
                required
                value={settings.contactEmail || ""}
                onChange={(e) =>
                  setSettings({ ...settings, contactEmail: e.target.value })
                }
                placeholder="concierge@yadavya.com"
                className="w-full px-3 py-2 text-xs bg-white border border-line focus:border-ink outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs uppercase tracking-wider text-ink-soft">
                WhatsApp Concierge Number (with country code, e.g. 919876543210)
              </label>
              <input
                type="text"
                required
                value={settings.whatsappNumber || ""}
                onChange={(e) =>
                  setSettings({ ...settings, whatsappNumber: e.target.value })
                }
                placeholder="919876543210"
                className="w-full px-3 py-2 text-xs bg-white border border-line focus:border-ink outline-none font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-wider text-ink-soft">
              Instagram Account URL
            </label>
            <input
              type="url"
              value={settings.instagramUrl || ""}
              onChange={(e) =>
                setSettings({ ...settings, instagramUrl: e.target.value })
              }
              placeholder="https://instagram.com/yadavya"
              className="w-full px-3 py-2 text-xs bg-white border border-line focus:border-ink outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-wider text-ink-soft">
              Standard Shipping Policy Note
            </label>
            <input
              type="text"
              value={settings.shippingNote || ""}
              onChange={(e) =>
                setSettings({ ...settings, shippingNote: e.target.value })
              }
              placeholder="Orders dispatched within 24-48 hours. Delivered nationwide within 3-5 business days."
              className="w-full px-3 py-2 text-xs bg-white border border-line focus:border-ink outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-ink text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-ink/90 transition-colors disabled:opacity-50"
          >
            {saving ? "Publishing Changes..." : "Publish Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
