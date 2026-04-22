import type { Metadata } from "next";

export const siteConfig = {
  name: "Songify",
  shortName: "Songify",
  description:
    "Songify is an AI audio platform for text to speech, tone-based speech, poem to audio, and AI music generation without artists.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_US",
  twitterHandle: "@songify",
  keywords: [
    "text to song",
    "ai song generator",
    "ai music generator",
    "song lyrics generator",
    "lyric generator",
    "ai song maker",
    "song maker",
    "ai music maker",
    "lyrics generator",
    "song generator",
    "free ai music generator",
    "ai lyrics generator",
    "write as music",
    "top ai platform for songs lyrics",
    "top ai for lyrics for songs",
    "text to audio",
    "text to speech",
    "voice generation",
    "poem to audio",
    "ai audio platform",
  ],
};

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const base = siteConfig.url.endsWith("/") ? siteConfig.url.slice(0, -1) : siteConfig.url;
  return `${base}${normalizedPath}`;
}

type BuildMetadataParams = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path,
  keywords,
  noIndex = false,
}: BuildMetadataParams): Metadata {
  const canonical = absoluteUrl(path);

  return {
    title,
    description,
    keywords: keywords ?? siteConfig.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [
        {
          url: absoluteUrl("/opengraph-image"),
          width: 1200,
          height: 630,
          alt: "Songify AI audio generation platform",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      creator: siteConfig.twitterHandle,
      title,
      description,
      images: [absoluteUrl("/twitter-image")],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}
