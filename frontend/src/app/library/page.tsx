import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { LibraryClient } from "@/components/library/library-client";

export const metadata: Metadata = buildMetadata({
  title: "Your Library: Singify",
  description:
    "Listen to your generated songs and view your library.",
  path: "/library",
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
    "singify community",
  ],
});

export default function LibraryPage() {
  return (
    <main className="site-container w-full flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div style={{ width: "100%" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "2.25rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.15 }}>
            Your <span className="gradient-text">Library</span>
          </h1>
          <p style={{ marginTop: "0.5rem", fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 560 }}>
            Listen to your generated songs. Premium songs are private and only visible here.
          </p>
        </div>

        <LibraryClient />

        <section style={{ display: "none" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>
            Discover What Our Text to Song Generator Can Create
          </h2>
          <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "1rem" }}>
            Welcome to the Singify community explore page. This space is dedicated to showcasing the incredible creativity of our users who use our <strong style={{ color: "var(--text-primary)" }}>text to song generator</strong> and <strong style={{ color: "var(--text-primary)" }}>text to song converter online free</strong>. Here, you can find a diverse collection of songs generated from text prompts, spanning various genres, moods, and themes. Our <strong style={{ color: "var(--text-primary)" }}>text to song AI</strong> empowers anyone, regardless of musical background, to become a creator.
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
              <span><strong>Get Inspired:</strong> Use the community&apos;s creations as a springboard for your own ideas. Head to the homepage to start making your own music.</span>
            </li>
          </ul>
        </section>

        <section style={{ display: "none" }}>
          <div className="glass-card" style={{ padding: "1.75rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.85rem" }}>The Power of Community-Driven AI Music</h2>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: "0.85rem" }}>
              Every song you see on this page was created by a real person using the Singify <strong style={{ color: "var(--text-primary)" }}>text to song AI free</strong> tool. That means this gallery is always growing, always changing, and always reflecting the diverse creative ideas of our global user base. From heartfelt love songs to energetic workout anthems, from lo-fi study beats to cinematic orchestral pieces — the range of what people create with our <strong style={{ color: "var(--text-primary)" }}>text to song generator free</strong> continues to surprise us.
            </p>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: "0.85rem" }}>
              Listening to other creators&apos; work is one of the best ways to understand the full potential of our platform. You might hear a <strong style={{ color: "var(--text-primary)" }}>text to rap song</strong> with punchy rhymes that inspire you to write your own verse, or a smooth R&B track that shows you how mood settings affect the vocal style. Each song is a learning opportunity — and a reminder that with the right prompt, anyone can make something worth sharing.
            </p>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85 }}>
              The explore page is also where we surface our most-played and highest-rated tracks. These are the songs that other listeners keep coming back to — which makes them a reliable benchmark for what great AI-generated music can sound like. If you want to understand what separates a good prompt from a great one, start here. Study the inputs, listen to the outputs, and take notes. Then go create something even better.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
