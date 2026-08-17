import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata({
  title: "About Singify — Free Text to Song Generator & AI Song Maker",
  description: "Learn about Singify, the leading text to song generator and text to song converter online free. Our text to song AI platform lets you convert text to song, text to rap song, and text to audio song instantly.",
  path: "/about",
  keywords: [
    "text to song generator",
    "text to song",
    "text to song ai",
    "convert text to song",
    "text to song maker",
    "text to song converter",
    "text to audio song",
  ],
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
          Singify is the ultimate <strong style={{ color: "var(--text-primary)" }}>text to song generator</strong> built for teams and creators who need fast, controllable audio generation without sacrificing
          quality. Our <strong style={{ color: "var(--text-primary)" }}>text to song AI</strong> platform combines text to speech, tone-driven narration, and AI music generation into one
          production-ready workflow. <strong style={{ color: "var(--text-primary)" }}>Convert text to song</strong> in seconds.
        </p>
        <p style={{ marginTop: "1rem", fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
          We focus on practical output quality, reproducibility, and operational reliability so generated audio can
          move from concept to publication with fewer manual steps.
        </p>
        <p style={{ marginTop: "1rem", fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
          The product is intentionally broad enough for creators and teams, but narrow enough that the core use case stays clear: use our <strong style={{ color: "var(--text-primary)" }}>text to song converter online free</strong> to turn text into useful audio without forcing users through a heavy learning curve. Whether you need a <strong style={{ color: "var(--text-primary)" }}>text to song maker</strong>, a <strong style={{ color: "var(--text-primary)" }}>text to rap song</strong> creator, or a <strong style={{ color: "var(--text-primary)" }}>text to audio song</strong> tool, Singify delivers.
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
            Singify is designed to make generated audio practical, not experimental. That means clean routes, stable metadata, useful copy on each page, and internal links that help both humans and search engines navigate the product.
          </p>
        </div>
      </section>

      {/* SEO Content: Technology Section */}
      <section style={{ maxWidth: 860, marginTop: "2.25rem" }}>
        <div className="glass-card" style={{ padding: "1.75rem" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.65rem" }}>
            The Technology Behind Singify
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "1rem" }}>
            Singify utilizes state-of-the-art neural networks and machine learning models to analyze text and synthesize high-quality audio. Our systems are trained on diverse datasets to understand rhythm, melody, and linguistic nuances, allowing them to create realistic vocals and rich instrumental tracks.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
            We are constantly iterating on our models to improve generation speed and quality. Our goal is to provide a seamless bridge between written ideas and polished audio outputs, making professional-grade sound creation accessible to everyone.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 860, marginTop: "2rem", display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        <div className="glass-card" style={{ padding: "1.75rem" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.85rem" }}>
            Contact Us
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "1rem" }}>
            Have questions, feedback, or need help with Singify? Reach out to our team directly.
          </p>
          <div>
            <a href="mailto:contact@singify.fun" style={{ fontSize: "0.9rem", color: "#6366f1", textDecoration: "underline", fontWeight: 600 }}>
              contact@singify.fun
            </a>
          </div>
        </div>

        <div className="glass-card" style={{ padding: "1.75rem" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.85rem" }}>
            Liability Notice
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.75 }}>
            Singify provides AI-powered song generation and audio production tools. All generated content is provided for creative and entertainment purposes. Use is at your own risk. We do not guarantee the copyright status, uniqueness, or accuracy of the generated audio tracks and lyrics.
          </p>
        </div>
      </section>
      <section style={{ maxWidth: 860, marginTop: "2rem" }}>
        <div className="glass-card" style={{ padding: "1.75rem" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.85rem" }}>Our Mission: Making Music Creation Accessible to Everyone</h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: "0.85rem" }}>
            Singify was founded on a simple belief: creating music should not require years of training, expensive equipment, or a professional studio. Our <strong style={{ color: "var(--text-primary)" }}>text to song generator</strong> removes every barrier between an idea and a finished track. You write the words — our AI handles the melody, harmony, rhythm, and production. The result is a fully produced song, ready to share or download, in seconds.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: "0.85rem" }}>
            We built Singify as a <strong style={{ color: "var(--text-primary)" }}>text to song converter online free</strong> tool because we wanted the barrier to entry to be zero. No software to install. No account required to try it. No credit card. You visit the site, type your idea, and generate. That philosophy — free, instant, no friction — is built into every decision we make about the product.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: "0.85rem" }}>
            Over time, we have expanded from a simple <strong style={{ color: "var(--text-primary)" }}>text to song maker</strong> into a full AI audio platform. You can <strong style={{ color: "var(--text-primary)" }}>convert text to song</strong> in dozens of genres, generate <strong style={{ color: "var(--text-primary)" }}>text to rap song</strong> outputs with real cadence and flow, or produce <strong style={{ color: "var(--text-primary)" }}>text to audio song</strong> tracks for podcasts, videos, games, and presentations. Every feature is designed to serve real creative workflows, not just impressive demos.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85 }}>
            Our team is composed of engineers, musicians, and product designers who understand both the technical side of AI music generation and the practical needs of creators. We constantly collect feedback, run experiments, and ship improvements. The platform you use today is faster, more accurate, and more controllable than it was six months ago — and the same will be true six months from now.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 860, marginTop: "1.25rem" }}>
        <div className="glass-card" style={{ padding: "1.75rem" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.85rem" }}>Why Creators Choose Singify</h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: "0.85rem" }}>
            There are many AI music tools available today, but Singify stands apart because it is built around the creative workflow, not the technology showcase. When you use our <strong style={{ color: "var(--text-primary)" }}>text to song AI</strong>, you are not just running a model — you are working inside a system designed to help you iterate quickly, reproduce great results, and understand what settings produce the output you want.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: "0.85rem" }}>
            Genre diversity is one of our strongest differentiators. Whether you need a melancholic indie ballad, an upbeat pop anthem, a hard-hitting hip-hop track, or ambient electronic music for focus work, our <strong style={{ color: "var(--text-primary)" }}>text to song creator</strong> engine adapts to your intent. The AI reads not just the words but the emotional context, adjusting instrumentation, vocal style, and tempo accordingly.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85 }}>
            We are also committed to transparency. Our pricing is clear, our terms are readable, and our privacy policy is written for humans, not just lawyers. When you generate a song with Singify, you own the creative output. Our <strong style={{ color: "var(--text-primary)" }}>text to song free online</strong> tier gives you full access to generation and browser playback. Premium features like library storage and high-priority processing are available on paid plans as they roll out.
          </p>
        </div>
      </section>
    </main>
  );
}
