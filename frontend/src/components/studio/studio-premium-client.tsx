"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

/* ─── Constants ────────────────────────────────────────────────── */
const GENRES = ["Pop", "Rock", "Hip-Hop", "R&B", "Country", "Jazz", "Lo-fi", "EDM", "Folk", "Classical"];
const MOODS = ["Happy", "Sad", "Energetic", "Calm", "Dark", "Dreamy", "Upbeat", "Melancholic"];
const VOCAL_TYPES = ["Female voice", "Male voice", "Children"];
const DURATIONS = [
  { value: 15, label: "15s" },
  { value: 30, label: "30s" },
  { value: 60, label: "1 min" },
  { value: 120, label: "2 min" },
];

/* ─── Chip button ──────────────────────────────────────────────── */
function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.3rem 0.75rem",
        borderRadius: "0.5rem",
        fontSize: "0.8rem",
        fontWeight: 500,
        cursor: "pointer",
        border: active ? "1px solid rgba(99,102,241,0.6)" : "1px solid rgba(255,255,255,0.1)",
        background: active ? "rgba(99,102,241,0.18)" : "rgba(255,255,255,0.03)",
        color: active ? "#a5b4fc" : "var(--text-secondary)",
        transition: "all 150ms ease",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

/* ─── Field label ──────────────────────────────────────────────── */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.4rem" }}>
      {children}
    </p>
  );
}

/* ─── Countdown timer formatting ───────────────────────────────── */
function formatTime(ms: number) {
  if (ms <= 0) return "00:00:00";
  const totalSec = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
  const s = String(totalSec % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

/* ─── Main component ──────────────────────────────────────────── */
export function StudioPremiumClient({ expiresAt }: { expiresAt: string }) {
  const router = useRouter();
  const expiryMs = new Date(expiresAt).getTime();

  // Timer
  const [remaining, setRemaining] = useState(() => Math.max(0, expiryMs - Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      const left = Math.max(0, expiryMs - Date.now());
      setRemaining(left);
      if (left <= 0) {
        clearInterval(interval);
        router.push("/payment?plan=24h-unlimited&expired=true");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiryMs, router]);

  // Form
  const [lyrics, setLyrics] = useState("");
  const [basePrompt, setBasePrompt] = useState("");
  const [vocalType, setVocalType] = useState("Female voice");
  const [duration, setDuration] = useState(30);
  const [genre, setGenre] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);

  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!lyrics.trim()) { setError("Please enter your lyrics."); return; }
    setError(null);
    setGenerating(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/song-queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lyrics: lyrics.trim(),
          basePrompt: basePrompt.trim() || undefined,
          vocalType,
          duration,
          genre,
          mood,
          source: "studio",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setSuccess(true);
      setLyrics("");
      setBasePrompt("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setGenerating(false);
    }
  }, [lyrics, basePrompt, vocalType, duration, genre, mood]);

  const timerWarning = remaining < 60 * 60 * 1000; // less than 1 hour
  const timerCritical = remaining < 10 * 60 * 1000; // less than 10 minutes

  return (
    <section style={{ paddingBottom: "4rem" }}>

      {/* Studio header with timer */}
      <div style={{
        marginBottom: "1.25rem",
        padding: "1.25rem 1.5rem",
        borderRadius: "0.875rem",
        background: "linear-gradient(135deg, rgba(99,102,241,0.14) 0%, rgba(45,212,191,0.07) 100%)",
        border: "1px solid rgba(99,102,241,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
            <span style={{ fontSize: "1.1rem", color: "#86efac", fontWeight: 600 }}>Active (24h Unlimited Plan)</span>
          </div>
        </div>

        {/* Timer badge */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.5rem 1rem",
          borderRadius: "0.6rem",
          background: timerCritical
            ? "rgba(239,68,68,0.12)"
            : timerWarning
            ? "rgba(245,158,11,0.1)"
            : "rgba(34,197,94,0.08)",
          border: `1px solid ${
            timerCritical
              ? "rgba(239,68,68,0.3)"
              : timerWarning
              ? "rgba(245,158,11,0.25)"
              : "rgba(34,197,94,0.2)"
          }`,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={timerCritical ? "#fca5a5" : timerWarning ? "#fbbf24" : "#86efac"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 500 }}>
            Time remaining:
          </span>
          <span style={{
            fontSize: "0.95rem",
            fontWeight: 700,
            fontFamily: '"Space Grotesk", monospace',
            color: timerCritical ? "#fca5a5" : timerWarning ? "#fbbf24" : "#86efac",
            fontVariantNumeric: "tabular-nums",
          }}>
            {formatTime(remaining)}
          </span>
        </div>
      </div>

      {/* Song creation form */}
      <div style={{
        background: "rgba(13,17,23,0.8)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "0.875rem",
        backdropFilter: "blur(16px)",
        padding: "1.5rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1", boxShadow: "0 0 8px #6366f1" }} />
          <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#a5b4fc" }}>Customize Your Song</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Lyrics */}
          <div>
            <FieldLabel>Your Lyrics</FieldLabel>
            <textarea
              rows={5}
              placeholder="Paste your lyrics, poem, or story here…"
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              style={{
                width: "100%",
                borderRadius: "0.5rem",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.03)",
                color: "var(--text-primary)",
                padding: "0.6rem 0.85rem",
                fontSize: "0.88rem",
                lineHeight: 1.6,
                resize: "vertical",
                outline: "none",
                fontFamily: "inherit",
                transition: "border-color 150ms",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.6)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
            />
          </div>

          {/* Base Prompt */}
          <div>
            <FieldLabel>Base Prompt (Optional)</FieldLabel>
            <textarea
              rows={2}
              placeholder="Describe the style, instruments, or vibe..."
              value={basePrompt}
              onChange={(e) => setBasePrompt(e.target.value)}
              style={{
                width: "100%",
                borderRadius: "0.5rem",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.03)",
                color: "var(--text-primary)",
                padding: "0.6rem 0.85rem",
                fontSize: "0.88rem",
                lineHeight: 1.6,
                resize: "vertical",
                outline: "none",
                fontFamily: "inherit",
                transition: "border-color 150ms",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.6)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
            />
          </div>

          {/* Vocal Type */}
          <div>
            <FieldLabel>Vocal Type</FieldLabel>
            <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
              {VOCAL_TYPES.map((v) => (
                <Chip key={v} active={vocalType === v} onClick={() => setVocalType(v)}>
                  {v}
                </Chip>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <FieldLabel>Duration</FieldLabel>
            <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
              {DURATIONS.map((d) => (
                <Chip key={d.value} active={duration === d.value} onClick={() => setDuration(d.value)}>
                  {d.label}
                </Chip>
              ))}
            </div>
          </div>

          {/* Genre */}
          <div>
            <FieldLabel>Genre</FieldLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
              <Chip active={genre === null} onClick={() => setGenre(null)}>All</Chip>
              {GENRES.map((g) => (
                <Chip key={g} active={genre === g} onClick={() => setGenre(g)}>
                  {g}
                </Chip>
              ))}
            </div>
          </div>

          {/* Mood */}
          <div>
            <FieldLabel>Mood</FieldLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
              <Chip active={mood === null} onClick={() => setMood(null)}>All</Chip>
              {MOODS.map((m) => (
                <Chip key={m} active={mood === m} onClick={() => setMood(m)}>
                  {m}
                </Chip>
              ))}
            </div>
          </div>

          {/* Errors and success */}
          {error && (
            <div style={{ fontSize: "0.82rem", color: "#fca5a5", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "0.5rem", padding: "0.6rem 0.85rem" }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ fontSize: "0.82rem", color: "#86efac", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "0.5rem", padding: "0.6rem 0.85rem" }}>
              🎉 Song submitted successfully! You can generate another one.
            </div>
          )}

          {/* Generate button */}
          <button
            type="button"
            disabled={generating || remaining <= 0}
            onClick={handleGenerate}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              width: "100%",
              padding: "0.85rem",
              borderRadius: "0.65rem",
              border: "none",
              background: generating
                ? "rgba(99,102,241,0.4)"
                : "linear-gradient(135deg, #6366f1, #818cf8)",
              color: "#fff",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: generating ? "not-allowed" : "pointer",
              boxShadow: "0 0 24px rgba(99,102,241,0.3)",
              transition: "opacity 180ms, box-shadow 180ms",
            }}
          >
            {generating ? (
              <>
                <span style={{ display: "flex", gap: "3px" }}>
                  {[0, 0.2, 0.4].map((d, i) => (
                    <span key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff", animation: `pulse-dot 1.2s ${d}s ease-in-out infinite`, opacity: 0.8 }} />
                  ))}
                </span>
                Generating…
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Continue →
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
        textarea:focus { outline: none; border-color: rgba(99,102,241,0.6) !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
      `}</style>
    </section>
  );
}
