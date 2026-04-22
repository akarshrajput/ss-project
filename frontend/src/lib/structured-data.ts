import { absoluteUrl, siteConfig } from "@/lib/seo";

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildServiceListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Songify AI Audio Services",
    itemListElement: [
      { "@type": "ListItem", position: 1, url: absoluteUrl("/services/text-to-speech"), name: "Text to Speech" },
      {
        "@type": "ListItem",
        position: 2,
        url: absoluteUrl("/services/ai-music-generation"),
        name: "AI Music Generation",
      },
      {
        "@type": "ListItem",
        position: 3,
        url: absoluteUrl("/services/voice-generation"),
        name: "Voice Generation",
      },
      { "@type": "ListItem", position: 4, url: absoluteUrl("/services/poem-to-audio"), name: "Poem to Audio" },
      {
        "@type": "ListItem",
        position: 5,
        url: absoluteUrl("/services/speech-tone-tools"),
        name: "Speech Tone Tools",
      },
    ],
  };
}

export function buildServiceSchema(params: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: absoluteUrl("/"),
    },
    serviceType: params.name,
    name: `${params.name} - ${siteConfig.name}`,
    description: params.description,
    url: absoluteUrl(params.path),
    areaServed: "Worldwide",
  };
}

export function buildFaqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
