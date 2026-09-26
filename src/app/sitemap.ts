import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://hayvows.com";
  const now = new Date();

  // Halaman Utama & Auth
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/panduan`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Halaman Demo Resmi untuk Indexing & AI Crawling
  const demoRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/invitation/arthur-guinevere/budi-santoso`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/invitation/alex-sarah/budi-santoso`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/invitation/dimas-anindya/budi-santoso`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/invitation/adrian-nadia/budi-santoso`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/display/arthur-guinevere`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Dynamic public weddings dari database jika ada
  let dynamicWeddings: MetadataRoute.Sitemap = [];
  try {
    const publishedWeddings = await prisma.wedding.findMany({
      take: 50,
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    dynamicWeddings = publishedWeddings.map((w) => ({
      url: `${baseUrl}/invitation/${w.slug}`,
      lastModified: w.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (err) {
    console.warn("[SITEMAP] Failed to query dynamic weddings from DB:", err);
  }

  return [...staticRoutes, ...demoRoutes, ...dynamicWeddings];
}
