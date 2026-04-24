import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { listCompletedSongs } from "@/lib/song-queue-store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static routes
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

  // Dynamic routes (Individual Songs)
  try {
    const latestSongs = await listCompletedSongs({ limit: 100 });
    const songRoutes: MetadataRoute.Sitemap = latestSongs.map((song) => ({
      url: absoluteUrl(`/song/${song.songId}`),
      lastModified: song.completedAt ? new Date(song.completedAt) : now,
      changeFrequency: "monthly",
      priority: 0.6,
    }));
    return [...routes, ...songRoutes];
  } catch {
    return routes;
  }
}
