import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/dashboard/",
          "/login/",
          "/signup/",
          "/customize/",
        ],
      },
      // Allow AI Search & Citation crawlers to index and cite WedInvites
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "PerplexityBot",
          "ClaudeBot",
          "Google-Extended",
          "Applebot",
          "Bingbot",
        ],
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/dashboard/",
          "/login/",
          "/signup/",
          "/customize/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
