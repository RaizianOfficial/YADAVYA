import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/firestore";
import { slugify } from "@/lib/formatters";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/shipping-returns`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  try {
    const products = await getProducts({ status: "published" });
    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${baseUrl}/product/${p.slug ? slugify(p.slug) : p.id}`,
      lastModified: new Date(p.updatedAt || p.createdAt || Date.now()),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticRoutes, ...productRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticRoutes;
  }
}
