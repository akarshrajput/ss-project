import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { getSongQueueBySongId } from "@/lib/song-queue-store";
import { WavePlayer } from "@/components/ui/wave-player";

type Params = Promise<{ songId: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { songId } = await params;
  const entry = await getSongQueueBySongId(songId);
  if (!entry) return buildMetadata({ title: "Song Not Found", description: "This song does not exist.", path: `/song/${songId}` });

  return buildMetadata({
    title: `${entry.songTitle} by @${entry.username} — Songify`,
    description: `Listen to "${entry.songTitle}" — an AI-generated song by @${entry.username} on Songify. Created with the free AI song generator.`,
    path: `/song/${songId}`,
    keywords: ["ai song", entry.songTitle, entry.username, entry.genre ?? "music"].filter(Boolean) as string[],
  });
}

export default async function SongPage({ params }: { params: Params }) {
  const { songId } = await params;
  const entry = await getSongQueueBySongId(songId);
  if (!entry || entry.status !== "completed" || !entry.songUrl) notFound();

  const accentColor = entry.genre === "Lo-fi" ? "#a855f7" : entry.genre === "Hip-Hop" ? "#2dd4bf" : "#6366f1";

  return (
    <main className="site-container w-full flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div style={{ width: "100%" }}>
        {/* Navigation / Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
          <Link href="/explore" style={{
            fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)",
            textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem",
            padding: "0.5rem 1rem", borderRadius: "0.75rem", background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)", transition: "all 200ms ease"
          }}
            className="hover:bg-white/5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
            Explore Community
          </Link>

          <Link href="/" style={{ fontSize: "0.85rem", fontWeight: 700, color: accentColor, textDecoration: "none" }}>
            Create Your Own
          </Link>
        </div>

        {/* Professional Layout: 2 Columns */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "4rem", alignItems: "start" }}>
          
          {/* Left Side: Visuals & Player */}
          <div style={{ position: "sticky", top: "2rem" }}>
            <div style={{
              width: "100%", aspectRatio: "1", borderRadius: "2rem", overflow: "hidden",
              background: `linear-gradient(135deg, ${accentColor}33 0%, rgba(13,17,23,0.8) 100%)`,
              border: `1px solid ${accentColor}40`,
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", marginBottom: "2rem",
              boxShadow: `0 20px 80px ${accentColor}15`
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "6rem", filter: "drop-shadow(0 0 20px rgba(255,255,255,0.2))" }}>🎵</div>
                <div style={{
                  marginTop: "1.5rem", fontSize: "0.75rem", fontWeight: 800,
                  letterSpacing: "0.2em", textTransform: "uppercase", color: accentColor,
                  background: `${accentColor}15`, padding: "0.4rem 1rem", borderRadius: "999px"
                }}>
                  Songify AI Generation
                </div>
              </div>
            </div>

            <WavePlayer
              src={entry.songUrl}
              title={entry.songTitle}
              artist={`@${entry.username}`}
              genre={entry.genre ?? undefined}
              duration={`${entry.duration}s`}
              accent={accentColor}
            />
          </div>

          {/* Right Side: Metadata & Lyrics */}
          <div>
            <div style={{ marginBottom: "2.5rem" }}>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                {entry.genre && <span style={{ fontSize: "0.7rem", fontWeight: 800, padding: "0.25rem 0.75rem", borderRadius: "999px", background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)", border: "1px solid rgba(255,255,255,0.1)", textTransform: "uppercase" }}>{entry.genre}</span>}
                {entry.mood && <span style={{ fontSize: "0.7rem", fontWeight: 800, padding: "0.25rem 0.75rem", borderRadius: "999px", background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)", border: "1px solid rgba(255,255,255,0.1)", textTransform: "uppercase" }}>{entry.mood}</span>}
              </div>
              
              <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "3rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.1, marginBottom: "0.75rem" }}>
                {entry.songTitle}
              </h1>
              
              <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                Created by <Link href={`/explore?search=${entry.username}`} style={{ color: accentColor, fontWeight: 700, textDecoration: "none" }}>@{entry.username}</Link>
              </p>
            </div>

            {entry.lyrics && (
              <div>
                <h2 style={{ fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "0.75rem" }}>
                  Lyrics
                </h2>
                <div style={{
                  fontSize: "1.1rem", color: "var(--text-primary)", lineHeight: 1.9, whiteSpace: "pre-wrap",
                  fontFamily: '"Outfit", sans-serif', opacity: 0.9,
                  maxHeight: "500px", overflowY: "auto", paddingRight: "1rem"
                }}>
                  {entry.lyrics}
                </div>
              </div>
            )}

            <div style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Generation Date: {entry.completedAt ? new Date(entry.completedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "Recently"}
              </p>
              
              <div style={{ display: "flex", gap: "1rem" }}>
                <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.9rem" }}>Share</button>
                <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.9rem" }}>Report</button>
              </div>
            </div>
          </div>

        </div>

        {/* Community CTA */}
        <section style={{ marginTop: "8rem", textAlign: "center", padding: "4rem", borderRadius: "2rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>Inspired by this track?</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>Use Songify AI to turn your own ideas into high-quality music in seconds.</p>
          <Link href="/" className="btn-primary" style={{ padding: "1rem 2.5rem", fontSize: "1.1rem" }}>
            Start Generating Now
          </Link>
        </section>
      </div>
    </main>
  );
}
