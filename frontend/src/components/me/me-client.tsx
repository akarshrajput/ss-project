"use client";

import { useState } from "react";
import Link from "next/link";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { signOut, updatePassword } from "@/app/actions/auth";
import { useSearchParams } from "next/navigation";

interface MeClientProps {
  email: string;
  isSubscribed: boolean;
  expiresAt: string | null;
}

export function MeClient({ email, isSubscribed, expiresAt }: MeClientProps) {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "settings" ? "settings" : "info";
  const [activeTab, setActiveTab] = useState<"info" | "settings">(initialTab);
  
  const error = searchParams.get("error");
  const notice = searchParams.get("notice");

  return (
    <div style={{ display: "flex", gap: "2rem", flexDirection: "row", flexWrap: "wrap", alignItems: "flex-start" }}>
      
      {/* Sidebar Tabs */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        minWidth: 200,
        flexShrink: 0
      }}>
        <button
          onClick={() => setActiveTab("info")}
          style={{
            padding: "0.75rem 1rem",
            textAlign: "left",
            background: activeTab === "info" ? "rgba(255,255,255,0.08)" : "transparent",
            color: activeTab === "info" ? "var(--text-primary)" : "var(--text-secondary)",
            border: "1px solid",
            borderColor: activeTab === "info" ? "rgba(255,255,255,0.1)" : "transparent",
            borderRadius: "0.5rem",
            fontSize: "0.95rem",
            fontWeight: activeTab === "info" ? 600 : 500,
            cursor: "pointer",
            transition: "all 150ms"
          }}
        >
          Info
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          style={{
            padding: "0.75rem 1rem",
            textAlign: "left",
            background: activeTab === "settings" ? "rgba(255,255,255,0.08)" : "transparent",
            color: activeTab === "settings" ? "var(--text-primary)" : "var(--text-secondary)",
            border: "1px solid",
            borderColor: activeTab === "settings" ? "rgba(255,255,255,0.1)" : "transparent",
            borderRadius: "0.5rem",
            fontSize: "0.95rem",
            fontWeight: activeTab === "settings" ? 600 : 500,
            cursor: "pointer",
            transition: "all 150ms"
          }}
        >
          Settings
        </button>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        minWidth: 300,
        background: "rgba(13,17,23,0.8)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "1rem",
        padding: "2rem",
        backdropFilter: "blur(20px)"
      }}>
        
        {activeTab === "info" && (
          <div className="fade-in">
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1.5rem" }}>
              Account Information
            </h2>
            
            <div style={{ marginBottom: "1.5rem" }}>
              <p style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontWeight: 700, marginBottom: "0.5rem" }}>
                Email
              </p>
              <p style={{ fontSize: "1.1rem", color: "var(--text-primary)", fontWeight: 500 }}>
                {email}
              </p>
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <p style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontWeight: 700, marginBottom: "0.5rem" }}>
                Subscription Status
              </p>
              {isSubscribed && expiresAt ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "1.1rem", color: "#86efac", fontWeight: 600 }}>Active (24h Unlimited Plan)</span>
                  </div>
                  <div style={{ fontSize: "0.95rem", color: "var(--text-secondary)", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <span>Time remaining:</span>
                    <CountdownTimer expiresAt={expiresAt} />
                  </div>
                  <div style={{ marginTop: "0.5rem" }}>
                    <Link 
                      href="/studio"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.6rem 1.25rem",
                        borderRadius: "0.5rem",
                        background: "rgba(99,102,241,0.15)",
                        color: "#a5b4fc",
                        border: "1px solid rgba(99,102,241,0.3)",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        textDecoration: "none"
                      }}
                    >
                      Go to Premium Studio →
                    </Link>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <span style={{ fontSize: "1.1rem", color: "var(--text-secondary)", fontWeight: 500 }}>Not Subscribed</span>
                  <Link 
                    href="/payment?plan=24h-unlimited"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "0.5rem",
                      background: "linear-gradient(135deg, #6366f1, #818cf8)",
                      color: "#fff",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      textDecoration: "none",
                      boxShadow: "0 0 24px rgba(99,102,241,0.3)",
                      maxWidth: 240
                    }}
                  >
                    Unlock 24h Access for $1
                  </Link>
                </div>
              )}
            </div>

            <div style={{ paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <form action={signOut}>
                <button 
                  type="submit"
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    color: "#fca5a5",
                    padding: "0.6rem 1.25rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="fade-in">
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1.5rem" }}>
              Security Settings
            </h2>
            
            <form action={updatePassword} style={{ maxWidth: 400 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label className="input-label" style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>New Password</label>
                  <input 
                    required 
                    minLength={8} 
                    name="password" 
                    type="password" 
                    className="input" 
                    placeholder="••••••••" 
                    style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "0.4rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                  />
                </div>
                <div>
                  <label className="input-label" style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>Confirm New Password</label>
                  <input 
                    required 
                    minLength={8} 
                    name="confirmPassword" 
                    type="password" 
                    className="input" 
                    placeholder="••••••••" 
                    style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "0.4rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                  />
                </div>

                {error && <div className="alert-error" style={{ padding: "0.75rem", borderRadius: "0.4rem", background: "rgba(239,68,68,0.1)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.2)", fontSize: "0.85rem" }}>{error}</div>}
                {notice && <div className="alert-success" style={{ padding: "0.75rem", borderRadius: "0.4rem", background: "rgba(34,197,94,0.1)", color: "#86efac", border: "1px solid rgba(34,197,94,0.2)", fontSize: "0.85rem" }}>{notice}</div>}

                <button 
                  type="submit"
                  className="btn-primary"
                  style={{ marginTop: "0.5rem", width: "100%", padding: "0.75rem", display: "flex", justifyContent: "center" }}
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
      <style>{`
        .fade-in {
          animation: fade-in 0.3s ease-out;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
