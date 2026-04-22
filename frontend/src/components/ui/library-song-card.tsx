"use client";

import { WavePlayer } from "@/components/ui/wave-player";

type SongRow = {
  id: string;
  title: string | null;
  prompt_tags: string | null;
  genre: string | null;
  mood: string | null;
  audio_url: string | null;
  created_at: string;
};

const ACCENTS = ["#6366f1", "#2dd4bf", "#a855f7", "#f59e0b", "#ec4899"];

function accentFor(id: string) {
  // Deterministic accent colour per song based on id char code
  const sum = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return ACCENTS[sum % ACCENTS.length];
}

export function LibrarySongCard({ song, index }: { song: SongRow; index: number }) {
  const accent = accentFor(song.id);
  const date = new Date(song.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <article
      className="glass-card"
      style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}
    >
      {/* Track header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.3rem" }}>
          <h2
            style={{
              fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              flex: 1, minWidth: 0,
            }}
          >
            {song.title ?? `Song ${index + 1}`}
          </h2>
          <span
            style={{
              flexShrink: 0, marginLeft: "0.6rem",
              fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em",
              padding: "0.18rem 0.5rem", borderRadius: 999,
              background: `${accent}18`, border: `1px solid ${accent}35`, color: accent,
              textTransform: "uppercase",
            }}
          >
            AI
          </span>
        </div>
        <p
          style={{
            fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em",
            textTransform: "uppercase", color: "var(--accent-teal)",
          }}
        >
          {song.genre ?? "custom"}{song.mood ? ` · ${song.mood}` : ""}
        </p>
      </div>

      {/* Prompt tags excerpt */}
      {song.prompt_tags && (
        <p
          style={{
            fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.6,
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden",
            margin: 0,
          }}
        >
          {song.prompt_tags}
        </p>
      )}

      {/* WavePlayer */}
      {song.audio_url ? (
        <WavePlayer
          src={song.audio_url}
          title={song.title ?? `Song ${index + 1}`}
          artist="Songify AI"
          genre={song.genre ?? undefined}
          accent={accent}
        />
      ) : (
        <div
          style={{
            padding: "1rem", borderRadius: "0.75rem",
            background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)",
            textAlign: "center", fontSize: "0.78rem", color: "var(--text-muted)",
          }}
        >
          Audio not available
        </div>
      )}

      {/* Date */}
      <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", margin: 0 }}>
        Created {date}
      </p>
    </article>
  );
}
