import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

const TEMPLATE_SLUGS = [
  "celestial-rose",
  "imperial-palace",
  "royal-majesty",
  "royal-heritage",
  "royal-grace",
  "rose-gold-blush",
  "noor-e-nikah",
  "emerald-qasr",
  "gul-e-noor",
  "azure-nikah",
  "kitab-e-nikah",
  "crimson-royale",
  "royal-lotus",
  "emerald-noir",
  "royal-elegance",
  "modern-minimal",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const now = new Date();

  // Core Landing Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
      images: [`${baseUrl}/images/hero-bg.png`],
    },
    {
      url: `${baseUrl}/templates`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
      images: [`${baseUrl}/images/hero-bg.png`],
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/affiliate`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      url: `${baseUrl}/shipping`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Template Preview Pages
  const templateRoutes: MetadataRoute.Sitemap = TEMPLATE_SLUGS.map((slug) => ({
    url: `${baseUrl}/preview/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...templateRoutes];
}
