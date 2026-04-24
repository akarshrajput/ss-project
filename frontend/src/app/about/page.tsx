import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: "Learn about Songify, a professional AI audio platform focused on text-to-audio, controllable speech, and artist-free music generation.",
  path: "/about",
});

const values = [
  { icon: "⚙️", title: "Controllable Output", desc: "Every generation is tunable — genre, mood, vocal style, and structure are all first-class controls, not afterthoughts." },
  { icon: "🔁", title: "Reproducibility", desc: "Seed-based generation lets you recreate successful outputs and iterate without losing your best results." },
  { icon: "🚀", title: "Production Reliability", desc: "Built for teams who need consistent audio that moves from concept to publication with minimal manual steps." },
];

export default function AboutPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ]);

  return (
    <main className="site-container w-full flex-1 flex-col px-4 py-16 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbSchema} />

      <div style={{ maxWidth: 680, marginBottom: "3rem" }}>
        <p className="section-eyebrow mb-3">About</p>
        <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "2.5rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.15 }}>
          Built for fast, controllable audio generation
        </h1>
        <p style={{ marginTop: "1.25rem", fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
          Songify is built for teams and creators who need fast, controllable audio generation without sacrificing
          quality. Our platform combines text to speech, tone-driven narration, and AI music generation into one
          production-ready workflow.
        </p>
        <p style={{ marginTop: "1rem", fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
          We focus on practical output quality, reproducibility, and operational reliability so generated audio can
          move from concept to publication with fewer manual steps.
        </p>
        <p style={{ marginTop: "1rem", fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
          The product is intentionally broad enough for creators and teams, but narrow enough that the core use case stays clear: turn text into useful audio without forcing users through a heavy learning curve.
        </p>
      </div>

      {/* Values */}
      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", maxWidth: 860 }}>
        {values.map((v) => (
          <div key={v.title} className="glass-card glass-card-glow" style={{ padding: "1.5rem" }}>
            <span style={{ fontSize: "1.75rem", display: "block", marginBottom: "0.75rem" }}>{v.icon}</span>
            <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.5rem" }}>{v.title}</h2>
            <p style={{ fontSize: "0.83rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>{v.desc}</p>
          </div>
        ))}
      </div>

      <section style={{ maxWidth: 860, marginTop: "2.25rem" }}>
        <div className="glass-card" style={{ padding: "1.75rem" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.65rem" }}>
            How we think about the product
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
            Songify is designed to make generated audio practical, not experimental. That means clean routes, stable metadata, useful copy on each page, and internal links that help both humans and search engines navigate the product.
          </p>
        </div>
      </section>
      <section style={{ maxWidth: 860, marginTop: "3rem", display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        <div className="glass-card" style={{ padding: "1.75rem" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.85rem" }}>
            Company Information
          </h2>
          <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
            NovaVision Consulting FZCO<br />
            Dubai Digital Park<br />
            Dubai Silicon Oasis<br />
            Dubai, UAE
          </div>
          <div style={{ marginTop: "1.25rem" }}>
            <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.4rem" }}>Contact</h3>
            <a href="mailto:contact@Novavision-strategy.com" style={{ fontSize: "0.85rem", color: "#6366f1", textDecoration: "underline" }}>
              contact@Novavision-strategy.com
            </a>
          </div>
        </div>

        <div className="glass-card" style={{ padding: "1.75rem" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.85rem" }}>
            Liability Notice
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.75 }}>
            Songify provides AI-powered song generation and audio production tools. All generated content is provided for creative and entertainment purposes. Use is at your own risk. We do not guarantee the copyright status, uniqueness, or accuracy of the generated audio tracks and lyrics.
          </p>
        </div>
      </section>
    </main>
  );
}
