import type { Metadata } from "next";
import Script from "next/script";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { JSONLD } from "@/components/json-ld";
import { absoluteUrl, siteConfig } from "@/lib/seo";
import { PageviewTracker } from "@/components/pageview-tracker";
import { PromoPopup } from "@/components/ui/promo-popup";
import "./globals.css";

const deploymentVersion = Date.now().toString();

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Songify | AI Text to Audio & Music Generation Platform",
    template: "%s | Songify",
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
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
    google: ["-yzuAlZ4A0mkD6E27JJXkhRS2J6E-hqmOYoPkz-jN04", "imv8oXJGrRVcO0YW2Qa_12naEilosYhoECUOK1RuCh8"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <meta name="deployment-version" content={deploymentVersion} />
                {/* Popunder — disabled (blocks click events sitewide) */}
        {/* <Script
          src="https://pl29271015.profitablecpmratenetwork.com/14/8c/bb/148cbbba0250227fb706c1c9ebf0d73c.js"
          strategy="afterInteractive"
        /> */}
        <meta name="admaven-placement" content="Bqjs5rdCF" />
        <JSONLD />
      </head>
      <body style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)" }}>
        <PageviewTracker />
        <div className="app-bg">
        </div>
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
          <PromoPopup />
        </div>
        {/* Social Bar — disabled (can intercept pointer events) */}
        {/* <Script
          src="https://pl29271018.profitablecpmratenetwork.com/7c/86/9b/7c869bac101a892809e03fa99d34fb9a.js"
          strategy="lazyOnload"
        /> */}
      </body>
    </html>
  );
}
