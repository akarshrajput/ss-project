import { siteConfig } from "@/lib/seo";

export function JSONLD() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteConfig.name,
    "alternateName": [siteConfig.name, "Songify.fun", "Songify AI"],
    "url": siteConfig.url,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteConfig.url}/studio?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteConfig.name,
    "url": siteConfig.url,
    "logo": `${siteConfig.url}/favicon.ico`,
    "sameAs": [
      // Add social links here if any
    ]
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteConfig.url
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Studio",
        "item": `${siteConfig.url}/studio`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Pricing",
        "item": `${siteConfig.url}/pricing`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Features",
        "item": `${siteConfig.url}/features`
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "About",
        "item": `${siteConfig.url}/about`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
    </>
  );
}
