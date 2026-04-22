import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { getComfyUiOnline } from "@/lib/app-store";
import { absoluteUrl, buildMetadata, siteConfig } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/structured-data";
import { SongDemoSection } from "@/components/ui/song-demo-section";
import { QuickGenerate } from "@/components/ui/quick-generate";

export const metadata: Metadata = buildMetadata({
  title: "Text to Song — Free AI Song Generator | Songify",
  description:
    "Turn any text into a song instantly. Free AI song generator — create lyrics, melodies and full songs from a prompt. The easiest AI music generator online.",
  path: "/",
  keywords: [
    "text to song",
    "ai song generator",
    "ai music generator",
    "song lyrics generator",
    "lyric generator",
    "ai song maker",
    "song maker",
    "ai music maker",
    "lyrics generator",
    "song generator",
    "free ai music generator",
    "ai lyrics generator",
    "write as music",
    "top ai platform for songs lyrics",
    "top ai for lyrics for songs",
  ],
});

/* ─── FAQ data ──────────────────────────────────────────────────────────── */
const faqs = [
  {
    question: "What is a text to song generator?",
    answer:
      "A text to song generator is an AI-powered tool that transforms any written prompt, idea, or lyrics into a complete song — including melody, rhythm, and vocals. Songify uses advanced AI music generation models to turn your words into fully produced audio tracks in seconds, no music experience required.",
  },
  {
    question: "Is this AI song generator free?",
    answer:
      "Yes — Songify is a free AI song generator for everyone. You can generate songs in guest mode without creating an account. Sign up for free to unlock downloads, save tracks to your library, and access higher quality generation. Premium plans are available for unlimited usage and advanced features.",
  },
  {
    question: "How does the AI lyrics generator work?",
    answer:
      "Our AI lyrics generator uses large language models trained on diverse song structures to craft rhyming, rhythmically-sound lyrics from your prompt. Simply describe your idea, theme, or emotion — the AI lyrics generator handles verse, chorus, and bridge structure automatically, giving you polished song lyrics in moments.",
  },
  {
    question: "Can I use this as a rap generator?",
    answer:
      "Absolutely. Songify doubles as a powerful rap generator — just select the Hip-Hop or Rap genre when generating. The AI song maker understands flow, cadence, and rhyme schemes, so you get bars that actually sound natural. You can also paste your own text and let the AI write as music around it.",
  },
  {
    question: "What makes this the best AI song maker?",
    answer:
      "Songify combines an industry-leading song lyrics generator with full AI music production in one seamless platform. Unlike other tools, you get complete songs — not just lyrics. Our AI song maker handles melody, instrumentation, vocals, and mastering together, making it the top AI platform for songs and lyrics from a single prompt.",
  },
];

/* ─── Feature cards ─────────────────────────────────────────────────────── */
const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    title: "Song Lyrics Generator",
    desc: "Describe any mood, theme, or storyline and our song lyrics generator writes polished verses, choruses, and bridges instantly — ready to record or share.",
    accent: "#6366f1",
    keyword: "song lyrics generator",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M8.46 8.46a5 5 0 0 0 0 7.07"/>
      </svg>
    ),
    title: "AI Song Maker",
    desc: "Go from blank page to complete track in under a minute. Our AI song maker combines lyrics, melody, and production into one seamless creative workflow.",
    accent: "#2dd4bf",
    keyword: "ai song maker",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
      </svg>
    ),
    title: "Lyric Generator for Every Genre",
    desc: "From pop and R&B to country, rap, and EDM — our lyric generator adapts its style, vocabulary, and rhyme scheme to match your chosen genre perfectly.",
    accent: "#a855f7",
    keyword: "lyric generator",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
    title: "Free AI Music Generator",
    desc: "No credit card. No watermarks on previews. Our free AI music generator lets anyone create and explore full songs — professional quality, zero cost to start.",
    accent: "#f59e0b",
    keyword: "free ai music generator",
  },
];

/* ─── How it works steps ─────────────────────────────────────────────────── */
const steps = [
  {
    num: "01",
    title: "Type Your Idea",
    desc: 'Enter any text prompt — a theme, a feeling, a story, even just a few words like "upbeat summer road trip song." The AI music generator takes it from there.',
    accent: "#6366f1",
  },
  {
    num: "02",
    title: "Choose a Style",
    desc: "Pick your genre, vocal style, tempo, and mood. Want a melancholic indie ballad or an energetic hip-hop banger? Select it and the AI tailors everything to match.",
    accent: "#2dd4bf",
  },
  {
    num: "03",
    title: "Get Your Song",
    desc: "In seconds, receive a fully produced song complete with AI-generated lyrics and music. Download it, share it, or regenerate with tweaks — completely free to try.",
    accent: "#a855f7",
  },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default async function Home() {
  const comfyUiOnline = await getComfyUiOnline();

  /* ─── Structured data ─────────────────────────────────────────────────── */
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Songify",
    url: absoluteUrl("/"),
    logo: absoluteUrl("/favicon.ico"),
    sameAs: [],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    alternateName: ["Songify.fun", "Songify AI", "Text to Song"],
    url: absoluteUrl("/"),
    description: "Free AI song generator — turn any text into a song instantly.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Songify — Free AI Song Generator",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    url: absoluteUrl("/"),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free tier available. No credit card required.",
    },
    description:
      "Songify is a free AI song generator and AI music maker that turns any text prompt into a complete song with lyrics and music. The top AI platform for songs and lyrics.",
    featureList: [
      "Text to song conversion",
      "AI lyrics generator",
      "Song lyrics generator",
      "Free AI music generator",
      "AI song maker",
      "Lyric generator",
      "Multiple genre support",
      "Instant audio download",
    ],
    screenshot: absoluteUrl("/opengraph-image"),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1200",
      bestRating: "5",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Studio", path: "/studio" },
    { name: "Pricing", path: "/pricing" },
    { name: "Features", path: "/features" },
    { name: "About", path: "/about" },
    { name: "FAQ", path: "/faq" },
  ]);

  return (
    <main className="w-full flex-1 pb-24">
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      <JsonLd data={softwareSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />

      {/* Offline banner */}
      {!comfyUiOnline && (
        <div className="site-container px-4 pt-6 sm:px-6 lg:px-8">
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.6rem",
              fontSize: "0.8rem", color: "#a5b4fc",
              background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: "999px", padding: "0.4rem 1rem",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", display: "inline-block", animation: "pulse-dot 1.5s ease-in-out infinite" }} />
            Studio Coming Soon · Join the Waitlist
          </div>
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* HERO                                                                 */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="site-container px-4 pt-20 pb-12 sm:px-6 lg:px-8 text-center">
        <div className="fade-up">
          <span className="hero-kicker">
            <svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" fill="#2dd4bf"/></svg>
            Free AI Song Generator
          </span>
        </div>

        {/* SEO-specified H1 — exactly one, at the top */}
        <h1
          className="fade-up-delay-1 mt-7 text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl mx-auto max-w-4xl"
          style={{ fontFamily: '"Space Grotesk", sans-serif' }}
        >
          <span className="gradient-text">Turn Any Text Into a Song</span>
          <br />
          with AI
        </h1>

        {/* Subheading — naturally includes "ai song generator" + "lyrics generator" */}
        <p
          className="fade-up-delay-2 mt-6 text-lg leading-8 max-w-2xl mx-auto"
          style={{ color: "var(--text-secondary)" }}
        >
          Songify is the most powerful <strong style={{ color: "var(--text-primary)" }}>ai song generator</strong> online — paste any idea and our AI writes the music and lyrics for you. The only <strong style={{ color: "var(--text-primary)" }}>lyrics generator</strong> that also produces a full, production-ready track in seconds.
        </p>

        {/* ─── Quick Generate input — the tool IS the CTA ────────────── */}
        <div className="fade-up-delay-3 mt-10 w-full px-2">
          <QuickGenerate />
        </div>

        {/* Social proof strip */}
        <p className="mt-6 text-xs" style={{ color: "var(--text-muted)" }}>
          Free · No account needed · 50,000+ songs created
        </p>

      </section>


      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* HOW IT WORKS                                                         */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="site-container px-4 pt-24 sm:px-6 lg:px-8" aria-labelledby="how-it-works-heading">
        <div className="text-center mb-14">
          <p className="section-eyebrow">Simple 3-Step Process</p>
          <h2
            id="how-it-works-heading"
            className="mt-3 text-3xl font-bold sm:text-4xl"
            style={{ fontFamily: '"Space Grotesk", sans-serif', color: "var(--text-primary)" }}
          >
            How Our AI Music Generator Works
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
            No studio. No instruments. No experience needed. Our <strong style={{ color: "var(--text-primary)" }}>ai music generator</strong> handles the entire creative process for you — from blank prompt to downloadable song.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3" style={{ position: "relative" }}>
          {/* Connector line (desktop) */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute", top: "2.75rem", left: "calc(33% + 2rem)", right: "calc(33% + 2rem)",
              height: "1px", background: "linear-gradient(90deg, rgba(99,102,241,0.4), rgba(45,212,191,0.4))",
              display: "none",
            }}
            className="hidden sm:block"
          />

          {steps.map((step, i) => (
            <div
              key={step.num}
              className="glass-card glass-card-glow"
              style={{ padding: "2rem 1.75rem", textAlign: "center", animationDelay: `${i * 0.1}s` }}
            >
              <div
                style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: `${step.accent}18`,
                  border: `2px solid ${step.accent}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1.25rem",
                  fontSize: "1.2rem", fontWeight: 800, color: step.accent,
                  fontFamily: '"Space Grotesk", sans-serif',
                }}
              >
                {step.num}
              </div>
              <h3
                style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.6rem" }}
              >
                {step.title}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/studio"
            prefetch={false}
            id="how-it-works-cta"
            className="btn-primary"
            style={{ padding: "0.85rem 2rem", fontSize: "0.95rem" }}
          >
            Try the AI Song Generator Free
          </Link>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* DEMO SONGS                                                           */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <SongDemoSection />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* FEATURES                                                             */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="site-container px-4 pt-24 sm:px-6 lg:px-8" aria-labelledby="features-heading">
        <div className="text-center mb-14">
          <p className="section-eyebrow">Platform Features</p>
          <h2
            id="features-heading"
            className="mt-3 text-3xl font-bold sm:text-4xl"
            style={{ fontFamily: '"Space Grotesk", sans-serif', color: "var(--text-primary)" }}
          >
            Everything You Need to Create Songs with AI
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
            Songify is built for creators of all levels — from first-time songwriters to professional producers. Write as music effortlessly with tools designed for real creative output.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="glass-card glass-card-glow"
              style={{ padding: "1.75rem", animationDelay: `${i * 0.08}s` }}
            >
              <div
                style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: `${f.accent}18`,
                  border: `1px solid ${f.accent}35`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: f.accent, marginBottom: "1.1rem",
                }}
                role="img"
                aria-label={`${f.keyword} feature icon — ai song generator`}
              >
                {f.icon}
              </div>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                {f.title}
              </h3>
              <p style={{ fontSize: "0.83rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* SOCIAL PROOF / STATS                                                 */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="site-container px-4 pt-24 sm:px-6 lg:px-8">
        <div
          style={{
            borderRadius: "1.5rem",
            padding: "3rem 2rem",
            background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(45,212,191,0.08) 100%)",
            border: "1px solid rgba(99,102,241,0.2)",
          }}
        >
          <p className="section-eyebrow text-center mb-10" style={{ color: "#a5b4fc" }}>
            Trusted by Creators Worldwide
          </p>
          <div className="grid gap-8 sm:grid-cols-3 text-center">
            {[
              { val: "50,000+", label: "Songs Generated", sub: "using our free ai song generator" },
              { val: "120+ Genres", label: "Supported Styles", sub: "from pop to classical to rap" },
              { val: "4.8 / 5", label: "Average Rating", sub: "top ai for lyrics for songs" },
            ].map((stat) => (
              <div key={stat.val}>
                <p
                  style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: '"Space Grotesk", sans-serif' }}
                >
                  {stat.val}
                </p>
                <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--accent-teal)", marginTop: "0.25rem" }}>
                  {stat.label}
                </p>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* CTA BANNER                                                           */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="site-container px-4 pt-24 sm:px-6 lg:px-8">
        <div
          style={{
            borderRadius: "1.5rem",
            padding: "4rem 2rem",
            textAlign: "center",
            background: "linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(45,212,191,0.10) 100%)",
            border: "1px solid rgba(99,102,241,0.25)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: "-40%", left: "50%", transform: "translateX(-50%)", width: "80%", height: "200%", background: "radial-gradient(ellipse, rgba(99,102,241,0.14) 0%, transparent 60%)", pointerEvents: "none" }} />
          <p className="section-eyebrow relative" style={{ color: "#a5b4fc" }}>
            Start for free — no account needed
          </p>
          <h2
            className="relative mt-4 text-3xl font-bold sm:text-4xl"
            style={{ fontFamily: '"Space Grotesk", sans-serif', color: "var(--text-primary)" }}
          >
            Your Next Hit Song Is One Prompt Away
          </h2>
          <p
            className="relative mt-4 max-w-xl mx-auto text-sm leading-7"
            style={{ color: "var(--text-secondary)" }}
          >
            Join thousands of creators using Songify as their go-to <strong style={{ color: "var(--text-primary)" }}>ai song maker</strong>. Whether you&apos;re a musician, content creator, or just curious — our <strong style={{ color: "var(--text-primary)" }}>song generator</strong> is the fastest path from idea to finished track.
          </p>
          <div className="relative mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              href="/studio"
              prefetch={false}
              id="mid-page-cta-generate"
              className="btn-primary"
              style={{ padding: "0.9rem 2.25rem", fontSize: "1rem" }}
            >
              Generate My Song Free
            </Link>
          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* FAQ                                                                  */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="site-container px-4 pt-24 sm:px-6 lg:px-8" aria-labelledby="faq-heading">
        <div className="mb-12">
          <p className="section-eyebrow">FAQs</p>
          <h2
            id="faq-heading"
            className="mt-3 text-3xl font-bold sm:text-4xl"
            style={{ fontFamily: '"Space Grotesk", sans-serif', color: "var(--text-primary)" }}
          >
            Frequently Asked Questions
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
            Everything you need to know about using Songify as your text to song platform, ai music maker, and free ai music generator.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2" style={{ alignItems: "start" }}>
          {faqs.map((item) => (
            <article key={item.question} className="glass-card" style={{ padding: "1.75rem" }}>
              <h3
                style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.75rem", lineHeight: 1.4 }}
              >
                {item.question}
              </h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.75 }}>
                {item.answer}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/faq" prefetch={false} className="btn-secondary" style={{ fontSize: "0.85rem", padding: "0.55rem 1.1rem" }}>
            View Full FAQ →
          </Link>
          <Link href="/terms" prefetch={false} className="btn-secondary" style={{ fontSize: "0.85rem", padding: "0.55rem 1.1rem" }}>
            Terms
          </Link>
          <Link href="/privacy" prefetch={false} className="btn-secondary" style={{ fontSize: "0.85rem", padding: "0.55rem 1.1rem" }}>
            Privacy
          </Link>
        </div>
      </section>
    </main>
  );
}
