"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { fetchUserSubscriptionHistory } from "./actions";

type HistoryItem = {
  plan: string;
  status: string;
  amount: number;
  currency: string;
  startsAt: string;
  expiresAt: string;
  createdAt: string;
};

export function SubscriptionHistory({ userId }: { userId: string }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = async () => {
    setShowModal(true);
    if (history !== null) return; // Already fetched
    
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUserSubscriptionHistory(userId);
      setHistory(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  const Spinner = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite", display: "block", margin: "2rem auto", color: "#818cf8" }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );

  return (
    <>
      <button
        onClick={handleOpen}
        style={{
          display: "inline-flex", alignItems: "center", gap: "0.3rem",
          padding: "0.4rem 0.75rem", borderRadius: "0.5rem",
          background: "rgba(139, 92, 246, 0.15)", // Violet
          color: "#c4b5fd",
          border: "1px solid rgba(139, 92, 246, 0.3)",
          fontSize: "0.75rem", fontWeight: 600,
          cursor: "pointer", transition: "all 150ms",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = "rgba(139, 92, 246, 0.25)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = "rgba(139, 92, 246, 0.15)";
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
        Logs
      </button>

      {showModal && createPortal(
        <>
          <div onClick={() => setShowModal(false)} style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} />
          <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyItems: "center", pointerEvents: "none", padding: "1.5rem" }}>
            <div style={{
              position: "relative", width: "100%", maxWidth: 640, margin: "auto",
              background: "rgba(13,17,23,0.98)", border: "1px solid rgba(139, 92, 246, 0.3)",
              borderRadius: "1rem", padding: "2rem", pointerEvents: "auto",
              boxShadow: "0 0 60px rgba(139, 92, 246, 0.1), 0 24px 80px rgba(0,0,0,0.6)",
              animation: "modal-in 0.2s ease",
              maxHeight: "85vh", display: "flex", flexDirection: "column"
            }}>
              <button onClick={() => setShowModal(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.2rem", lineHeight: 1 }} aria-label="Close">✕</button>
              
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.5rem", flexShrink: 0 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(139, 92, 246, 0.12)", border: "1px solid rgba(139, 92, 246, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Subscription History</h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: 0 }}>All past and current plans</p>
                </div>
              </div>

              <div style={{ overflowY: "auto", paddingRight: "0.5rem" }}>
                {loading ? (
                  <Spinner />
                ) : error ? (
                  <div style={{ padding: "1rem", background: "rgba(239,68,68,0.1)", color: "#fca5a5", borderRadius: "0.5rem", border: "1px solid rgba(239,68,68,0.2)", fontSize: "0.85rem" }}>
                    {error}
                  </div>
                ) : history && history.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {history.map((item, i) => (
                      <div key={i} style={{
                        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: "0.75rem", padding: "1rem",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                          <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)", textTransform: "capitalize" }}>{item.plan}</span>
                        </div>
                        
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                          <div>
                            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0 0 0.2rem 0" }}>Amount Paid</p>
                            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0, fontWeight: 600 }}>
                              {(item.amount / 100).toLocaleString('en-US', { style: 'currency', currency: item.currency.toUpperCase() })}
                            </p>
                          </div>
                          <div>
                            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0 0 0.2rem 0" }}>Purchased On</p>
                            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
                              {new Date(item.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0 0 0.2rem 0" }}>Start Date</p>
                            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
                              {new Date(item.startsAt).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0 0 0.2rem 0" }}>Expires On</p>
                            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
                              {new Date(item.expiresAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    No subscription history found for this user.
                  </div>
                )}
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
