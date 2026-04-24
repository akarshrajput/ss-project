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
    <main className="site-container w-full min-h-[100dvh] lg:h-[100dvh] flex flex-col px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto lg:overflow-hidden">
      <div className="w-full h-full flex flex-col min-h-full">
        {/* Navigation / Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexShrink: 0 }}>
          <Link href="/explore" style={{
            fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)",
            textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem",
            padding: "0.5rem 1rem", borderRadius: "0.75rem", background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)", transition: "all 200ms ease"
          }}
            className="hover:bg-white/5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
            <span className="hidden sm:inline">Explore Community</span>
            <span className="sm:hidden">Explore</span>
          </Link>

          <Link href="/" style={{ fontSize: "0.85rem", fontWeight: 700, color: accentColor, textDecoration: "none" }}>
            Create Your Own
          </Link>
        </div>

        {/* Compact Layout: 1 Column Mobile, 2 Columns Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 flex-grow min-h-0 pb-8 lg:pb-0">
          
          {/* Left Side: Metadata & Player */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", paddingTop: "1rem" }} className="h-auto lg:h-[85%] lg:my-auto">
            
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
                {entry.genre && <span style={{ fontSize: "0.75rem", fontWeight: 800, padding: "0.3rem 0.8rem", borderRadius: "999px", background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)", border: "1px solid rgba(255,255,255,0.1)", textTransform: "uppercase" }}>{entry.genre}</span>}
                {entry.mood && <span style={{ fontSize: "0.75rem", fontWeight: 800, padding: "0.3rem 0.8rem", borderRadius: "999px", background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)", border: "1px solid rgba(255,255,255,0.1)", textTransform: "uppercase" }}>{entry.mood}</span>}
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl" style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.1, marginBottom: "1rem" }}>
                {entry.songTitle}
              </h1>
              
              <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                Created by <Link href={`/explore?search=${entry.username}`} style={{ color: accentColor, fontWeight: 700, textDecoration: "none" }}>@{entry.username}</Link>
              </p>
            </div>

            <WavePlayer
              src={entry.songUrl}
              title={entry.songTitle}
              artist={`@${entry.username}`}
              genre={entry.genre ?? undefined}
              duration={`${entry.duration}s`}
              accent={accentColor}
            />

            <div style={{ marginTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }} className="lg:mt-auto lg:pb-8">
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Generated: {entry.completedAt ? new Date(entry.completedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "Recently"}
              </p>
              
              <div style={{ display: "flex", gap: "1rem" }}>
                <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.9rem" }}>Share</button>
                <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.9rem" }}>Report</button>
              </div>
            </div>
          </div>

          {/* Right Side: Lyrics */}
          <div className="h-[500px] lg:h-[85%] lg:my-auto bg-white/5 rounded-3xl border border-white/5 p-6 lg:p-10 flex flex-col">
            {entry.lyrics ? (
              <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
                <h2 style={{ fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "1.5rem", flexShrink: 0 }}>
                  Lyrics
                </h2>
                <div style={{
                  fontSize: "1.05rem", color: "var(--text-primary)", lineHeight: 1.9, whiteSpace: "pre-wrap",
                  fontFamily: '"Outfit", sans-serif', opacity: 0.9,
                  overflowY: "auto", flexGrow: 1, paddingRight: "0.5rem"
                }} className="custom-scrollbar">
                  {entry.lyrics}
                </div>
              </div>
            ) : (
               <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-muted)" }}>
                 No lyrics available.
               </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
