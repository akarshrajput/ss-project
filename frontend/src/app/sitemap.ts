import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static routes — only pages that are reachable via internal HTML links.
  // Dynamic /song/* pages are excluded because the explore page renders
  // song links client-side, so crawlers cannot follow them reliably.
  // Including them in the sitemap without crawlable links causes
  // Semrush "orphaned page in sitemap" warnings.
  const routes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/explore"),
      lastModified: now,
      changeFrequency: "always",
      priority: 0.98,
    },
    {
      url: absoluteUrl("/studio"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: absoluteUrl("/features"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/pricing"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/services"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.88,
    },
    {
      url: absoluteUrl("/services/text-to-speech"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.84,
    },
    {
      url: absoluteUrl("/services/ai-music-generation"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.84,
    },
    {
      url: absoluteUrl("/services/voice-generation"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.82,
    },
    {
      url: absoluteUrl("/services/poem-to-audio"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/services/speech-tone-tools"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/faq"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: absoluteUrl("/contact"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.72,
    },
    {
      url: absoluteUrl("/impressum"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: absoluteUrl("/terms"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: absoluteUrl("/privacy"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  return routes;
}
