"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { CaretDown } from "@phosphor-icons/react";
import { deriveUsernameFromEmail } from "@/lib/username-utils";

const PLACEHOLDER_LINES = [
  "Golden lights are dancing in the midnight rain",
  "I wrote your name into the chorus again",
  "Every broken memory turns into a spark",
  "We keep singing louder till we light the dark",
  "Tell me where the heartache goes when songs begin",
];

const THEMES = ["Love", "Adventure", "Nostalgia", "Party", "Heartbreak", "Motivation", "Nature", "Fantasy"];
const GENRES = ["Pop", "Rock", "Hip-Hop", "R&B", "Country", "Jazz", "Lo-fi", "EDM", "Folk", "Classical"];
const MOODS = ["Happy", "Sad", "Energetic", "Calm", "Dark", "Dreamy", "Upbeat", "Melancholic"];
const DURATIONS = [
  { value: 15, label: "15s" },
  { value: 30, label: "30s" },
  { value: 60, label: "1 min" },
  { value: 120, label: "2 min" },
];

type ModalStep = "options" | "details" | "success";

function getInboxAction(emailAddress: string) {
  const domain = emailAddress.trim().toLowerCase().split("@")[1] ?? "";

  if (domain === "gmail.com" || domain === "googlemail.com") {
    return { href: "https://mail.google.com", label: "Open Gmail" };
  }

  if (domain === "yahoo.com" || domain === "ymail.com" || domain === "rocketmail.com") {
    return { href: "https://mail.yahoo.com", label: "Open Yahoo Mail" };
  }

  if (domain === "outlook.com" || domain === "hotmail.com" || domain === "live.com" || domain === "msn.com") {
    return { href: "https://outlook.live.com/mail/", label: "Open Outlook" };
  }

  if (domain === "icloud.com" || domain === "me.com" || domain === "mac.com") {
    return { href: "https://www.icloud.com/mail", label: "Open iCloud Mail" };
  }

  return { href: `mailto:${emailAddress.trim()}`, label: "Open your email app" };
}

async function resolveAvailableUsername(baseUsername: string) {
  const base = baseUsername.toLowerCase().trim();
  const candidates = [base];

  for (let index = 1; index <= 8; index += 1) {
    candidates.push(`${base}_${index}`);
  }

  for (const candidate of candidates) {
    const res = await fetch(`/api/song-queue/check-username?username=${encodeURIComponent(candidate)}`);
    const data = await res.json();
    if (data.available) {
      return candidate;
    }
  }

  return `${base}_${Math.random().toString(36).slice(2, 6)}`;
}

export function QuickGenerate({ hasActivePlan = false }: { hasActivePlan?: boolean }) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [placeholderText, setPlaceholderText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<ModalStep>("options");

  // Options step
  const [basePrompt, setBasePrompt] = useState("");
  const [theme, setTheme] = useState<string | null>(null);
  const [genre, setGenre] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [duration, setDuration] = useState(60);
  const [vocalType, setVocalType] = useState<string>("Female voice");

  // Details step
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [emailLookupStatus, setEmailLookupStatus] = useState<"idle" | "checking" | "found" | "new" | "invalid" | "error">("idle");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sendingLink, setSendingLink] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedSongId, setSubmittedSongId] = useState<string | null>(null);
  const [savedEmail, setSavedEmail] = useState<string | null>(null);
  const [savedUsername, setSavedUsername] = useState<string | null>(null);
  const [emailVerifiedFromLink, setEmailVerifiedFromLink] = useState(false);
  const [sessionId, setSessionId] = useState("");

  const inboxAction = getInboxAction(email);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    // Check localStorage for previous session
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("songify_email");
      const storedUsername = localStorage.getItem("songify_username");
      setSavedEmail(storedEmail);
      setSavedUsername(storedUsername);
      if (storedEmail) {
        setEmail(storedEmail);
        setUsername(storedUsername || deriveUsernameFromEmail(storedEmail));
        if (storedUsername) setEmailLookupStatus("found");
      }
    }

    // Check for magic link params
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const verifyEmailParam = params.get("verifyEmail");
      const actionParam = params.get("action");
      if (verifyEmailParam && actionParam === "quickGen") {
        setShowModal(true);
        setStep("details");
        setEmail(verifyEmailParam);
        setEmailVerifiedFromLink(true);
        setEmailLookupStatus("new");

        // Restore form state from URL params
        const lyricsParam = params.get("lyrics");
        if (lyricsParam) setValue(lyricsParam);
        const basePromptParam = params.get("basePrompt");
        if (basePromptParam) setBasePrompt(basePromptParam);
        const durationParam = params.get("duration");
        if (durationParam) setDuration(parseInt(durationParam, 10) || 30);

        // Auto-generate username from the email local part.
        setUsername(deriveUsernameFromEmail(verifyEmailParam));

        const linkSessionId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
        setSessionId(linkSessionId);

        fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: linkSessionId,
            status: "email_viewed",
            lyrics: lyricsParam || value.trim(),
            duration: durationParam ? parseInt(durationParam, 10) : duration,
            theme,
            genre,
            mood,
            basePrompt: basePromptParam || basePrompt,
            email: verifyEmailParam,
          }),
        }).catch((err) => console.error("Analytics error", err));

        // Clean up URL without refreshing
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  useEffect(() => {
    if (value.length > 0) {
      setPlaceholderText("");
      return;
    }

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const sleep = (ms: number) => new Promise((resolve) => {
      timeoutId = setTimeout(resolve, ms);
    });

    const run = async () => {
      while (!cancelled) {
        for (let lineIndex = 0; lineIndex < PLACEHOLDER_LINES.length && !cancelled; lineIndex += 1) {
          const line = PLACEHOLDER_LINES[lineIndex];

          for (let index = 1; index <= line.length && !cancelled; index += 1) {
            setPlaceholderText(line.slice(0, index));
            await sleep(30);
          }

          await sleep(900);

          for (let index = line.length; index >= 0 && !cancelled; index -= 1) {
            setPlaceholderText(line.slice(0, index));
            await sleep(18);
          }

          setPlaceholderText("");
          await sleep(220);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [value]);

  function onEmailChange(val: string) {
    setEmail(val);
    setEmailVerifiedFromLink(false);
    setEmailLookupStatus("idle");
    setUsername(deriveUsernameFromEmail(val));
    setMagicLinkSent(false);
  }

  async function verifyEmail() {
    setError(null);
    const normalizedEmail = email.trim();

    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setEmailLookupStatus("invalid");
      return;
    }

    setSendingLink(true);
    setEmailLookupStatus("checking");

    try {
      // Generate songId for the email link (not added to DB yet)
      const songIdRes = await fetch("/api/song-queue/generate-song-id", {
        method: "GET",
      });
      const songIdData = await songIdRes.json();
      if (!songIdRes.ok) throw new Error("Failed to generate song ID.");

      const songId = songIdData.songId;
      setSubmittedSongId(songId);

      // Send email with all song data as URL params (song NOT yet in DB)
      const linkRes = await fetch("/api/song-queue/send-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          songId,
          lyrics: value.trim(),
          theme,
          genre,
          mood,
          duration,
          sessionId, // Pass the analytics sessionId
          basePrompt, // Pass the basePrompt style prompt
          vocalType, // Pass the selected vocalType
        }),
      });
      const linkData = await linkRes.json();

      if (!linkRes.ok) {
        throw new Error(linkData.error || "Failed to send link.");
      }

      setEmailLookupStatus("idle");
      setMagicLinkSent(true);
    } catch (err) {
      setEmailLookupStatus("error");
      setError(err instanceof Error ? err.message : "Unable to process your request right now.");
    } finally {
      setSendingLink(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) { textareaRef.current?.focus(); return; }

    if (hasActivePlan) {
      window.location.href = `/studio?lyrics=${encodeURIComponent(value.trim())}`;
      return;
    }

    setShowModal(true);
    setStep("options");
    setError(null);

    const newSessionId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
    setSessionId(newSessionId);

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: newSessionId,
        status: "started",
        lyrics: value.trim(),
        duration,
        theme,
        genre,
        mood,
        basePrompt,
      }),
    }).catch((err) => console.error("Analytics error", err));
  }

  async function handleProceed(): Promise<string | null> {
    setError(null);
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return null;
    }

    const baseUsername = deriveUsernameFromEmail(email);
    const resolvedUsername = await resolveAvailableUsername(baseUsername);

    setSubmitting(true);
    try {
      const res = await fetch("/api/song-queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lyrics: value.trim(),
          theme,
          genre,
          mood,
          duration,
          email: email.trim(),
          username: resolvedUsername,
          basePrompt,
          vocalType,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      // Save to localStorage for future requests
      if (typeof window !== "undefined") {
        localStorage.setItem("songify_email", email.trim());
        localStorage.setItem("songify_username", resolvedUsername);
      }

      setSubmittedSongId(data.songId ?? null);
      setStep("success");

      if (sessionId) {
        fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            status: "completed",
            email: email.trim(),
            lyrics: value.trim(),
            theme,
            genre,
            mood,
            duration,
            basePrompt,
          }),
        }).catch((err) => console.error("Analytics error", err));
      }

      return data.songId ?? null;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      return null;
    } finally {
      setSubmitting(false);
    }
  }

  function handleProceedToEmail() {
    setStep("details");
    setError(null);

    if (sessionId) {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          status: "email_viewed",
          lyrics: value.trim(),
          duration,
          theme,
          genre,
          mood,
          basePrompt,
        }),
      }).catch((err) => console.error("Analytics error", err));
    }
  }

  async function handleSubmitRequest() {
    if (submitting) return;
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();
    const hasStoredIdentity = Boolean(
      savedEmail &&
      savedUsername &&
      savedEmail.trim().toLowerCase() === normalizedEmail &&
      savedUsername.trim().toLowerCase() === normalizedUsername,
    );

    if (hasStoredIdentity || emailVerifiedFromLink) {
      await handleProceed();
      return;
    }

    await verifyEmail();
  }

  function closeModal() {
    setShowModal(false);
    if (step === "success") {
      setValue("");
      setBasePrompt("");
      setTheme(null); setGenre(null); setMood(null); setDuration(30);
      setEmail(""); setUsername(""); setEmailLookupStatus("idle"); setMagicLinkSent(false);
      setSubmittedSongId(null);
    }
    setStep("options");
    setError(null);
  }

  const chipStyle = (active: boolean): React.CSSProperties => ({
    display: "inline-flex", alignItems: "center",
    padding: "0.3rem 0.75rem", borderRadius: "0.5rem",
    fontSize: "0.8rem", fontWeight: 500, cursor: "pointer",
    border: active ? "1px solid rgba(99,102,241,0.6)" : "1px solid rgba(255,255,255,0.1)",
    background: active ? "rgba(99,102,241,0.18)" : "rgba(255,255,255,0.03)",
    color: active ? "#a5b4fc" : "var(--text-secondary)",
    transition: "all 150ms ease", whiteSpace: "nowrap",
  });

  return (
    <>
      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 680, margin: "0 auto", position: "relative" }} aria-label="Quick text to song generator">



        <div style={{
          position: "relative", borderRadius: "1rem",
          border: focused ? "1.5px solid rgba(99,102,241,0.6)" : "1.5px solid rgba(255,255,255,0.10)",
          background: "rgba(13,17,23,0.85)", backdropFilter: "blur(20px)",
          boxShadow: focused ? "0 0 0 4px rgba(99,102,241,0.12), 0 8px 40px rgba(0,0,0,0.4)" : "0 4px 24px rgba(0,0,0,0.3)",
          transition: "border-color 180ms ease, box-shadow 180ms ease",
          display: "flex",
          flexDirection: "column",
        }}>
          {/* Textarea and Placeholder wrapper */}
          <div style={{ position: "relative", width: "100%", flexGrow: 1 }}>
            {value.length === 0 && (
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "1.1rem",
                  left: "1.25rem",
                  right: "1.25rem",
                  color: "rgba(255,255,255,0.34)",
                  fontSize: "1rem",
                  lineHeight: 1.65,
                  whiteSpace: "pre-wrap",
                  pointerEvents: "none",
                  fontFamily: '"Inter", system-ui, sans-serif',
                  userSelect: "none",
                  textAlign: "left",
                }}
              >
                {placeholderText}
                <span style={{ opacity: 0.9, animation: "placeholder-caret 1s steps(1) infinite" }}>▍</span>
              </div>
            )}
            <textarea ref={textareaRef} id="quick-generate-input" rows={3} value={value}
              onChange={(e) => setValue(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
              onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSubmit(e as unknown as React.FormEvent); }}
              placeholder="" aria-label="Type your song idea, lyrics, or story"
              style={{
                width: "100%",
                padding: "1.1rem 1.25rem 0.5rem",
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--text-primary)",
                fontSize: "1rem",
                lineHeight: 1.65,
                resize: "none",
                fontFamily: '"Inter", system-ui, sans-serif',
                borderRadius: "1rem 1rem 0 0",
                display: "block"
              }}
            />
          </div>

          {/* Footer Controls (in normal document flow, absolutely no overlapping possible!) */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.2rem 1.25rem 0.85rem",
            background: "transparent",
            borderRadius: "0 0 1rem 1rem",
          }}>
            <span style={{ fontSize: "0.72rem", color: value.length > 0 ? "var(--text-muted)" : "transparent", fontVariantNumeric: "tabular-nums", transition: "color 200ms" }}>
              {value.length} chars · ⌘↵ to generate
            </span>
            <button type="submit" id="quick-generate-btn" style={{
              display: "inline-flex", alignItems: "center", gap: "0.45rem", padding: "0.55rem 1.25rem", borderRadius: "0.65rem", border: "none",
              background: value.trim() ? "linear-gradient(135deg, #6366f1, #818cf8)" : "rgba(99,102,241,0.25)",
              color: value.trim() ? "#fff" : "rgba(255,255,255,0.4)", fontSize: "0.88rem", fontWeight: 700,
              cursor: value.trim() ? "pointer" : "default",
              boxShadow: value.trim() ? "0 0 20px rgba(99,102,241,0.4)" : "none", transition: "all 200ms ease",
            }}>
              {/* <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg> */}
              Create Free song
            </button>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", justifyContent: "center", marginTop: "0.85rem" }} aria-label="Example prompts">
          {["Pop anthem", "Rap verse", "Sad ballad", "Epic film score", "Lo-fi beat"].map((tag) => (
            <button key={tag} type="button" onClick={() => setValue((v) => v ? v : `Write a ${tag.toLowerCase()} about `)}
              style={{ fontSize: "0.72rem", padding: "0.28rem 0.75rem", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "var(--text-muted)", cursor: "pointer", transition: "all 150ms ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.45)"; e.currentTarget.style.color = "#a5b4fc"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "var(--text-muted)"; }}
            >{tag}</button>
          ))}
        </div>

        {/* Minimal Trusted By Logos */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "0.55rem", marginTop: "1.75rem" }} aria-label="Trusted companies">
          <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)", opacity: 0.75 }}>
            Trusted by
          </span>
          <img src="/trusted/nba_logo1.svg" alt="NBA" style={{ height: "38px", filter: "brightness(0) invert(1) opacity(0.75)", objectFit: "contain" }} />
        </div>
      </form>

      {/* ─── MODAL (Portal to body) ─────────────────────────── */}
      {showModal && createPortal(
        <>
          {/* Backdrop */}
          <div onClick={closeModal} style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }} />
          {/* Modal wrapper — true center */}
          <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", padding: "1.5rem" }}>
            <div style={{
              position: "relative", width: "100%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto",
              background: "rgba(13,17,23,0.98)", border: "1px solid rgba(99,102,241,0.25)",
              borderRadius: "1.25rem", padding: "1.5rem 2rem", pointerEvents: "auto",
              boxShadow: "0 0 60px rgba(99,102,241,0.15), 0 24px 80px rgba(0,0,0,0.6)",
              animation: "modal-in 0.25s ease",
            }}>
              {/* Close button */}
              <button onClick={closeModal} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.2rem", lineHeight: 1 }} aria-label="Close">✕</button>

              {/* ── Step 1: Options ─────────────────────────── */}
              {step === "options" && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1", boxShadow: "0 0 8px #6366f1" }} />
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#a5b4fc" }}>Customize Your Song</span>
                    </div>
                    <Link
                      href="/register?plan=24h-unlimited"
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#a5b4fc",
                        textDecoration: "underline",
                        marginRight: "1.5rem",
                      }}
                    >
                      Generate song without any delay on just 1$
                    </Link>
                  </div>

                  {/* Lyrics preview */}
                  <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "0.6rem", padding: "0.5rem 0.85rem", marginBottom: "0.75rem" }}>
                    <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "0.15rem" }}>Your Lyrics</p>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.4, maxHeight: 40, overflow: "hidden" }}>{value.slice(0, 200)}{value.length > 200 ? "…" : ""}</p>
                  </div>

                  <details className="advanced-dropdown" style={{ marginBottom: "1.25rem" }}>
                    <summary style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      listStyle: "none",
                      cursor: "pointer",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#a5b4fc",
                      marginBottom: "0.75rem",
                      userSelect: "none",
                    }}>
                      <span>Advanced</span>
                      <CaretDown className="advanced-dropdown__icon" size={16} weight="bold" aria-hidden="true" />
                    </summary>

                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1.2rem",
                      maxHeight: "45vh",
                      overflowY: "auto",
                      padding: "1rem",
                      borderRadius: "0.75rem",
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.025)",
                      scrollbarWidth: "thin",
                    }} className="customize-scrollable">

                      {/* Base Prompt */}
                      <div>
                        <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Base Prompt (Optional)</p>
                        <textarea
                          value={basePrompt}
                          onChange={(e) => setBasePrompt(e.target.value)}
                          placeholder="Describe the style, instruments, or vibe..."
                          rows={2}
                          style={{
                            width: "100%", padding: "0.5rem 0.85rem", borderRadius: "0.5rem", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "var(--text-primary)", fontSize: "0.88rem", outline: "none", fontFamily: "inherit", transition: "border-color 150ms", resize: "none"
                          }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.6)"; }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                        />
                      </div>

                      {/* Vocal Type */}
                      <div>
                        <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Vocal Type</p>
                        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                          {["Female voice", "Male voice", "Children"].map((v) => (
                            <button
                              key={v}
                              type="button"
                              onClick={() => setVocalType(v)}
                              style={chipStyle(vocalType === v)}
                            >
                              {v}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Duration */}
                      <div>
                        <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Duration</p>
                        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                          {DURATIONS.map((d) => (
                            <button
                              key={d.value}
                              type="button"
                              onClick={() => setDuration(d.value)}
                              style={chipStyle(duration === d.value)}
                            >
                              {d.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Genre */}
                      <div>
                        <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Genre</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                          <button
                            type="button"
                            onClick={() => setGenre(null)}
                            style={chipStyle(genre === null)}
                          >
                            All
                          </button>
                          {GENRES.map((g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => setGenre(g)}
                              style={chipStyle(genre === g)}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Mood */}
                      <div>
                        <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Mood</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                          <button
                            type="button"
                            onClick={() => setMood(null)}
                            style={chipStyle(mood === null)}
                          >
                            All
                          </button>
                          {MOODS.map((m) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setMood(m)}
                              style={chipStyle(mood === m)}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </details>

                  <button type="button" onClick={handleProceedToEmail} style={{
                    width: "100%", padding: "0.75rem", borderRadius: "0.65rem", border: "none",
                    background: "linear-gradient(135deg, #6366f1, #818cf8)", color: "#fff",
                    fontSize: "0.92rem", fontWeight: 700, cursor: "pointer",
                    boxShadow: "0 0 20px rgba(99,102,241,0.3)", transition: "opacity 180ms",
                  }}>
                    Continue →
                  </button>
                </div>
              )}

              {/* ── Step 2: Details ─────────────────────────── */}
              {step === "details" && (
                <div>
                  <button type="button" onClick={() => setStep("options")} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.8rem", marginBottom: "0.75rem", padding: 0 }}>← Back</button>

                  {magicLinkSent ? (
                    <div style={{ textAlign: "center", padding: "1.5rem 0 2rem" }}>
                      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(99,102,241,0.15)", border: "2px solid rgba(99,102,241,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", fontSize: "1.8rem" }}>✉️</div>
                      <h2 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "1.35rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>Check Your Inbox</h2>
                      <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                        We sent you a song access link, please check your email.<br />
                        <a href={inboxAction.href} target="_blank" rel="noreferrer" style={{ color: "#c7d2fe", fontWeight: 700, textDecoration: "underline" }}>
                          Click here to {inboxAction.label}
                        </a>
                      </p>
                    </div>
                  ) : (
                    <>
                      <h2 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "1.35rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.4rem" }}>Almost there!</h2>
                      <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1.5rem" }}>We&apos;ll send your finished song to your email address when it&apos;s ready.</p>

                      {/* Email */}
                      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Email Address</label>
                      <div style={{ display: "flex", gap: "0.6rem", alignItems: "stretch", marginBottom: "0.75rem" }}>
                        <input type="email" value={email} onChange={(e) => onEmailChange(e.target.value)} placeholder="you@example.com"
                          style={{ flex: 1, padding: "0.6rem 0.85rem", borderRadius: "0.5rem", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "var(--text-primary)", fontSize: "0.88rem", outline: "none", fontFamily: "inherit", transition: "border-color 150ms" }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.6)"; }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                        />
                      </div>
                      {error && (
                        <div style={{ fontSize: "0.82rem", color: "#fca5a5", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "0.5rem", padding: "0.6rem 0.85rem", marginBottom: "1rem" }}>{error}</div>
                      )}

                      <button type="button" onClick={handleSubmitRequest} disabled={submitting} style={{
                        width: "100%", padding: "0.75rem", borderRadius: "0.65rem", border: "none",
                        background: (submitting || sendingLink) ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg, #6366f1, #818cf8)",
                        color: "#fff", fontSize: "0.92rem", fontWeight: 700,
                        cursor: (submitting || sendingLink) ? "not-allowed" : "pointer",
                        boxShadow: "0 0 20px rgba(99,102,241,0.3)", transition: "opacity 180ms",
                      }}>
                        {sendingLink ? "Sending a secure link to your email..." : submitting ? "Submitting…" : "Continue"}
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* ── Step 3: Success ─────────────────────────── */}
              {step === "success" && (
                <div style={{ textAlign: "center", padding: "1rem 0" }}>
                  <h2 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.6rem" }}>You&apos;re All Set!</h2>
                  <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "0.5rem", maxWidth: 380, margin: "0 auto 1.5rem" }}>
                    Your song request has been submitted successfully.
                  </p>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "0.9rem" }}>
                    Your song page is ready for @{username}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.9rem" }}>
                    {submittedSongId && (
                      <Link href={`/song/${submittedSongId}`} onClick={closeModal} style={{ color: "#a5b4fc", textDecoration: "underline", fontWeight: 700, fontSize: "0.9rem" }}>
                        Open song
                      </Link>
                    )}
                    <button type="button" onClick={closeModal} style={{
                      padding: "0.7rem 2rem", borderRadius: "0.65rem", border: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(255,255,255,0.05)", color: "var(--text-primary)",
                      fontSize: "0.88rem", fontWeight: 600, cursor: "pointer", transition: "all 180ms",
                    }}>Got it!</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>,
        document.body
      )}

      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes placeholder-caret {
          0%, 49% { opacity: 0; }
          50%, 100% { opacity: 1; }
        }

        .advanced-dropdown::-webkit-details-marker {
          display: none;
        }

        .advanced-dropdown__icon {
          display: inline-block;
          transition: transform 160ms ease;
          flex-shrink: 0;
        }

        .advanced-dropdown[open] .advanced-dropdown__icon {
          transform: rotate(180deg);
        }
      `}</style>
    </>
  );
}
