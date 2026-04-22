"use client";

import { useState } from "react";
import { WavePlayer } from "@/components/ui/wave-player";

/* ─── Demo song data ─────────────────────────────────────────────────────── */
// Replace the `src` values with your real audio file URLs when ready.
const DEMO_SONGS = [
  {
    id: "folk-30s",
    title: "Folk 30s",
    artist: "AI",
    genre: "Folk",
    mood: "happy",
    duration: "0:30",
    prompt: "A song, warm acoustic folk, fingerpicked guitar, ukulele support, gentle hand percussion, storytelling tone, happy",
    accent: "#6366f1",
    src: "https://wrehkhvdxnpqturqquqr.supabase.co/storage/v1/object/public/songs/0feb3a23-e20d-4678-82e5-907b816d8d21/1776664462166-261193775.mp3",
  },
  {
    id: "folk-60s",
    title: "Folk 60s",
    artist: "AI",
    genre: "Folk",
    mood: "cute",
    duration: "1:00",
    prompt: "A song, warm acoustic folk, fingerpicked guitar, ukulele support, gentle hand percussion, storytelling tone, cute",
    accent: "#2dd4bf",
    src: "https://wrehkhvdxnpqturqquqr.supabase.co/storage/v1/object/public/songs/0feb3a23-e20d-4678-82e5-907b816d8d21/1776687186546-931370620.mp3",
  },
  {
    id: "lofi-75s",
    title: "Lo-fi 75s",
    artist: "AI",
    genre: "Lo-fi",
    mood: "calm",
    duration: "1:15",
    prompt: "A song in Hindi, cozy lo-fi, warm vinyl texture, mellow chords, soft beats, nostalgic calm mood, calm, peaceful, serene",
    accent: "#a855f7",
    src: "https://wrehkhvdxnpqturqquqr.supabase.co/storage/v1/object/public/songs/0feb3a23-e20d-4678-82e5-907b816d8d21/1776686780875-287075408.mp3",
  },
];

/* ─── Component ──────────────────────────────────────────────────────────── */
export function SongDemoSection() {
  const [active, setActive] = useState(0);
  const song = DEMO_SONGS[active];

  return (
    <section
      className="site-container px-4 pt-24 sm:px-6 lg:px-8"
      aria-labelledby="demo-heading"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <p className="section-eyebrow">Live Demo</p>
        <h2
          id="demo-heading"
          className="mt-3 text-3xl font-bold sm:text-4xl"
          style={{ fontFamily: '"Space Grotesk", sans-serif', color: "var(--text-primary)" }}
        >
          Hear What Our AI Song Generator Creates
        </h2>
        <p
          className="mt-4 max-w-xl mx-auto text-sm leading-7"
          style={{ color: "var(--text-secondary)" }}
        >
          These tracks were generated entirely by our <strong style={{ color: "var(--text-primary)" }}>ai song maker</strong> from a single text prompt — no musicians, no studios, just your words turned into music.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]" style={{ alignItems: "start" }}>
        {/* Left — Song selector */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {DEMO_SONGS.map((s, i) => {
            const isCurrent = i === active;
            return (
              <button
                key={s.id}
                id={`demo-select-${s.id}`}
                onClick={() => setActive(i)}
                aria-pressed={isCurrent}
                style={{
                  all: "unset",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem 1.25rem",
                  borderRadius: "1rem",
                  border: `1px solid ${isCurrent ? `${s.accent}45` : "rgba(255,255,255,0.06)"}`,
                  background: isCurrent
                    ? `${s.accent}10`
                    : "rgba(17,24,39,0.5)",
                  transition: "all 200ms ease",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  if (!isCurrent) (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)";
                }}
                onMouseLeave={(e) => {
                  if (!isCurrent) (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.06)";
                }}
              >
                {/* Track number / playing indicator */}
                <div
                  style={{
                    flexShrink: 0, width: 36, height: 36, borderRadius: 10,
                    background: isCurrent ? `${s.accent}22` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${isCurrent ? s.accent + "40" : "rgba(255,255,255,0.08)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: isCurrent ? s.accent : "var(--text-muted)",
                    fontSize: "0.78rem", fontWeight: 700,
                  }}
                >
                  {i + 1}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: "0.9rem", fontWeight: 700,
                      color: isCurrent ? "var(--text-primary)" : "var(--text-secondary)",
                      marginBottom: "0.2rem",
                    }}
                  >
                    {s.title}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {s.genre}{"mood" in s && s.mood ? ` · ${s.mood}` : ""} · {s.duration}
                  </p>
                </div>

                {isCurrent && (
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 16, flexShrink: 0 }}>
                    {[1, 2, 3].map((n) => (
                      <span
                        key={n}
                        style={{
                          display: "block", width: 2.5, borderRadius: 99,
                          background: s.accent,
                          animation: `bar-bounce 0.8s ease-in-out ${n * 0.18}s infinite alternate`,
                          height: `${6 + n * 3}px`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}

          {/* Prompt display */}
          <div
            style={{
              marginTop: "0.5rem", padding: "1rem 1.25rem",
              borderRadius: "1rem", border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
              Prompt used
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontStyle: "italic", lineHeight: 1.6 }}>
              &ldquo;{song.prompt}&rdquo;
            </p>
          </div>
        </div>

        {/* Right — Player */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <WavePlayer
            key={song.id}
            src={song.src}
            title={song.title}
            artist={song.artist}
            genre={"mood" in song && song.mood ? `${song.genre} · ${song.mood}` : song.genre}
            duration={song.duration}
            accent={song.accent}
          />

          {/* Caption */}
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center", lineHeight: 1.6 }}>
            Generated by <strong style={{ color: "var(--text-secondary)" }}>Songify</strong> — the top AI platform for songs &amp; lyrics. Not made by any human artist.
          </p>
        </div>
      </div>

      {/* keyframes */}
      <style>{`
        @keyframes bar-bounce {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1.0); }
        }
      `}</style>
    </section>
  );
}
