import Link from "next/link";
import Script from "next/script";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Singify Features: Text to Song Generator AI",
  description: "Discover Singify platform features for text to song generation, text to song converter online free, text to rap song creation, text to audio song, and text to speech songs.",
  path: "/features",
  keywords: [
    "text to song generator",
    "text to song converter",
    "text to song ai",
    "text to song maker",
    "text to rap song",
    "text to audio song",
    "text to speech songs",
    "convert text to song",
  ],
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
      {/* Smartlink */}
      <a href="https://www.profitablecpmratenetwork.com/jj4qu1yn?key=f11165f2ce85aad6894ab21301a2e5de" style={{ display: "none" }} aria-hidden="true">Partner Link</a>
      {/* Native Banner */}
      <Script
        async
        data-cfasync="false"
        src="https://pl29271017.profitablecpmratenetwork.com/76b5ed1f0b9e813346305b441291dffb/invoke.js"
        strategy="afterInteractive"
      />
      <div id="container-76b5ed1f0b9e813346305b441291dffb" />
      {/* Adsterra Banner 320x50 */}
      <Script id="adsterra-banner-opts" strategy="afterInteractive">{`
        atOptions = {
          'key': 'fbba0aa8f5128c15c1f80c9627941ec7',
          'format': 'iframe',
          'height': 50,
          'width': 320,
          'params': {}
        };
      `}</Script>
      <Script
        src="//www.highperformanceformat.com/fbba0aa8f5128c15c1f80c9627941ec7/invoke.js"
        strategy="afterInteractive"
      />


      {/* Header */}
      <div style={{ maxWidth: 640, marginBottom: "3.5rem" }}>
        <p className="section-eyebrow mb-3">Features</p>
        <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "2.5rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.15 }}>
          Production-focused features for AI audio
        </h1>
        <p style={{ marginTop: "1rem", fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
          Singify combines speech and music generation in one environment, with controls designed for consistent output and faster iteration. As a <strong style={{ color: "var(--text-primary)" }}>text to song generator</strong> and <strong style={{ color: "var(--text-primary)" }}>text to song converter</strong>, our tools let you convert text to song in seconds.
        </p>
        <p style={{ marginTop: "1rem", fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
          Whether you are a developer looking to integrate audio into an application, a creator needing background scores, or a business automating voiceovers, our <strong style={{ color: "var(--text-primary)" }}>text to song AI</strong> platform provides the tools to do it efficiently. Use it as a <strong style={{ color: "var(--text-primary)" }}>text to song maker</strong>, <strong style={{ color: "var(--text-primary)" }}>text to rap song</strong> creator, or <strong style={{ color: "var(--text-primary)" }}>text to audio song</strong> generator.
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
        <Link href="/" prefetch={false} className="btn-primary" style={{ textDecoration: "none" }}>Try Studio</Link>
        <Link href="/services" prefetch={false} className="btn-secondary" style={{ textDecoration: "none" }}>Explore Services</Link>
      </div>

      <section style={{ maxWidth: 860, marginTop: "2.25rem" }}>
        <div className="glass-card" style={{ padding: "1.75rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.65rem" }}>
            Why these capabilities matter
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
            The feature set is intentionally practical: it supports repeatable generation, clear output controls, and a path from first draft to saved library asset. That makes the platform easier to evaluate for both solo creators and internal teams.
          </p>
        </div>
      </section>

      {/* SEO Content: Impact Section */}
      <section style={{ maxWidth: 860, marginTop: "2rem" }}>
        <div className="glass-card" style={{ padding: "1.75rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.65rem" }}>
            How to Use These Features for Maximum Impact
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "1rem" }}>
            To get the most out of Singify, we recommend experimenting with different prompt tags and mood settings. Our platform is designed to respond dynamically to your inputs. For example, combining a specific genre like "Lo-fi" with a mood like "Relaxed" will yield a very different result than using "Lo-fi" with "Energetic".
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
            Don't hesitate to use the Vibe Lock feature once you find a sound you like. This allows you to maintain consistency across multiple tracks, which is ideal for creating a cohesive album or background music for a video series. Our metadata indexing makes it easy to find these saved settings in your library later.
          </p>
        </div>
      </section>
      <section style={{ maxWidth: 860, marginTop: "2rem" }}>
        <div className="glass-card" style={{ padding: "1.75rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.85rem" }}>Building a Consistent Audio Brand with Singify</h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: "0.85rem" }}>
            One of the most underused capabilities of our <strong style={{ color: "var(--text-primary)" }}>text to song generator</strong> is the seed control system. When you find a vocal style, instrumental arrangement, or production quality that fits your brand, you can pin that seed and reproduce it across future generations. This is how content creators build a consistent sonic identity — the same warmth, the same energy, the same feel — across every piece of audio they publish.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: "0.85rem" }}>
            Consistent audio branding is increasingly important in a crowded content landscape. Audiences recognize and trust creators whose output sounds coherent and intentional. With our <strong style={{ color: "var(--text-primary)" }}>text to song AI</strong>, you can produce that consistency without hiring a composer or sound designer — the AI handles the creative execution while you focus on the concept and the message.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85 }}>
            The metadata indexing feature makes this even more powerful over time. Every generation is tagged with your prompt parameters, so you can search your library by genre, mood, or keyword and instantly find the settings that produced your best work. This turns your generation history into a searchable knowledge base — a reference library of what works for your specific creative style.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 860, marginTop: "1.25rem" }}>
        <div className="glass-card" style={{ padding: "1.75rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.85rem" }}>From Free to Professional: Scaling Your Audio Production</h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: "0.85rem" }}>
            Singify is designed to grow with you. The free tier lets you experiment with every feature of our <strong style={{ color: "var(--text-primary)" }}>text to song converter</strong> without any commitment. Guest access means you can generate your first track in under a minute — no account, no credit card, no onboarding. That zero-friction entry point is intentional: we want you to experience the quality of our AI before you decide whether to create an account.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: "0.85rem" }}>
            As your needs grow, the authenticated experience adds library storage, one-click downloads, and generation history. These features transform Singify from a quick creative tool into a full production asset manager. Your generated audio is organized, retrievable, and ready to be dropped into any project at any time.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85 }}>
            For professional teams and enterprise deployments, we offer custom integration support, higher throughput limits, and dedicated account management. Whether you are producing audio for a media company, a game studio, or a global marketing campaign, our platform scales to meet the demand. The same core <strong style={{ color: "var(--text-primary)" }}>text to song maker</strong> technology powers every tier — you just get more control and capacity as you scale.
          </p>
        </div>
      </section>
    </main>
  );
}
