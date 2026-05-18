"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface WavePlayerProps {
  src: string;
  title: string;
  artist?: string;
  genre?: string;
  duration?: string;
  accent?: string;
  titleHref?: string;
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function formatTime(seconds: number) {
  if (isNaN(seconds)) return "0:00";
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
  titleHref,
}: WavePlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolume, setShowVolume] = useState(false);

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Sync source change
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setTotalDuration(0);
  }, [src]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
  }, [isPlaying]);

  const handleVolumeChange = useCallback((v: number) => {
    setVolume(v);
    if (v > 0) setIsMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const handleDownload = useCallback(() => {
    const a = document.createElement("a");
    a.href = src;
    a.download = `${title}.mp3`;
    a.click();
  }, [src, title]);

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
      <style dangerouslySetInnerHTML={{__html: `
        .player-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 0 8px ${accent};
          cursor: pointer;
          transition: transform 150ms ease;
        }
        .player-slider::-webkit-slider-thumb:hover {
          transform: scale(1.3);
        }
        .player-slider::-moz-range-thumb {
          width: 10px;
          height: 10px;
          border: none;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 0 8px ${accent};
          cursor: pointer;
          transition: transform 150ms ease;
        }
        .player-slider::-moz-range-thumb:hover {
          transform: scale(1.3);
        }
        @keyframes bar-bounce {
          0% { height: 6px; }
          100% { height: 18px; }
        }
      `}} />

      {/* Hidden HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src={src}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setTotalDuration(audioRef.current.duration);
          }
        }}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent, ${accent}70, transparent)`,
        }}
      />

      {/* Track info row */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "0.5rem" }}>
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
            {titleHref ? (
              <Link href={titleHref} style={{ color: "inherit", textDecoration: "none" }} onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")} onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}>
                {title}
              </Link>
            ) : title}
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

      {/* Modern, Lightweight Custom Progress Bar Slider */}
      <div style={{ position: "relative", margin: "0.85rem 0" }}>
        <input
          type="range"
          min={0}
          max={totalDuration || 100}
          value={currentTime}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            setCurrentTime(val);
            if (audioRef.current) {
              audioRef.current.currentTime = val;
            }
          }}
          style={{
            width: "100%",
            height: "4px",
            borderRadius: "999px",
            background: `linear-gradient(to right, ${accent} ${totalDuration ? (currentTime / totalDuration) * 100 : 0}%, rgba(255,255,255,0.08) ${totalDuration ? (currentTime / totalDuration) * 100 : 0}%)`,
            outline: "none",
            cursor: "pointer",
            WebkitAppearance: "none",
            appearance: "none",
            display: "block",
            margin: 0,
            padding: 0
          }}
          className="player-slider"
        />
      </div>

      {/* Controls row */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {/* Play/Pause */}
        <button
          id={`play-${title.replace(/\s+/g, "-").toLowerCase()}`}
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause song" : "Play song"}
          style={{
            flexShrink: 0, width: 36, height: 36, borderRadius: "50%",
            background: `linear-gradient(135deg, ${accent}, ${accent}bb)`,
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 14px ${accent}40`,
            transition: "transform 180ms ease, box-shadow 180ms ease",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
        >
          {isPlaying ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white" style={{ marginLeft: "2px" }}>
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
    </div>
  );
}
