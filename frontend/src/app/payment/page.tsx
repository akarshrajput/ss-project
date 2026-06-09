"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const cancelled = searchParams.get("cancelled");
  const error = searchParams.get("error");
  const [loading, setLoading] = useState(false);
  const [payError, setPayError] = useState<string | null>(error);

  async function handleCheckout() {
    setLoading(true);
    setPayError(null);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setPayError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <main className="site-container flex w-full flex-1 items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
      <div style={{ width: "100%", maxWidth: 480, textAlign: "center" }}>

        {/* Icon */}
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(45,212,191,0.15))",
          border: "2px solid rgba(99,102,241,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1.5rem",
          boxShadow: "0 0 40px rgba(99,102,241,0.2)",
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13M9 18c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-2c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"/>
          </svg>
        </div>

        <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
          Unlock the Studio
        </h1>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "2rem", maxWidth: 380, margin: "0 auto 2rem" }}>
          Get <strong style={{ color: "var(--text-primary)" }}>24 hours</strong> of unlimited song creation with no delays.
        </p>

        {/* Plan card */}
        <div style={{
          background: "rgba(17,24,39,0.7)",
          border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: "1rem",
          padding: "2rem",
          backdropFilter: "blur(20px)",
          marginBottom: "1.5rem",
        }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "0.25rem", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "3rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: '"Space Grotesk", sans-serif' }}>$1</span>
            <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>/24 hours</span>
          </div>

          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem", display: "flex", flexDirection: "column", gap: "0.65rem", textAlign: "left", maxWidth: 280, marginInline: "auto" }}>
            {[
              "Unlimited song generations",
              "No queue delays",
              "All genres & vocal types",
              "Full customization controls",
            ].map((feature) => (
              <li key={feature} style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <button
            onClick={handleCheckout}
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.85rem",
              borderRadius: "0.65rem",
              border: "none",
              background: loading ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg, #6366f1, #818cf8)",
              color: "#fff",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 0 24px rgba(99,102,241,0.35)",
              transition: "opacity 180ms, box-shadow 180ms",
            }}
          >
            {loading ? "Redirecting to payment…" : "Pay $1 — Start Creating"}
          </button>
        </div>

        {cancelled && (
          <div className="alert-warning" style={{ marginBottom: "1rem" }}>
            Payment was cancelled. You can try again anytime.
          </div>
        )}
        {payError && (
          <div className="alert-error" style={{ marginBottom: "1rem" }}>
            {payError}
          </div>
        )}

        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
          Secure payment via Stripe · One-time charge · No recurring billing
        </p>

        <div style={{ marginTop: "1.5rem" }}>
          <Link href="/" style={{ fontSize: "0.82rem", color: "var(--text-muted)", textDecoration: "underline" }}>
            ← Back to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
