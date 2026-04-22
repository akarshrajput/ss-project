"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface WavePlayerProps {
  src: string;
  title: string;
  artist?: string;
  genre?: string;
  duration?: string;
  accent?: string;
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* ─── Component ──────────────────────────────────────────────────────────── */
export function WavePlayer({
  src,
  title,
  artist = "AI Generated",
  genre,
  duration,
  accent = "#6366f1",
}: WavePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<import("wavesurfer.js").default | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [error, setError] = useState(false);

  /* ─── Init WaveSurfer ─────────────────────────────────────────────────── */
  useEffect(() => {
    if (!containerRef.current) return;

    // ── React StrictMode runs effects twice. Use a cancellation flag so the
    //    second async run aborts before it creates a second WaveSurfer instance.
    let cancelled = false;

    // Destroy any existing instance first (handles src changes)
    if (wsRef.current) {
      wsRef.current.destroy();
      wsRef.current = null;
    }

    // Reset state for this new src
    setIsReady(false);
    setIsLoading(true);
    setError(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setTotalDuration(0);

    (async () => {
      const WaveSurfer = (await import("wavesurfer.js")).default;

      // If cleanup already ran, abort — don't mount a second instance
      if (cancelled || !containerRef.current) return;

      const ws = WaveSurfer.create({
        container: containerRef.current,
        waveColor: `${accent}55`,
        progressColor: accent,
        cursorColor: accent,
        cursorWidth: 2,
        barWidth: 2.5,
        barGap: 2,
        barRadius: 4,
        height: 56,
        normalize: true,
        interact: true,
        url: src,
      });

      // If cleanup fired while WaveSurfer was constructing, destroy immediately
      if (cancelled) { ws.destroy(); return; }

      ws.setVolume(volume);
      wsRef.current = ws;

      ws.on("ready", () => {
        if (cancelled) return;
        setIsReady(true);
        setIsLoading(false);
        setTotalDuration(ws.getDuration());
      });
      ws.on("timeupdate", (t) => { if (!cancelled) setCurrentTime(t); });
      ws.on("play", () => { if (!cancelled) setIsPlaying(true); });
      ws.on("pause", () => { if (!cancelled) setIsPlaying(false); });
      ws.on("finish", () => { if (!cancelled) setIsPlaying(false); });
      ws.on("error", () => {
        if (cancelled) return;
        setError(true);
        setIsLoading(false);
      });
    })();

    return () => {
      cancelled = true;
      if (wsRef.current) {
        wsRef.current.destroy();
        wsRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, accent]);

  /* ─── Controls ──────────────────────────────────────────────────────────── */
  const togglePlay = useCallback(() => {
    wsRef.current?.playPause();
  }, []);

  const handleVolumeChange = useCallback(
    (v: number) => {
      setVolume(v);
      wsRef.current?.setVolume(v);
      if (v > 0) setIsMuted(false);
    },
    []
  );

  const toggleMute = useCallback(() => {
    const next = !isMuted;
    setIsMuted(next);
    wsRef.current?.setVolume(next ? 0 : volume);
  }, [isMuted, volume]);

  const handleDownload = useCallback(() => {
    const a = document.createElement("a");
    a.href = src;
    a.download = `${title}.mp3`;
    a.click();
  }, [src, title]);

  /* ─── Render ─────────────────────────────────────────────────────────────  */
  return (
    <div
      style={{
        background: "rgba(17,24,39,0.85)",
        border: `1px solid ${accent}30`,
        borderRadius: "1rem",
        padding: "1.25rem 1.5rem",
        backdropFilter: "blur(20px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent, ${accent}70, transparent)`,
        }}
      />

      {/* Track info row */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1rem" }}>
        {/* Album art placeholder */}
        <div
          style={{
            flexShrink: 0, width: 44, height: 44, borderRadius: 10,
            background: `linear-gradient(135deg, ${accent}50, ${accent}20)`,
            border: `1px solid ${accent}40`,
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "hidden",
          }}
          role="img"
          aria-label={`AI song generator — ${title}`}
        >
          {isPlaying && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 18 }}>
              {[1, 2, 3].map((i) => (
                <span
                  key={i}
                  style={{
                    display: "block", width: 3, borderRadius: 99,
                    background: accent,
                    animation: `bar-bounce 0.8s ease-in-out ${i * 0.15}s infinite alternate`,
                    height: `${8 + i * 4}px`,
                  }}
                />
              ))}
            </div>
          )}
          {!isPlaying && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18V5l12-2v13M9 18c0 1.1-1.34 2-3 2s-3-.9-3-2 1.34-2 3-2 3 .9 3 2zm12-2c0 1.1-1.34 2-3 2s-3-.9-3-2 1.34-2 3-2 3 .9 3 2z" stroke={accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {title}
          </p>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
            {artist}{genre ? ` · ${genre}` : ""}
          </p>
        </div>

        {/* AI badge */}
        <span
          style={{
            flexShrink: 0, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em",
            padding: "0.2rem 0.55rem", borderRadius: 999,
            background: `${accent}18`, border: `1px solid ${accent}40`, color: accent,
            textTransform: "uppercase",
          }}
        >
          AI Song
        </span>
      </div>

      {/* Waveform area — only ONE thing visible at a time */}
      <div style={{ minHeight: 56 }}>
        {/* Loading skeleton */}
        {isLoading && !error && (
          <div
            style={{
              height: 56, display: "flex", alignItems: "center",
              justifyContent: "center", gap: "0.5rem",
              borderRadius: "0.5rem",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", animation: "pulse-dot 1.5s ease-in-out infinite" }}>
              Loading waveform…
            </span>
          </div>
        )}

        {/* Error fallback */}
        {error && (
          <div
            style={{
              height: 56, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.78rem", color: "var(--text-muted)",
              background: "rgba(255,255,255,0.02)", borderRadius: "0.5rem",
              border: "1px dashed rgba(255,255,255,0.08)",
            }}
          >
            🎵 Audio preview — add a real URL to see the waveform
          </div>
        )}

        {/* WaveSurfer container — hidden until ready, never shown alongside error */}
        <div
          ref={containerRef}
          id={`waveform-${title.replace(/\s+/g, "-").toLowerCase()}`}
          style={{ display: isReady ? "block" : "none" }}
        />
      </div>


      {/* Controls row */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.9rem" }}>
        {/* Play/Pause */}
        <button
          id={`play-${title.replace(/\s+/g, "-").toLowerCase()}`}
          onClick={togglePlay}
          disabled={!isReady && !error}
          aria-label={isPlaying ? "Pause song" : "Play song"}
          style={{
            flexShrink: 0, width: 38, height: 38, borderRadius: "50%",
            background: `linear-gradient(135deg, ${accent}, ${accent}bb)`,
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 18px ${accent}50`,
            transition: "transform 180ms ease, box-shadow 180ms ease",
            opacity: (!isReady && !error) ? 0.5 : 1,
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
        >
          {isPlaying ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>

        {/* Time */}
        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", flexShrink: 0, minWidth: 68, fontVariantNumeric: "tabular-nums" }}>
          {formatTime(currentTime)} / {duration ?? formatTime(totalDuration)}
        </span>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Volume */}
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          {showVolume && (
            <div
              style={{
                position: "absolute", bottom: "calc(100% + 8px)", right: 0,
                background: "rgba(13,17,23,0.95)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "0.75rem", padding: "0.75rem 0.6rem",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem",
                backdropFilter: "blur(12px)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                zIndex: 10,
              }}
            >
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                aria-label="Volume"
                style={{
                  writingMode: "vertical-lr",
                  direction: "rtl",
                  width: 4,
                  height: 64,
                  WebkitAppearance: "slider-vertical",
                  accentColor: accent,
                  cursor: "pointer",
                }}
              />
              <span style={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>
          )}
          <button
            onClick={toggleMute}
            onMouseEnter={() => setShowVolume(true)}
            onMouseLeave={() => setShowVolume(false)}
            aria-label={isMuted ? "Unmute" : "Mute"}
            style={{
              background: "none", border: "none", cursor: "pointer", padding: "0.3rem",
              color: isMuted ? "var(--text-muted)" : "var(--text-secondary)",
              transition: "color 150ms ease",
            }}
          >
            {isMuted || volume === 0 ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            )}
          </button>
        </div>

        {/* Download */}
        <button
          id={`download-${title.replace(/\s+/g, "-").toLowerCase()}`}
          onClick={handleDownload}
          aria-label={`Download ${title}`}
          style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "0.5rem", cursor: "pointer", padding: "0.35rem 0.6rem",
            color: "var(--text-secondary)", transition: "all 150ms ease",
            display: "flex", alignItems: "center", gap: "0.35rem",
            fontSize: "0.72rem", fontWeight: 600,
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.background = `${accent}18`;
            el.style.borderColor = `${accent}40`;
            el.style.color = accent;
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.background = "rgba(255,255,255,0.04)";
            el.style.borderColor = "rgba(255,255,255,0.08)";
            el.style.color = "var(--text-secondary)";
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          MP3
        </button>
      </div>

      {/* Keyframes injected inline once */}
      <style>{`
        @keyframes bar-bounce {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
