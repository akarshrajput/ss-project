import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { buildBreadcrumbSchema, buildServiceListSchema } from "@/lib/structured-data";
import { servicePages } from "@/lib/services";
import { AdsterraBanner } from "@/components/ads/adsterra-banner";

export const metadata: Metadata = buildMetadata({
  title: "Singify: AI Audio Services & Text to Song",
  description: "Explore Singify services: text to song generator, text to song converter online free, text to rap song, text to audio song, text to speech songs, and voice generation tools.",
  path: "/services",
  keywords: [
    "text to song generator",
    "text to song converter",
    "text to song converter online free",
    "text to speech songs",
    "text to audio song",
    "text to rap song",
    "convert text to song",
    "text to song ai",
  ],
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
          Purpose-built workflows for speech, tone control, music, and narration — each optimized for a specific use case. Our <strong style={{ color: "var(--text-primary)" }}>text to song generator</strong> and <strong style={{ color: "var(--text-primary)" }}>text to song converter online free</strong> tools power every service.
        </p>
        <p style={{ marginTop: "0.85rem", fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.75 }}>
          Each service page explains the practical output, common use cases, and how teams can integrate Singify into real production workflows. From <strong style={{ color: "var(--text-primary)" }}>text to speech songs</strong> to <strong style={{ color: "var(--text-primary)" }}>text to rap song</strong> creation, from <strong style={{ color: "var(--text-primary)" }}>text to audio song</strong> generation to full AI music production — every workflow is covered.
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
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
              </Link>
            </article>
          );
        })}
      </section>

      <AdsterraBanner type="728x90" className="mt-10 max-w-[740px]" />

      <section style={{ maxWidth: 740, marginTop: "2.5rem" }}>
        <div className="glass-card" style={{ padding: "1.75rem" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.65rem" }}>
            Why these pages exist
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
            The service routes are designed to be stable landing pages with their own metadata, structured data, and internal links. That helps crawlers understand the product surface without depending on a redirect to another page.
          </p>
        </div>
      </section>

      {/* SEO Content: Comprehensive Solutions Section */}
      <section style={{ maxWidth: 740, marginTop: "2rem" }}>
        <div className="glass-card" style={{ padding: "1.75rem" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.65rem" }}>
            Comprehensive AI Audio Solutions
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "1rem" }}>
            At Singify, we believe that high-quality audio should be accessible to everyone. Our suite of services is designed to cover all aspects of audio production, from the spoken word to full musical compositions. By breaking down the barriers of traditional production, we empower creators to focus on what matters most: their ideas.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
            Whether you are looking to create a quick voiceover for a demo or a complete soundtrack for a game, our tools are built to scale with your needs. We use advanced machine learning models that are continuously updated to provide the best possible quality and speed.
          </p>
        </div>
      </section>
      <section style={{ maxWidth: 740, marginTop: "2rem" }}>
        <div className="glass-card" style={{ padding: "1.75rem" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.85rem" }}>How to Choose the Right Service for Your Project</h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: "0.85rem" }}>
            If you are just getting started with AI audio, the best approach is to think about your end goal first. Do you need a full song with vocals and instrumentation? Our <strong style={{ color: "var(--text-primary)" }}>text to song generator</strong> and AI Music Generation service is the right starting point. Do you need a professional voiceover or narration? Our Text to Speech service offers tone controls that match formal, casual, and dramatic delivery styles.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: "0.85rem" }}>
            For creative writers and poets, the Poem to Audio service is purpose-built to preserve the rhythm and emotional weight of written verse. For social media creators, the Voice Generation service lets you create consistent, recognizable audio personas that your audience will associate with your brand. And for anyone who needs fine-grained control over how speech is delivered, the Speech Tone Tools service provides the nuance that standard TTS engines miss.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85 }}>
            All of these services are accessible through the same platform and share the same core generation infrastructure. That means switching between workflows is fast — you do not need to re-learn a new interface or re-upload assets. Everything you create is saved to your library and can be referenced across projects. Our unified approach to <strong style={{ color: "var(--text-primary)" }}>text to audio song</strong> generation, speech production, and music creation is what makes Singify a comprehensive solution rather than a collection of disconnected tools.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 740, marginTop: "1.25rem" }}>
        <div className="glass-card" style={{ padding: "1.75rem" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.85rem" }}>Use Cases Across Industries</h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: "0.85rem" }}>
            Our <strong style={{ color: "var(--text-primary)" }}>text to speech songs</strong> and music generation tools are used across a wide range of industries. E-learning companies use our TTS service to produce course narration in multiple languages. Game developers use our AI Music Generation service to create adaptive soundtracks that respond to gameplay events. Content creators on YouTube, TikTok, and Instagram use our <strong style={{ color: "var(--text-primary)" }}>text to song converter online free</strong> to produce unique background music without licensing costs.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: "0.85rem" }}>
            Advertising agencies use our voice generation tools to prototype commercials before committing to studio recording sessions. Authors and publishers use Poem to Audio to create audio editions of poetry collections. Therapists and meditation coaches use our tone-controlled TTS to produce relaxation guides with exactly the right pacing and warmth. The versatility of our platform means that no matter your industry, there is a workflow that fits your needs.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85 }}>
            If your use case is not listed here, reach out. We regularly add new service templates based on how our users are actually using the platform, and we are always interested in supporting novel applications of <strong style={{ color: "var(--text-primary)" }}>text to rap song</strong>, speech synthesis, and AI music generation technology.
          </p>
        </div>
      </section>
    </main>
  );
}
