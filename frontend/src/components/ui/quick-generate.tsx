"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

const PLACEHOLDERS = [
  "A rainy night, a broken heart, a neon sign...",
  "Write me an upbeat summer anthem about freedom...",
  "Turn this into a hip-hop track: chasing dreams...",
  "A lullaby about stars and moonlight for kids...",
  "Epic orchestral battle theme, warriors at dawn...",
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

export function QuickGenerate() {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [placeholder, setPlaceholder] = useState(PLACEHOLDERS[0]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<ModalStep>("options");

  // Options step
  const [basePrompt, setBasePrompt] = useState("");
  const [theme, setTheme] = useState<string | null>(null);
  const [genre, setGenre] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [duration, setDuration] = useState(30);

  // Details step
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [emailLookupStatus, setEmailLookupStatus] = useState<"idle" | "checking" | "found" | "new" | "invalid" | "error">("idle");
  const [emailLookupMessage, setEmailLookupMessage] = useState<string | null>(null);
  const [usernameLocked, setUsernameLocked] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setPlaceholder(PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]);

    // Check localStorage for previous session
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("songify_email");
      const savedUsername = localStorage.getItem("songify_username");
      if (savedEmail) {
        setEmail(savedEmail);
        if (savedUsername) {
          setUsername(savedUsername);
          setEmailLookupStatus("found");
          setUsernameStatus("available");
          setUsernameLocked(true);
        }
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
        setEmailLookupStatus("new");

        // Restore form state from URL params
        const lyricsParam = params.get("lyrics");
        if (lyricsParam) setValue(lyricsParam);
        const basePromptParam = params.get("basePrompt");
        if (basePromptParam) setBasePrompt(basePromptParam);
        const durationParam = params.get("duration");
        if (durationParam) setDuration(parseInt(durationParam, 10) || 30);

        // Auto-generate username: "akarshrajput.01@gmail.com" -> "akarshrajput"
        const generatedUname = verifyEmailParam.split("@")[0].split(".")[0].replace(/[^a-zA-Z0-9_]/g, "");
        setUsername(generatedUname);
        setUsernameStatus("idle");

        // Clean up URL without refreshing
        window.history.replaceState({}, document.title, window.location.pathname);

        // Trigger username check after a short delay
        setTimeout(() => {
          if (generatedUname.length >= 3) {
            // Note: In real app, we'd ensure `checkUsername` is stable or handle deps.
            // But doing it here with the exact same fetch is fine since we can't easily reference the callback here without warnings.
            fetch(`/api/song-queue/check-username?username=${encodeURIComponent(generatedUname)}`)
              .then(res => res.json())
              .then(data => setUsernameStatus(data.available ? "available" : "taken"))
              .catch(() => setUsernameStatus("idle"));
          }
        }, 500);
      }
    }
  }, []);

  // Real-time username check
  const checkUsername = useCallback(async (uname: string) => {
    if (usernameLocked) return;
    if (uname.length < 3) { setUsernameStatus("idle"); return; }
    if (!/^[a-zA-Z0-9_]+$/.test(uname)) { setUsernameStatus("idle"); return; }
    setUsernameStatus("checking");
    try {
      const res = await fetch(`/api/song-queue/check-username?username=${encodeURIComponent(uname)}`);
      const data = await res.json();
      setUsernameStatus(data.available ? "available" : "taken");
    } catch { setUsernameStatus("idle"); }
  }, [usernameLocked]);

  function onUsernameChange(val: string) {
    if (usernameLocked) return;
    setUsername(val);
    clearTimeout(debounceRef.current);
    if (val.trim().length >= 3) {
      debounceRef.current = setTimeout(() => checkUsername(val.trim()), 400);
    } else {
      setUsernameStatus("idle");
    }
  }

  function onEmailChange(val: string) {
    setEmail(val);
    setEmailLookupStatus("idle");
    setEmailLookupMessage(null);
    setUsernameLocked(false);
    setUsername("");
    setUsernameStatus("idle");
    setMagicLinkSent(false);
  }

  async function verifyEmail() {
    setError(null);
    clearTimeout(debounceRef.current);
    const normalizedEmail = email.trim();

    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setEmailLookupStatus("invalid");
      setEmailLookupMessage("Please enter a valid email address first.");
      return;
    }

    setEmailLookupStatus("checking");
    setEmailLookupMessage(null);

    try {
      const res = await fetch(`/api/song-queue/check-email?email=${encodeURIComponent(normalizedEmail)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Email verification failed.");
      }

      if (data.exists && data.username) {
        setUsername(data.username);
        setUsernameLocked(true);
        setUsernameStatus("available");
        setEmailLookupStatus("found");
        setEmailLookupMessage(null);
        return;
      }

      setEmailLookupMessage("Sending a secure link to your email...");
      const linkRes = await fetch("/api/song-queue/send-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: normalizedEmail,
          lyrics: value.trim(),
          basePrompt: basePrompt.trim(),
          duration: duration
        }),
      });
      const linkData = await linkRes.json();
      
      if (!linkRes.ok) {
        throw new Error(linkData.error || "Failed to send link.");
      }

      setUsernameLocked(false);
      setUsername("");
      setUsernameStatus("idle");
      setEmailLookupStatus("idle"); 
      setMagicLinkSent(true);
      setEmailLookupMessage("We've sent a secure link to your email! Please click it to continue.");
    } catch (err) {
      setEmailLookupStatus("error");
      setEmailLookupMessage(err instanceof Error ? err.message : "Unable to verify email right now.");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) { textareaRef.current?.focus(); return; }
    setShowModal(true);
    setStep("options");
    setError(null);
  }

  async function handleProceed() {
    setError(null);
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (emailLookupStatus === "idle" || emailLookupStatus === "checking") {
      setError("Please verify your email first.");
      return;
    }
    if (!username.trim() || username.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    if (!usernameLocked && usernameStatus === "taken") {
      setError("This username is already taken. Please choose another.");
      return;
    }

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
          username: username.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      // Save to localStorage for future requests
      if (typeof window !== "undefined") {
        localStorage.setItem("songify_email", email.trim());
        localStorage.setItem("songify_username", username.trim());
      }

      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  function closeModal() {
    setShowModal(false);
    if (step === "success") {
      setValue("");
      setBasePrompt("");
      setTheme(null); setGenre(null); setMood(null); setDuration(30);
      setEmail(""); setUsername(""); setUsernameStatus("idle"); setEmailLookupStatus("idle"); setEmailLookupMessage(null); setUsernameLocked(false); setMagicLinkSent(false);
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
      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 680, margin: "0 auto" }} aria-label="Quick text to song generator">
        <div style={{
          position: "relative", borderRadius: "1rem",
          border: focused ? "1.5px solid rgba(99,102,241,0.6)" : "1.5px solid rgba(255,255,255,0.10)",
          background: "rgba(13,17,23,0.85)", backdropFilter: "blur(20px)",
          boxShadow: focused ? "0 0 0 4px rgba(99,102,241,0.12), 0 8px 40px rgba(0,0,0,0.4)" : "0 4px 24px rgba(0,0,0,0.3)",
          transition: "border-color 180ms ease, box-shadow 180ms ease",
        }}>
          <textarea ref={textareaRef} id="quick-generate-input" rows={3} value={value}
            onChange={(e) => setValue(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSubmit(e as unknown as React.FormEvent); }}
            placeholder={placeholder} aria-label="Type your song idea, lyrics, or story"
            style={{ width: "100%", padding: "1.1rem 1.25rem 3.5rem", background: "transparent", border: "none", outline: "none", color: "var(--text-primary)", fontSize: "1rem", lineHeight: 1.65, resize: "none", fontFamily: '"Inter", system-ui, sans-serif', borderRadius: "1rem" }}
          />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 0.85rem 0.75rem" }}>
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              Generate
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
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1", boxShadow: "0 0 8px #6366f1" }} />
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#a5b4fc" }}>Customize Your Song</span>
                </div>
                <h2 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "1.35rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.75rem" }}>Fine-tune your creation</h2>

                {/* Lyrics preview */}
                <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "0.6rem", padding: "0.5rem 0.85rem", marginBottom: "0.75rem" }}>
                  <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "0.15rem" }}>Your Lyrics</p>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.4, maxHeight: 40, overflow: "hidden" }}>{value.slice(0, 200)}{value.length > 200 ? "…" : ""}</p>
                </div>

                {/* Base Prompt */}
                <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.25rem" }}>Base Prompt (Optional)</p>
                <div style={{ marginBottom: "0.75rem" }}>
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

                {/* Theme */}
                {/* 
                <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.25rem" }}>Theme</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.75rem" }}>
                  {THEMES.map((t) => (<button key={t} type="button" onClick={() => setTheme(theme === t ? null : t)} style={chipStyle(theme === t)}>{t}</button>))}
                </div>
                */}

                {/* Genre */}
                {/* 
                <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.25rem" }}>Genre</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.75rem" }}>
                  {GENRES.map((g) => (<button key={g} type="button" onClick={() => setGenre(genre === g ? null : g)} style={chipStyle(genre === g)}>{g}</button>))}
                </div>
                */}

                {/* Mood */}
                {/* 
                <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.25rem" }}>Mood</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.75rem" }}>
                  {MOODS.map((m) => (<button key={m} type="button" onClick={() => setMood(mood === m ? null : m)} style={chipStyle(mood === m)}>{m}</button>))}
                </div>
                */}

                {/* Duration */}
                <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.25rem" }}>Duration</p>
                <div style={{ display: "flex", gap: "0.35rem", marginBottom: "1rem" }}>
                  {DURATIONS.map((d) => (<button key={d.value} type="button" onClick={() => setDuration(d.value)} style={chipStyle(duration === d.value)}>{d.label}</button>))}
                </div>

                <button type="button" onClick={() => { setStep("details"); setError(null); }} style={{
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
                      We have sent you a link on email.<br/>Click there to generate song from your email:<br/>
                      <strong style={{ color: "#f1f5f9" }}>{email}</strong>
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "1.35rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.4rem" }}>Almost there!</h2>
                    <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1.5rem" }}>We&apos;ll notify you by email when your song is ready.</p>

                    {/* Email */}
                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Email Address</label>
                <div style={{ display: "flex", gap: "0.6rem", alignItems: "stretch", marginBottom: "0.75rem" }}>
                  <input type="email" value={email} onChange={(e) => onEmailChange(e.target.value)} placeholder="you@example.com"
                    style={{ flex: 1, padding: "0.6rem 0.85rem", borderRadius: "0.5rem", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "var(--text-primary)", fontSize: "0.88rem", outline: "none", fontFamily: "inherit", transition: "border-color 150ms" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.6)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                  />
                  <button type="button" onClick={verifyEmail} disabled={emailLookupStatus === "checking" || emailLookupStatus === "found" || magicLinkSent} style={{
                    padding: "0.6rem 1rem", borderRadius: "0.5rem", border: "1px solid rgba(99,102,241,0.45)",
                    background: (emailLookupStatus === "checking" || magicLinkSent || emailLookupStatus === "found") ? "rgba(99,102,241,0.25)" : "rgba(99,102,241,0.16)",
                    color: "#c7d2fe", fontSize: "0.84rem", fontWeight: 700, cursor: (emailLookupStatus === "checking" || magicLinkSent || emailLookupStatus === "found") ? "not-allowed" : "pointer",
                    whiteSpace: "nowrap",
                  }}>
                    {emailLookupStatus === "found" ? "✓" : emailLookupStatus === "checking" ? "Checking..." : magicLinkSent ? "Sent!" : "Continue"}
                  </button>
                </div>
                {emailLookupMessage && (
                  <p style={{ fontSize: "0.75rem", color: emailLookupStatus === "found" ? "#86efac" : emailLookupStatus === "error" || emailLookupStatus === "invalid" ? "#fca5a5" : magicLinkSent ? "#a5b4fc" : "var(--text-muted)", marginBottom: "1rem", lineHeight: 1.5 }}>
                    {emailLookupMessage}
                  </p>
                )}

                {emailLookupStatus === "found" || emailLookupStatus === "new" ? (
                  <>
                    <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Username</label>
                    <div style={{ position: "relative", marginBottom: "0.35rem" }}>
                      <input type="text" value={username} onChange={(e) => onUsernameChange(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))} placeholder="your_unique_name" maxLength={30} readOnly={usernameLocked}
                        style={{ width: "100%", padding: "0.6rem 0.85rem", paddingRight: "2.5rem", borderRadius: "0.5rem", border: `1px solid ${usernameStatus === "available" ? "rgba(34,197,94,0.5)" : usernameStatus === "taken" ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}`, background: usernameLocked ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.04)", color: "var(--text-primary)", fontSize: "0.88rem", outline: "none", fontFamily: "inherit", transition: "border-color 150ms", cursor: usernameLocked ? "not-allowed" : "text" }}
                      />
                      {usernameStatus === "checking" && !usernameLocked && <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: "0.75rem", color: "var(--text-muted)" }}>…</span>}
                      {usernameStatus === "available" && <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: "0.85rem", color: "#22c55e" }}>✓</span>}
                      {usernameStatus === "taken" && !usernameLocked && <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: "0.85rem", color: "#ef4444" }}>✗</span>}
                    </div>
                    {!usernameLocked ? (
                      <p style={{ fontSize: "0.72rem", color: usernameStatus === "taken" ? "#fca5a5" : usernameStatus === "available" ? "#86efac" : "var(--text-muted)", marginBottom: "1.5rem", lineHeight: 1.4 }}>
                        {usernameStatus === "taken" ? "This username is already in use." : usernameStatus === "available" ? "Username is available!" : "Letters, numbers, and underscores only."}
                      </p>
                    ) : (
                      <p style={{ fontSize: "0.72rem", color: "#86efac", marginBottom: "1.5rem", lineHeight: 1.4 }}>
                        Your username already exists
                      </p>
                    )}
                  </>
                ) : (
                <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "1.5rem", lineHeight: 1.4 }}>
                  Confirm your email to load an existing username or create a new one.
                </p>
              )}

              {error && (
                <div style={{ fontSize: "0.82rem", color: "#fca5a5", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "0.5rem", padding: "0.6rem 0.85rem", marginBottom: "1rem" }}>{error}</div>
              )}

              <button type="button" onClick={handleProceed} disabled={submitting} style={{
                width: "100%", padding: "0.75rem", borderRadius: "0.65rem", border: "none",
                background: submitting ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg, #6366f1, #818cf8)",
                color: "#fff", fontSize: "0.92rem", fontWeight: 700,
                cursor: submitting ? "not-allowed" : "pointer",
                boxShadow: "0 0 20px rgba(99,102,241,0.3)", transition: "opacity 180ms",
              }}>
                {submitting ? "Submitting…" : "Submit Request"}
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
                <div style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "0.75rem", padding: "1rem", marginBottom: "1.5rem" }}>
                  <p style={{ fontSize: "0.85rem", color: "#a5b4fc", lineHeight: 1.7, fontWeight: 600 }}>
                    We are making your song @{username}
                  </p>
                  <p style={{ fontSize: "0.85rem", color: "#a5b4fc", lineHeight: 1.7, marginTop: "0.5rem" }}>
                    We will send you an email when your song will be ready or you could explore our <Link href="/explore" onClick={closeModal} style={{ color: "#f1f5f9", textDecoration: "underline", fontWeight: 600 }}>explore</Link> page. It will be ready in a few hours.
                  </p>
                </div>
                <button type="button" onClick={closeModal} style={{
                  padding: "0.7rem 2rem", borderRadius: "0.65rem", border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.05)", color: "var(--text-primary)",
                  fontSize: "0.88rem", fontWeight: 600, cursor: "pointer", transition: "all 180ms",
                }}>Got it!</button>
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
      `}</style>
    </>
  );
}
