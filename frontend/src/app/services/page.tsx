import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { buildBreadcrumbSchema, buildServiceListSchema } from "@/lib/structured-data";
import { servicePages } from "@/lib/services";

export const metadata: Metadata = buildMetadata({
  title: "AI Audio Services",
  description: "Explore Songify services including text to speech, AI music generation, voice generation, poem to audio, and speech tone tools.",
  path: "/services",
});

const icons: Record<string, string> = {
  "text-to-speech": "🎙️",
  "ai-music-generation": "🎵",
  "voice-generation": "🔊",
  "poem-to-audio": "📜",
  "speech-tone-tools": "🎚️",
};

const accents: Record<string, string> = {
  "text-to-speech": "#6366f1",
  "ai-music-generation": "#2dd4bf",
  "voice-generation": "#a855f7",
  "poem-to-audio": "#f59e0b",
  "speech-tone-tools": "#ec4899",
};

export default function ServicesPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
  ]);
  const serviceListSchema = buildServiceListSchema();

  return (
    <main className="site-container w-full flex-1 flex-col px-4 py-16 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={serviceListSchema} />

      <div style={{ maxWidth: 620, marginBottom: "3rem" }}>
        <p className="section-eyebrow mb-3">Services</p>
        <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "2.5rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.15 }}>
          AI audio services for modern teams
        </h1>
        <p style={{ marginTop: "1rem", fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
          Purpose-built workflows for speech, tone control, music, and narration — each optimized for a specific use case.
        </p>
      </div>

      <section style={{ display: "grid", gap: "1.25rem", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {servicePages.map((service) => {
          const icon = icons[service.slug] ?? "🎵";
          const accent = accents[service.slug] ?? "#6366f1";
          return (
            <article key={service.slug} className="glass-card glass-card-glow" style={{ padding: "1.75rem" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${accent}16`, border: `1px solid ${accent}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", marginBottom: "1rem" }}>
                {icon}
              </div>
              <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                {service.name}
              </h2>
              <p style={{ fontSize: "0.83rem", color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: "1.25rem" }}>
                {service.description}
              </p>
              <Link
                href={`/services/${service.slug}`}
                prefetch={false}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.8rem", fontWeight: 600, color: accent, textDecoration: "none", transition: "opacity 150ms ease" }}
              >
                View service
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
              </Link>
            </article>
          );
        })}
      </section>
    </main>
  );
}
