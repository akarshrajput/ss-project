import type { Metadata } from "next";

export const siteConfig = {
  name: "Songify",
  shortName: "Songify",
  description:
    "Songify is the best text to song generator, text to song converter online free, and text to song AI platform. Convert text to song, text to rap song, or text to audio song instantly.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_US",
  twitterHandle: "@songify",
  keywords: [
    "text to song generator",
    "text to song",
    "text to song ai",
    "text to song ai free",
    "text to song generator free",
    "text to song converter",
    "text to song converter online free",
    "text to song maker",
    "text to song free",
    "text to song free online",
    "song to text converter",
    "song lyrics to text",
    "song to text",
    "convert text to song",
    "text to song creator",
    "text to song online",
    "text to song app",
    "text to rap song",
    "convert text to rap song",
    "text to speech songs",
    "text to song converter online",
    "text to audio song",
    "ai song generator",
    "ai music generator",
    "ai song maker",
    "song maker",
    "ai music maker",
    "free ai music generator",
    "how to write a song text",
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
