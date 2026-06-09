"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export type SubscriptionDTO = {
  plan: string;
  expiresAt: string;
  startsAt: string;
};

export function SubscriptionInfo({ sub }: { sub: SubscriptionDTO | null }) {
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!showModal || !sub) return;

    const expiresAtMs = new Date(sub.expiresAt).getTime();

    const updateTimer = () => {
      const nowMs = Date.now();
      const diff = expiresAtMs - nowMs;

      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [showModal, sub]);

  if (!sub) {
    return <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>None</span>;
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        style={{
          display: "inline-block",
          padding: "0.2rem 0.6rem",
          borderRadius: "999px",
          fontSize: "0.7rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          background: "rgba(16, 185, 129, 0.15)", // Emerald
          color: "#6ee7b7",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          cursor: "pointer",
        }}
      >
        Active
      </button>

      {showModal && createPortal(
        <>
          <div onClick={() => setShowModal(false)} style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} />
          <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", padding: "1.5rem" }}>
            <div style={{
              position: "relative", width: "100%", maxWidth: 400,
              background: "rgba(13,17,23,0.98)", border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "1rem", padding: "2rem", pointerEvents: "auto",
              boxShadow: "0 0 60px rgba(16, 185, 129, 0.15), 0 24px 80px rgba(0,0,0,0.6)",
              animation: "modal-in 0.2s ease",
            }}>
              <button onClick={() => setShowModal(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.2rem", lineHeight: 1 }} aria-label="Close">✕</button>
              
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6ee7b7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>Subscription</h3>
                  <p style={{ fontSize: "0.8rem", color: "#6ee7b7", fontWeight: 600 }}>Active</p>
                </div>
              </div>

              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "0.5rem", padding: "1rem", marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Plan</span>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 600, textTransform: "capitalize" }}>{sub.plan}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Started</span>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{new Date(sub.startsAt).toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Expires</span>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{new Date(sub.expiresAt).toLocaleString()}</span>
                </div>
              </div>

              <div style={{ textAlign: "center", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "0.5rem", padding: "1rem" }}>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6ee7b7", marginBottom: "0.4rem" }}>Time Remaining</p>
                <p style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: '"Space Grotesk", sans-serif', fontVariantNumeric: "tabular-nums" }}>{timeLeft}</p>
              </div>

            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
