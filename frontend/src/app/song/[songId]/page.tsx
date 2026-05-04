"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { WavePlayer } from "@/components/ui/wave-player";
import type { SongQueueEntry } from "@/lib/song-queue-store";

export default function SongPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const songId = params.songId as string;
  
    const router = useRouter();
    const [entry, setEntry] = useState<SongQueueEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Check if this is a verification link
        const verifyEmail = searchParams.get("verifyEmail");
        
        if (verifyEmail) {
          // User clicked email link - verify and create entry
          setVerifying(true);
          
          const verifyRes = await fetch("/api/song-queue/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: verifyEmail,
              songId,
              lyrics: searchParams.get("lyrics") || "",
              theme: searchParams.get("theme"),
              genre: searchParams.get("genre"),
              mood: searchParams.get("mood"),
              duration: searchParams.get("duration") ? parseInt(searchParams.get("duration")!) : 30,
            }),
          });
          
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) {
            throw new Error(verifyData.error || "Verification failed");
          }
          
          // Store email and username in localStorage after successful verification
          if (typeof window !== "undefined") {
            localStorage.setItem("songify_email", verifyData.email);
            localStorage.setItem("songify_username", verifyData.username);
          }
          
            setVerifying(false);
            // Redirect to clean URL without params
            router.replace(`/song/${songId}`);
        }
        
        // Fetch the song entry via API
        const songRes = await fetch(`/api/song-queue/${songId}`);
        const songData = await songRes.json();
        
        if (!songRes.ok) {
          throw new Error(songData.error || "Song not found");
        }
        
        setEntry(songData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading song");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [songId, searchParams]);

  if (loading || verifying) {
    return (
      <main className="site-container w-full min-h-[100dvh] flex items-center justify-center px-4">
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "var(--text-secondary)" }}>Loading your song...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="site-container w-full min-h-[100dvh] flex items-center justify-center px-4">
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <p style={{ color: "#ff6b6b", marginBottom: "1rem" }}>{error}</p>
          <Link href="/" style={{ color: "#6366f1", textDecoration: "none", fontWeight: 600 }}>
            Create a new song
          </Link>
        </div>
      </main>
    );
  }

  if (!entry) {
    return (
      <main className="site-container w-full min-h-[100dvh] flex items-center justify-center px-4">
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>Song not found</p>
          <Link href="/" style={{ color: "#6366f1", textDecoration: "none", fontWeight: 600 }}>
            Create your own song
          </Link>
        </div>
      </main>
    );
  }

  const accentColor = entry.genre === "Lo-fi" ? "#a855f7" : entry.genre === "Hip-Hop" ? "#2dd4bf" : "#6366f1";
  const isCompleted = entry.status === "completed" && Boolean(entry.songUrl);
  const isRejected = entry.status === "rejected";

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
              
              {entry.songTitle && entry.songTitle !== "AI Generated Song" && (
                <h1 className="text-4xl md:text-5xl lg:text-6xl" style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.1, marginBottom: "1rem" }}>
                  {entry.songTitle}
                </h1>
              )}
              
              <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                Created by <Link href={`/explore?search=${entry.username}`} style={{ color: accentColor, fontWeight: 700, textDecoration: "none" }}>@{entry.username}</Link>
              </p>
            </div>

            {isCompleted ? (
              <WavePlayer
                src={entry.songUrl!}
                title={entry.songTitle}
                artist={`@${entry.username}`}
                genre={entry.genre ?? undefined}
                duration={`${entry.duration}s`}
                accent={accentColor}
              />
            ) : isRejected ? (
              <div style={{
                borderRadius: "1.25rem",
                border: "1px solid rgba(239,68,68,0.3)",
                background: "rgba(239,68,68,0.08)",
                padding: "1.5rem",
                minHeight: 220,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "0.75rem",
              }}>
                <p style={{ fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#fca5a5" }}>
                  Rejected
                </p>
                <h2 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2 }}>
                  This song request was not approved.
                </h2>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 480 }}>
                  You can create a new request with updated lyrics or style settings. Please check your email for the admin update.
                </p>
              </div>
            ) : (
              <div style={{
                borderRadius: "1.25rem",
                border: "1px solid rgba(99,102,241,0.2)",
                background: "rgba(99,102,241,0.06)",
                padding: "1.5rem",
                minHeight: 220,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "0.75rem",
              }}>
                <p style={{ fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#a5b4fc" }}>
                  Generating
                </p>
                <h2 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2 }}>
                  We are generating your song now.
                </h2>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 420, marginTop: "0.5rem", fontSize: "0.95rem" }}>
                  We will send you an email notification when your song is ready.
                </p>
              </div>
            )}

            <div style={{ marginTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }} className="lg:mt-auto lg:pb-8">
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                {isCompleted
                  ? `Generated: ${entry.completedAt ? new Date(entry.completedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "Recently"}`
                  : isRejected
                    ? "Status: Rejected"
                    : "Status: Processing"}
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
                 {isCompleted ? "No lyrics available." : isRejected ? "This request was rejected by admin." : "Lyrics will appear when the song is ready."}
               </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
