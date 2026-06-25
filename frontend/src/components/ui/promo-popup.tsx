"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const DISMISS_KEY = "songify_promo_dismissed";
const DISMISS_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export function PromoPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt) {
      const elapsed = Date.now() - Number(dismissedAt);
      if (elapsed < DISMISS_DURATION_MS) return;
    }

    // Show after a short delay for a smooth entrance
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    setVisible(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    }
  }

  if (!visible) return null;

  return (
      <div style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 9000,
        maxWidth: 480,
        width: "calc(100% - 3rem)",
        background: "rgba(13,17,23,0.98)",
        border: "1px solid rgba(99,102,241,0.4)",
        borderRadius: "1.25rem",
        padding: "2rem",
        backdropFilter: "blur(24px)",
        boxShadow: "0 16px 64px rgba(0,0,0,0.6), 0 0 64px rgba(99,102,241,0.15)",
        animation: "promo-scale-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      }}>
        {/* Close button */}
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            fontSize: "1.2rem",
            lineHeight: 1,
            padding: "4px",
            transition: "color 150ms",
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
          onMouseOut={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          ✕
        </button>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1rem" }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: "0.8rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 0 20px rgba(99,102,241,0.2)",
            overflow: "hidden"
          }}>
            <Image
              src="/songify-logo.png"
              alt="Songify"
              width={56}
              height={56}
              className="object-cover"
            />
          </div>
          <div>
            <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem", lineHeight: 1.3, fontFamily: '"Space Grotesk", sans-serif' }}>
              24h Unlimited Song Creation in $1
            </p>
            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
              Get unlimited songs with no delays — just <strong style={{ color: "#a5b4fc" }}>$1</strong> for 24 hours.
            </p>

            {/* Feature List */}
            <ul style={{ 
              listStyle: "none", 
              margin: "0 0 1.75rem 0", 
              display: "flex", 
              flexDirection: "column", 
              gap: "0.75rem",
              textAlign: "left",
              width: "100%",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "0.75rem",
              padding: "1rem"
            }}>
              {[
                "Unlimited song generations",
                "No queue delays",
                "All genres & vocal types",
                "Full customization controls"
              ].map((feature, i) => (
                <li key={i} style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between", 
                  fontSize: "0.85rem", 
                  color: "var(--text-secondary)",
                  borderBottom: i === 3 ? "none" : "1px solid rgba(255,255,255,0.05)",
                  paddingBottom: i === 3 ? 0 : "0.5rem"
                }}>
                  <span>{feature}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </li>
              ))}
            </ul>
            <Link
              href="/register?plan=24h-unlimited"
              onClick={dismiss}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.75rem 2rem",
                borderRadius: "0.6rem",
                background: "linear-gradient(135deg, #6366f1, #818cf8)",
                color: "#fff",
                fontSize: "0.95rem",
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 0 24px rgba(99,102,241,0.3)",
                transition: "transform 180ms, box-shadow 180ms",
                width: "100%",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 0 32px rgba(99,102,241,0.4)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 0 24px rgba(99,102,241,0.3)";
              }}
            >
              Get Started →
            </Link>
          </div>
        </div>

      <style>{`
        @keyframes promo-scale-in {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </div>
  );
}
