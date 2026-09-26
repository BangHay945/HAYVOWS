import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "https://hayvows.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/invitation/",
          "/display/",
          "/login",
          "/register",
          "/forgot-password",
        ],
        disallow: [
          "/dashboard/",
          "/api/",
          "/_next/",
          "/admin/",
        ],
      },
      {
        // Berikan akses terarah untuk AI search bots (ChatGPT Search, Perplexity, Google AI, Claude)
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "Google-Extended",
          "PerplexityBot",
          "ClaudeBot",
          "anthropic-ai",
          "Bytespider",
        ],
        allow: [
          "/",
          "/invitation/",
          "/display/",
        ],
        disallow: [
          "/dashboard/",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
