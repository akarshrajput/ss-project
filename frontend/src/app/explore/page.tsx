import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { ExploreClient } from "@/components/explore/explore-client";

export const metadata: Metadata = buildMetadata({
  title: "Explore AI Songs — Text to Song Generator Community Creations | Songify",
  description:
    "Browse songs created by the Songify community using our text to song generator, text to song converter online free, and text to song AI. Discover text to rap song, text to audio song, and text to speech songs.",
  path: "/explore",
  keywords: [
    "text to song generator",
    "text to song",
    "text to song ai",
    "text to song converter online free",
    "text to rap song",
    "text to audio song",
    "text to speech songs",
    "convert text to song",
    "ai songs",
    "songify community",
  ],
});

export default function ExplorePage() {
  return (
    <main className="site-container w-full flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div style={{ width: "100%" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "2.25rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.15 }}>
            Explore <span className="gradient-text">AI Songs</span>
          </h1>
          <p style={{ marginTop: "0.5rem", fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 560 }}>
            Discover songs created by our community. Search by username, listen to tracks, and find inspiration for your next creation.
          </p>
        </div>

        <ExploreClient />

        {/* SEO Content Section */}
        <section style={{ marginTop: "4rem", maxWidth: 800, borderTop: "1px solid var(--border-subtle)", paddingTop: "2rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>
            Discover What Our Text to Song Generator Can Create
          </h2>
          <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "1rem" }}>
            Welcome to the Songify community explore page. This space is dedicated to showcasing the incredible creativity of our users who use our <strong style={{ color: "var(--text-primary)" }}>text to song generator</strong> and <strong style={{ color: "var(--text-primary)" }}>text to song converter online free</strong>. Here, you can find a diverse collection of songs generated from text prompts, spanning various genres, moods, and themes. Our <strong style={{ color: "var(--text-primary)" }}>text to song AI</strong> empowers anyone, regardless of musical background, to become a creator.
          </p>
          <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "1rem" }}>
            By browsing this gallery, you can discover new styles, find inspiration for your own prompts, and see how others are using our <strong style={{ color: "var(--text-primary)" }}>text to song maker</strong> to push the boundaries of AI-assisted music production. From <strong style={{ color: "var(--text-primary)" }}>text to rap song</strong> creations to <strong style={{ color: "var(--text-primary)" }}>text to audio song</strong> experiments, this community showcase offers a glimpse into the future of music.
          </p>
          
          <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.75rem", marginTop: "1.5rem" }}>
            What you can do on this page:
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <li style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
              <span style={{ color: "var(--accent-violet)" }}>•</span>
              <span><strong>Search and Filter:</strong> Easily find songs by searching for specific usernames or browsing through the latest creations.</span>
            </li>
            <li style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
              <span style={{ color: "var(--accent-violet)" }}>•</span>
              <span><strong>Listen and Learn:</strong> Play tracks directly in your browser and read the prompts used to create them to understand how different inputs affect the output.</span>
            </li>
            <li style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
              <span style={{ color: "var(--accent-violet)" }}>•</span>
              <span><strong>Get Inspired:</strong> Use the community's creations as a springboard for your own ideas. Head to the Studio to start making your own music.</span>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
