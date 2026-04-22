import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Platform Features",
  description: "Discover Songify platform features for text to audio, speech tone control, AI music generation, and workflow-friendly asset management.",
  path: "/features",
});

const features = [
  {
    category: "Generation",
    items: [
      { icon: "🎛️", title: "Prompt & Mood Controls", desc: "Tune genre, mood, tone, structure, and energy for repeatable, consistent output quality across all sessions." },
      { icon: "🎵", title: "Speech & Music Workflows", desc: "Create spoken audio, tonal narration, and full AI music tracks — all from a single unified interface." },
      { icon: "🌐", title: "Multi-language Support", desc: "Generate audio in English, Hindi, Spanish, French, German and more, with regional accent options." },
    ],
  },
  {
    category: "Studio",
    items: [
      { icon: "🔬", title: "Tag Preview System", desc: "See exactly what prompt tags will be submitted before generation — enabling fast iteration and debugging." },
      { icon: "🔁", title: "Vibe Lock / Seed Control", desc: "Pin a seed to reproduce a successful output or explore variations without losing your best results." },
      { icon: "🎼", title: "Key, BPM & Structure", desc: "Control musical fundamentals like key signature, tempo, time signature, and arrangement structure." },
    ],
  },
  {
    category: "Storage & Access",
    items: [
      { icon: "🔐", title: "Authenticated Storage", desc: "Generated files and metadata are saved in a private, user-scoped library with instant playback access." },
      { icon: "⬇️", title: "One-click Downloads", desc: "Download your tracks as MP3 files with a single click — no re-generation needed from your library." },
      { icon: "🏷️", title: "Metadata Indexing", desc: "Every generation is tagged with genre, mood, and prompt data for easier search and project management." },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <main className="site-container w-full flex-1 flex-col px-4 py-16 sm:px-6 lg:px-8">

      {/* Header */}
      <div style={{ maxWidth: 640, marginBottom: "3.5rem" }}>
        <p className="section-eyebrow mb-3">Features</p>
        <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "2.5rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.15 }}>
          Production-focused features for AI audio
        </h1>
        <p style={{ marginTop: "1rem", fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
          Songify combines speech and music generation in one environment, with controls designed for consistent output and faster iteration.
        </p>
      </div>

      {/* Feature groups */}
      <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
        {features.map((group) => (
          <div key={group.category}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent-violet)", marginBottom: "1.25rem" }}>
              {group.category}
            </p>
            <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
              {group.items.map((item) => (
                <div key={item.title} className="glass-card glass-card-glow" style={{ padding: "1.5rem" }}>
                  <span style={{ fontSize: "1.75rem", display: "block", marginBottom: "0.75rem" }}>{item.icon}</span>
                  <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                    {item.title}
                  </h2>
                  <p style={{ fontSize: "0.83rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "3rem" }}>
        <Link href="/studio" prefetch={false} className="btn-primary" style={{ textDecoration: "none" }}>Try Studio</Link>
        <Link href="/services" prefetch={false} className="btn-secondary" style={{ textDecoration: "none" }}>Explore Services</Link>
      </div>
    </main>
  );
}
