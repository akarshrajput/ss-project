"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef, useEffect, useState } from "react";
import clsx from "clsx";
import type { SongGenerateInput, SongGenerateResult } from "@/lib/song/types";
import { WavePlayer } from "@/components/ui/wave-player";

// ─── Constants ────────────────────────────────────────────
const DEFAULT_PROMPT =
  "warm children song, acoustic instruments, gentle storytelling melody, family-safe content, clean vocal pronunciation";

const GENRES = ["Lullaby", "Pop", "Folk", "Orchestral", "Jazz", "Techno", "Lo-fi", "Rock", "Ambient", "Reggae"];
const MOODS = ["happy", "calm", "playful", "mysterious", "epic", "cute", "sad", "energetic", "spooky", "dreamy"];
const SCENES = ["Forest", "Space", "Ocean", "Castle", "City", "Classroom", "Playground", "Nighttime", "Farm", "Jungle"];
const VOCALS = ["Female vocal", "Male vocal", "Child voice", "Choir", "Rap", "Instrumental"];
const VOCAL_STYLES = [
  "soft, gentle delivery",
  "powerful, belted",
  "whispery, breathy",
  "cartoon, expressive",
  "tender, motherly",
  "operatic, theatrical",
];

const KEYS = ["C major", "G major", "D major", "A major", "F major", "A minor", "E minor"];
const STRUCTURES = ["Verse+Chorus", "Loop", "Story Arc", "Build-up"];
const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "de", label: "German" },
  { value: "hi", label: "Hindi" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
];
const ACCENTS = [
  { value: "US", label: "US" },
  { value: "UK", label: "UK" },
  { value: "Indian", label: "Indian" },
  { value: "Neutral", label: "Neutral" },
];

const GUEST_LIMIT_KEY = "songify_guest_generation_count";
function randomInt() { return Math.floor(Math.random() * 999_999_999); }
function readGuestCount() {
  if (typeof window === "undefined") return 0;
  const c = Number(window.localStorage.getItem(GUEST_LIMIT_KEY) ?? "0");
  return Number.isFinite(c) ? c : 0;
}
function incrementGuestCount() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(GUEST_LIMIT_KEY, String(readGuestCount() + 1));
}

// ─── Custom Select ─────────────────────────────────────────
function CustomSelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", userSelect: "none" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.45rem 0.75rem",
          borderRadius: "0.5rem",
          border: open ? "1px solid rgba(99,102,241,0.6)" : "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.04)",
          color: "var(--text-primary)",
          fontSize: "0.83rem",
          fontWeight: 500,
          cursor: "pointer",
          outline: "none",
          transition: "border-color 150ms",
          boxShadow: open ? "0 0 0 3px rgba(99,102,241,0.12)" : "none",
        }}
      >
        <span>{selected.label}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          style={{ opacity: 0.5, flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 150ms" }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 4px)",
          left: 0,
          right: 0,
          background: "#111827",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "0.6rem",
          overflow: "hidden",
          zIndex: 50,
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        }}>
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "0.5rem 0.75rem",
                fontSize: "0.83rem",
                color: opt.value === value ? "#a5b4fc" : "var(--text-secondary)",
                background: opt.value === value ? "rgba(99,102,241,0.12)" : "transparent",
                border: "none",
                cursor: "pointer",
                transition: "background 120ms",
                fontWeight: opt.value === value ? 600 : 400,
              }}
              onMouseEnter={(e) => { if (opt.value !== value) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={(e) => { if (opt.value !== value) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Custom Number Input ────────────────────────────────────
function NumberInput({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", overflow: "hidden", background: "rgba(255,255,255,0.04)" }}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        style={{ width: 32, height: 32, border: "none", background: "transparent", color: "var(--text-secondary)", cursor: "pointer", fontSize: "1rem", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        −
      </button>
      <span style={{ flex: 1, textAlign: "center", fontSize: "0.83rem", fontWeight: 600, color: "var(--text-primary)" }}>{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        style={{ width: 32, height: 32, border: "none", background: "transparent", color: "var(--text-secondary)", cursor: "pointer", fontSize: "1rem", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        +
      </button>
    </div>
  );
}

// ─── Chip group label ──────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.55rem" }}>
      {children}
    </p>
  );
}

// ─── Setting row ───────────────────────────────────────────
function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.4rem" }}>
        {label}
      </p>
      {children}
    </div>
  );
}

// ─── Card wrapper ─────────────────────────────────────────
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: "rgba(13,17,23,0.8)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "0.875rem",
      backdropFilter: "blur(16px)",
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Chip ──────────────────────────────────────────────────
function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.25rem 0.65rem",
        borderRadius: "0.4rem",
        fontSize: "0.78rem",
        fontWeight: 500,
        cursor: "pointer",
        border: active ? "1px solid rgba(99,102,241,0.6)" : "1px solid rgba(255,255,255,0.08)",
        background: active ? "rgba(99,102,241,0.18)" : "rgba(255,255,255,0.03)",
        color: active ? "#a5b4fc" : "var(--text-secondary)",
        transition: "all 130ms ease",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

// ─── Range slider ──────────────────────────────────────────
function RangeField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
        <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>{label}</p>
        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#a5b4fc" }}>{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#6366f1", cursor: "pointer" }}
      />
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────
export function StudioClient({ isAuthenticated }: { isAuthenticated: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState<SongGenerateInput>({
    basePrompt: DEFAULT_PROMPT,
    lyrics: searchParams.get("lyrics") ?? "",
    lyricsMode: "use",
    genre: null,
    moods: [],
    scene: null,
    vocalType: "Female vocal",
    vocalStyles: ["soft, gentle delivery"],
    language: "en",
    accent: "US",
    bpm: 90,
    energy: 40,
    keyScale: "G major",
    length: 30,
    structure: "Verse+Chorus",
    complexity: 35,
    seed: 31,
    vibeLock: false,
    kidSafe: true,
    timeSignature: "4",
  });

  // Sync ?lyrics param changes (e.g. back-nav) into the form
  useEffect(() => {
    const fromUrl = searchParams.get("lyrics");
    if (fromUrl) setForm((p) => ({ ...p, lyrics: fromUrl }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SongGenerateResult | null>(null);

  const tagPreview = useMemo(() => {
    return [
      form.basePrompt,
      form.genre,
      form.moods.join(", "),
      form.scene,
      form.vocalType,
      form.vocalStyles.join(", "),
      form.structure,
      form.kidSafe ? "kid-safe" : "standard",
    ].filter(Boolean).join(" | ");
  }, [form]);

  async function onGenerate() {
    setError(null);
    if (!isAuthenticated && readGuestCount() >= 1) {
      setError("Guest users can generate only one song. Login or register to continue.");
      return;
    }
    setIsGenerating(true);
    try {
      const payload: SongGenerateInput = { ...form, seed: form.vibeLock ? form.seed : randomInt() };
      const response = await fetch("/api/songs/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as SongGenerateResult | { error: string };
      if (!response.ok) throw new Error("error" in data ? data.error : "Generation failed");
      const songData = data as SongGenerateResult;
      setResult(songData);
      setForm((p) => ({ ...p, seed: songData.seed }));
      if (!isAuthenticated) incrementGuestCount();
      else router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unexpected error");
    } finally {
      setIsGenerating(false);
    }
  }

  function toggleMood(mood: string) {
    setForm((p) => {
      if (p.moods.includes(mood)) return { ...p, moods: p.moods.filter((m) => m !== mood) };
      if (p.moods.length >= 2) return { ...p, moods: [p.moods[1], mood] };
      return { ...p, moods: [...p.moods, mood] };
    });
  }

  function toggleVocalStyle(style: string) {
    setForm((p) => ({
      ...p,
      vocalStyles: p.vocalStyles.includes(style)
        ? p.vocalStyles.filter((s) => s !== style)
        : [...p.vocalStyles, style],
    }));
  }

  function requireAuthAction(target: "download" | "library") {
    router.push(`/login?next=/studio&intent=${target}`);
  }

  return (
    <section style={{ paddingBottom: "4rem" }}>

      {/* ── Studio header ───────────────────────────────── */}
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
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
            <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#a5b4fc" }}>AI Studio</span>
          </div>
          <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)" }}>
            Create polished songs in seconds
          </h1>
        </div>
        {!isAuthenticated && (
          <div style={{ fontSize: "0.8rem", color: "#fbbf24", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "0.5rem", padding: "0.45rem 0.85rem" }}>
            ⚡ Guest mode ·{" "}
            <Link href="/login?next=/studio" style={{ color: "#fbbf24", fontWeight: 700, textDecoration: "underline" }}>
              Login to unlock
            </Link>
          </div>
        )}
      </div>

      {/* ── Two-column layout ──────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 300px",
        gap: "1rem",
        alignItems: "start",
      }}>

        {/* ── LEFT COLUMN ─────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", minWidth: 0 }}>

          {/* Lyrics panel */}
          <Card style={{ padding: "1.25rem" }}>
            <h2 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem", letterSpacing: "-0.01em" }}>
              📝 Lyrics &amp; Core Style
            </h2>

            <FieldLabel>Base Prompt</FieldLabel>
            <textarea
              rows={2}
              value={form.basePrompt}
              onChange={(e) => setForm((p) => ({ ...p, basePrompt: e.target.value }))}
              style={{
                width: "100%",
                borderRadius: "0.5rem",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.03)",
                color: "var(--text-primary)",
                padding: "0.5rem 0.7rem",
                fontSize: "0.83rem",
                lineHeight: 1.6,
                resize: "vertical",
                outline: "none",
                fontFamily: "inherit",
                marginBottom: "0.85rem",
              }}
            />

            <FieldLabel>Lyrics / Story Text</FieldLabel>
            <textarea
              rows={5}
              placeholder="Paste your story, poem, or lyrics here…"
              value={form.lyrics}
              onChange={(e) => setForm((p) => ({ ...p, lyrics: e.target.value }))}
              style={{
                width: "100%",
                borderRadius: "0.5rem",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.03)",
                color: "var(--text-primary)",
                padding: "0.5rem 0.7rem",
                fontSize: "0.83rem",
                lineHeight: 1.6,
                resize: "vertical",
                outline: "none",
                fontFamily: "inherit",
                marginBottom: "0.85rem",
              }}
            />

            <FieldLabel>Mode</FieldLabel>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {[
                { key: "use", label: "Use as lyrics" },
                { key: "story", label: "Story → Song" },
                { key: "instrumental", label: "Instrumental" },
              ].map((item) => (
                <Chip
                  key={item.key}
                  active={form.lyricsMode === item.key}
                  onClick={() => setForm((p) => ({ ...p, lyricsMode: item.key as SongGenerateInput["lyricsMode"] }))}
                >
                  {item.label}
                </Chip>
              ))}
            </div>
          </Card>

          {/* Creative controls panel */}
          <Card style={{ padding: "1.25rem" }}>
            <h2 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem", letterSpacing: "-0.01em" }}>
              🎛️ Creative Controls
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

              {/* Genre */}
              <div>
                <FieldLabel>Genre</FieldLabel>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                  {GENRES.map((g) => (
                    <Chip key={g} active={form.genre === g} onClick={() => setForm((p) => ({ ...p, genre: p.genre === g ? null : g }))}>
                      {g}
                    </Chip>
                  ))}
                </div>
              </div>

              {/* Grid row: Mood + Scene */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <FieldLabel>Mood (max 2)</FieldLabel>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                    {MOODS.map((m) => (
                      <Chip key={m} active={form.moods.includes(m)} onClick={() => toggleMood(m)}>{m}</Chip>
                    ))}
                  </div>
                </div>
                <div>
                  <FieldLabel>Scene</FieldLabel>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                    {SCENES.map((s) => (
                      <Chip key={s} active={form.scene === s} onClick={() => setForm((p) => ({ ...p, scene: p.scene === s ? null : s }))}>
                        {s}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>

              {/* Vocal type */}
              <div>
                <FieldLabel>Vocal Type</FieldLabel>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                  {VOCALS.map((v) => (
                    <Chip key={v} active={form.vocalType === v} onClick={() => setForm((p) => ({ ...p, vocalType: v }))}>{v}</Chip>
                  ))}
                </div>
              </div>

              {/* Vocal style */}
              {form.vocalType !== "Instrumental" && (
                <div>
                  <FieldLabel>Vocal Style</FieldLabel>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                    {VOCAL_STYLES.map((s) => (
                      <Chip key={s} active={form.vocalStyles.includes(s)} onClick={() => toggleVocalStyle(s)}>{s}</Chip>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* ── RIGHT COLUMN — fixed 300px sidebar ──── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", minWidth: 0 }}>

          {/* Song settings */}
          <Card style={{ padding: "1.25rem" }}>
            <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>
              ⚙️ Song Settings
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>

              {/* Language */}
              <SettingRow label="Language">
                <CustomSelect
                  value={form.language}
                  options={LANGUAGES}
                  onChange={(v) => setForm((p) => ({ ...p, language: v }))}
                />
              </SettingRow>

              {/* Accent */}
              <SettingRow label="Accent">
                <CustomSelect
                  value={form.accent}
                  options={ACCENTS}
                  onChange={(v) => setForm((p) => ({ ...p, accent: v }))}
                />
              </SettingRow>

              {/* BPM */}
              <SettingRow label="BPM">
                <NumberInput value={form.bpm} min={60} max={180} onChange={(v) => setForm((p) => ({ ...p, bpm: v }))} />
              </SettingRow>

              {/* Length */}
              <SettingRow label="Length (sec)">
                <NumberInput value={form.length} min={10} max={180} onChange={(v) => setForm((p) => ({ ...p, length: v }))} />
              </SettingRow>

              {/* Key */}
              <SettingRow label="Key">
                <CustomSelect
                  value={form.keyScale}
                  options={KEYS.map((k) => ({ value: k, label: k }))}
                  onChange={(v) => setForm((p) => ({ ...p, keyScale: v }))}
                />
              </SettingRow>

              {/* Structure */}
              <SettingRow label="Structure">
                <CustomSelect
                  value={form.structure}
                  options={STRUCTURES.map((s) => ({ value: s, label: s }))}
                  onChange={(v) => setForm((p) => ({ ...p, structure: v }))}
                />
              </SettingRow>

              {/* Energy */}
              <RangeField
                label="Energy"
                value={form.energy}
                min={0}
                max={100}
                onChange={(v) => setForm((p) => ({ ...p, energy: v }))}
              />

              {/* Complexity */}
              <RangeField
                label="Complexity"
                value={form.complexity}
                min={0}
                max={100}
                onChange={(v) => setForm((p) => ({ ...p, complexity: v }))}
              />

              {/* Tag preview */}
              <div>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.4rem" }}>
                  Tag Preview
                </p>
                <div style={{
                  fontSize: "0.7rem",
                  lineHeight: 1.6,
                  color: "var(--text-muted)",
                  fontFamily: "monospace",
                  background: "rgba(0,0,0,0.35)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "0.4rem",
                  padding: "0.5rem 0.65rem",
                  wordBreak: "break-word",
                }}>
                  {tagPreview}
                </div>
              </div>

              {/* Generate button */}
              <button
                type="button"
                disabled={isGenerating}
                onClick={onGenerate}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  width: "100%",
                  padding: "0.7rem",
                  borderRadius: "0.6rem",
                  border: "none",
                  background: isGenerating
                    ? "rgba(99,102,241,0.4)"
                    : "linear-gradient(135deg, #6366f1, #818cf8)",
                  color: "#fff",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  cursor: isGenerating ? "not-allowed" : "pointer",
                  boxShadow: "0 0 20px rgba(99,102,241,0.3)",
                  transition: "opacity 180ms, box-shadow 180ms",
                }}
              >
                {isGenerating ? (
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
                    Create Song
                  </>
                )}
              </button>

              {error && (
                <div style={{ fontSize: "0.78rem", color: "#fca5a5", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "0.4rem", padding: "0.5rem 0.65rem", lineHeight: 1.5 }}>
                  {error}
                </div>
              )}
            </div>
          </Card>

          {/* Result card */}
          <Card style={{ padding: "1.25rem" }}>
            <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.85rem" }}>
              🎧 Output
            </h3>

            {result ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>

                {/* WaveSurfer player */}
                <WavePlayer
                  key={result.audioUrl}
                  src={result.audioUrl}
                  title={form.genre ?? "AI Song"}
                  artist="Songify Studio"
                  genre={form.genre ?? undefined}
                  accent="#6366f1"
                />



                {/* View Library */}
                <Link
                  href={isAuthenticated ? "/library" : "/login?next=/library"}
                  style={{
                    display: "block", textAlign: "center", textDecoration: "none",
                    fontSize: "0.8rem", fontWeight: 600, padding: "0.5rem",
                    borderRadius: "0.5rem", border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.03)", color: "var(--text-muted)",
                  }}
                >
                  {isAuthenticated ? "View Library →" : "Login to save"}
                </Link>
              </div>

            ) : (
              <div style={{ padding: "1.5rem 0", textAlign: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.6rem" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.8">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                  Audio preview appears here after generation.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
        textarea:focus, input:focus { outline: none; border-color: rgba(99,102,241,0.6) !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
      `}</style>
    </section>
  );
}
