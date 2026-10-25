import { z } from "zod";
import { normalizeImageUrl, slugify } from "./formatters";

export const imageUrlSchema = z.preprocess(
  (val) => (typeof val === "string" ? normalizeImageUrl(val) : val),
  z
    .string()
    .min(1, "Image URL is required")
    .url("Must be a valid URL")
    .refine((url) => url.startsWith("https://") || url.startsWith("http://"), {
      message: "URL must start with https:// or http://",
    })
);

export const productSizeSchema = z.object({
  label: z.string().min(1, "Size label is required"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
});

export const productColorSchema = z.object({
  name: z.string().min(1, "Color name is required"),
  hex: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, "Invalid hex color code"),
});

export const productImageSchema = z.object({
  url: imageUrlSchema,
  alt: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(2, "Product name is required (at least 2 characters)"),
  slug: z.preprocess(
    (val) => (typeof val === "string" ? slugify(val) : val),
    z.string().min(2, "Slug is required")
  ),
  price: z.coerce.number().positive("Price must be greater than 0"),
  compareAtPrice: z.coerce.number().optional().nullable(),
  shortDescription: z.string().min(5, "Short description is required"),
  description: z.string().min(10, "Full description is required"),
  fabricCare: z.string().min(3, "Fabric & care information is required"),
  categoryId: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).default([]),
  images: z.array(productImageSchema).min(1, "At least 1 product image URL is required"),
  sizes: z.array(productSizeSchema).min(1, "At least 1 size must be configured"),
  colors: z.array(productColorSchema).optional().default([]),
  status: z.enum(["draft", "published"]),
  featured: z.boolean().default(false),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  slug: z.string().min(2, "Category slug is required"),
  order: z.coerce.number().int().default(0),
  coverImage: imageUrlSchema.optional().or(z.literal("")),
});

export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid 10-digit phone number"),
  street: z.string().min(5, "Please enter your street address"),
  apartment: z.string().optional(),
  city: z.string().min(2, "Please enter your city"),
  state: z.string().min(2, "Please enter your state"),
  postalCode: z.string().min(4, "Please enter a valid postal code"),
  country: z.string().default("India"),
  paymentMethod: z.enum(["COD", "WHATSAPP"]),
});

export const siteSettingsSchema = z.object({
  announcementBar: z.object({
    enabled: z.boolean(),
    text: z.string(),
  }),
  hero: z.object({
    imageUrl: z.string().optional(),
    headline: z.string().min(3, "Headline is required"),
    subtext: z.string().min(3, "Subtext is required"),
    ctaLabel: z.string().min(2, "CTA label is required"),
  }),
  brandStatement: z.object({
    text: z.string().min(10, "Brand statement text is required"),
  }),
  editorialBanner: z.object({
    imageUrl: z.string().optional(),
    title: z.string().optional(),
    subtitle: z.string().optional(),
  }),
  contactEmail: z.string().email("Valid email required"),
  whatsappNumber: z.string().min(10, "Valid WhatsApp number with country code required"),
  instagramUrl: z.string().url("Valid URL required"),
  shippingNote: z.string(),
});
