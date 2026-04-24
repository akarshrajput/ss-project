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
          "/song/",
          "/services",
          "/about",
          "/pricing",
          "/faq",
          "/contact",
          "/features"
        ],
        disallow: ["/dashboard", "/library", "/account", "/login", "/register", "/admin/", "/api/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
