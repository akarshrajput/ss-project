import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { JSONLD } from "@/components/json-ld";
import { absoluteUrl, siteConfig } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Songify | AI Text to Audio & Music Generation Platform",
    template: "%s | Songify",
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    title: "Songify | AI Text to Audio & Music Generation Platform",
    description: siteConfig.description,
    url: absoluteUrl("/"),
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: "Songify AI audio platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Songify | AI Text to Audio & Music Generation Platform",
    description: siteConfig.description,
    creator: siteConfig.twitterHandle,
    images: [absoluteUrl("/twitter-image")],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  category: "technology",
  applicationName: siteConfig.name,
  icons: { icon: [{ url: "/favicon.ico" }], shortcut: [{ url: "/favicon.ico" }], apple: [{ url: "/favicon.ico" }] },
  manifest: "/manifest.webmanifest",
  verification: {
    google: "-yzuAlZ4A0mkD6E27JJXkhRS2J6E-hqmOYoPkz-jN04",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <JSONLD />
      </head>
      <body style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)" }}>
        <div className="app-bg">
          <div className="app-bg-grid" />
        </div>
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
