"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const PLACEHOLDERS = [
  "A rainy night, a broken heart, a neon sign...",
  "Write me an upbeat summer anthem about freedom...",
  "Turn this into a hip-hop track: chasing dreams...",
  "A lullaby about stars and moonlight for kids...",
  "Epic orchestral battle theme, warriors at dawn...",
];

export function QuickGenerate() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  // Start with index 0 on both server + client to avoid hydration mismatch,
  // then pick a random placeholder after the first client render.
  const [placeholder, setPlaceholder] = useState(PLACEHOLDERS[0]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setPlaceholder(PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]);
  }, []);


  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      textareaRef.current?.focus();
      return;
    }
    router.push(`/studio?lyrics=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ width: "100%", maxWidth: 680, margin: "0 auto" }}
      aria-label="Quick text to song generator"
    >
      <div
        style={{
          position: "relative",
          borderRadius: "1rem",
          border: focused
            ? "1.5px solid rgba(99,102,241,0.6)"
            : "1.5px solid rgba(255,255,255,0.10)",
          background: "rgba(13,17,23,0.85)",
          backdropFilter: "blur(20px)",
          boxShadow: focused
            ? "0 0 0 4px rgba(99,102,241,0.12), 0 8px 40px rgba(0,0,0,0.4)"
            : "0 4px 24px rgba(0,0,0,0.3)",
          transition: "border-color 180ms ease, box-shadow 180ms ease",
        }}
      >
        <textarea
          ref={textareaRef}
          id="quick-generate-input"
          rows={3}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            // Cmd/Ctrl + Enter to submit
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSubmit(e as unknown as React.FormEvent);
          }}
          placeholder={placeholder}
          aria-label="Type your song idea, lyrics, or story"
          style={{
            width: "100%",
            padding: "1.1rem 1.25rem 3.5rem",
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--text-primary)",
            fontSize: "1rem",
            lineHeight: 1.65,
            resize: "none",
            fontFamily: "\"Inter\", system-ui, sans-serif",
            borderRadius: "1rem",
          }}
        />

        {/* Bottom bar inside the textarea card */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 0.85rem 0.75rem",
          }}
        >
          <span
            style={{
              fontSize: "0.72rem",
              color: value.length > 0 ? "var(--text-muted)" : "transparent",
              fontVariantNumeric: "tabular-nums",
              transition: "color 200ms",
            }}
          >
            {value.length} chars · ⌘↵ to generate
          </span>

          <button
            type="submit"
            id="quick-generate-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.55rem 1.25rem",
              borderRadius: "0.65rem",
              border: "none",
              background: value.trim()
                ? "linear-gradient(135deg, #6366f1, #818cf8)"
                : "rgba(99,102,241,0.25)",
              color: value.trim() ? "#fff" : "rgba(255,255,255,0.4)",
              fontSize: "0.88rem",
              fontWeight: 700,
              cursor: value.trim() ? "pointer" : "default",
              boxShadow: value.trim()
                ? "0 0 20px rgba(99,102,241,0.4)"
                : "none",
              transition: "all 200ms ease",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Generate<span className="hidden sm:inline"> Song</span>
          </button>
        </div>
      </div>

      {/* Helper tags */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.45rem",
          justifyContent: "center",
          marginTop: "0.85rem",
        }}
        aria-label="Example prompts"
      >
        {["Pop anthem", "Rap verse", "Sad ballad", "Epic film score", "Lo-fi beat"].map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() =>
              setValue((v) =>
                v ? v : `Write a ${tag.toLowerCase()} about `
              )
            }
            style={{
              fontSize: "0.72rem",
              padding: "0.28rem 0.75rem",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.03)",
              color: "var(--text-muted)",
              cursor: "pointer",
              transition: "all 150ms ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(99,102,241,0.45)";
              (e.currentTarget as HTMLButtonElement).style.color = "#a5b4fc";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
            }}
          >
            {tag}
          </button>
        ))}
      </div>
    </form>
  );
}
