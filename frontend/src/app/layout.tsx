import type { Metadata } from "next";
import Script from "next/script";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { JSONLD } from "@/components/json-ld";
import { absoluteUrl, siteConfig } from "@/lib/seo";
import { PageviewTracker } from "@/components/pageview-tracker";
import { PromoPopup } from "@/components/ui/promo-popup";
import { SideBanners } from "@/components/ads/side-banners";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const deploymentVersion = Date.now().toString();

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Singify | AI Text to Audio & Music Generation Platform",
    template: "%s | Singify",
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  openGraph: {
    type: "website",
    title: "Singify | AI Text to Audio & Music Generation Platform",
    description: siteConfig.description,
    url: absoluteUrl("/"),
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [
      {
        url: absoluteUrl("/opengraph-image"),
        width: 1200,
        height: 630,
        alt: "Singify AI audio platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Singify | AI Text to Audio & Music Generation Platform",
    description: siteConfig.description,
    creator: siteConfig.twitterHandle,
    images: [absoluteUrl("/twitter-image")],
  },
  robots: {
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
  category: "technology",
  applicationName: siteConfig.name,
  icons: {
    icon: [{ url: "/favicon.ico" }],
    shortcut: [{ url: "/favicon.ico" }],
    apple: [{ url: "/favicon.ico" }],
  },
  manifest: "/manifest.webmanifest",
  verification: {
    google: [
      "-yzuAlZ4A0mkD6E27JJXkhRS2J6E-hqmOYoPkz-jN04",
      "imv8oXJGrRVcO0YW2Qa_12naEilosYhoECUOK1RuCh8",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <meta name="deployment-version" content={deploymentVersion} />
        <JSONLD />
        {/* Adsterra Popunder for singify.fun */}
        <Script
          id="adsterra-popunder"
          src="https://pl30889662.effectivecpmnetwork.com/ec/7c/fd/ec7cfd75b0d6341a3f33e81a1fbb8e3c.js"
          strategy="afterInteractive"
        />
      </head>
      <body
        style={{
          minHeight: "100vh",
          background: "var(--bg-base)",
          color: "var(--text-primary)",
        }}
      >
        <PageviewTracker />
        <div className="app-bg"></div>
        {/* Left & Right Side Desktop Display Banners */}
        <SideBanners />
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
        <Analytics />

        {/* Adsterra Social Bar (High CPM Interactive Bar) */}
        <Script
          id="adsterra-social-bar"
          src="https://pl30889665.effectivecpmnetwork.com/64/68/a3/6468a3999b00f04832d1678227cea516.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
