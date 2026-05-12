import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/studio",
          "/explore",
          "/services",
          "/about",
          "/pricing",
          "/faq",
          "/contact",
          "/features",
          "/terms",
          "/privacy",
          "/impressum",
          "/song/",
        ],
        disallow: ["/dashboard", "/library", "/account", "/login", "/register", "/admin/", "/api/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
