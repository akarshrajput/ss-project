import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { getAppSettings, getAppUserProfile } from "@/lib/app-store";
import { getUser } from "@/lib/auth";
import { saveComfyUiUrl, testComfyUiUrl, sendPromoOffer } from "./actions";

export const metadata: Metadata = buildMetadata({
  title: "Admin",
  description: "Manage Songify Studio backend URL.",
  path: "/admin",
  noIndex: true,
});

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function readParam(value: string | string[] | undefined, fallback = "") {
  if (Array.isArray(value)) return value[0] ?? fallback;
  return value ?? fallback;
}

export default async function AdminPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const error = readParam(params.error);
  const notice = readParam(params.notice);

  const user = await getUser();

  if (!user) redirect("/login?next=/admin");

  const profile = await getAppUserProfile(user.id);
  if (profile?.role !== "admin") redirect("/dashboard");

  const settings = await getAppSettings();

  // ── Shared card style
  const cardStyle: React.CSSProperties = {
    background: "rgba(13,17,23,0.8)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "0.875rem",
    backdropFilter: "blur(16px)",
    padding: "1.5rem",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    borderRadius: "0.5rem",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.04)",
    color: "var(--text-primary)",
    padding: "0.5rem 0.75rem",
    fontSize: "0.875rem",
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 150ms",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--text-muted)",
    display: "block",
    marginBottom: "0.4rem",
  };

  return (
    <main className="site-container w-full flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div style={{ maxWidth: 1020 }}>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "0.4rem",
            fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
            color: "#f87171", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: "999px", padding: "0.3rem 0.85rem", marginBottom: "0.85rem",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
            Admin Panel
          </span>
          <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)" }}>
            Studio Settings
          </h1>
          <p style={{ marginTop: "0.4rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Signed in as <span style={{ color: "#a5b4fc", fontWeight: 600 }}>{profile.email ?? user.email}</span> · Role:{" "}
            <span style={{ color: "#f87171", fontWeight: 600 }}>{profile.role}</span>
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div style={{ marginBottom: "1.25rem", fontSize: "0.875rem", color: "#fca5a5", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "0.625rem", padding: "0.75rem 1rem" }}>
            ⚠️ {error}
          </div>
        )}
        {notice && (
          <div style={{ marginBottom: "1.25rem", fontSize: "0.875rem", color: "#86efac", background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "0.625rem", padding: "0.75rem 1rem" }}>
            ✓ {notice}
          </div>
        )}

        {/* Quick links */}
        <div style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", maxWidth: 1020, marginBottom: "1.5rem" }}>
          <a
            href="/admin/songs-queue-management"
            style={{
              ...cardStyle,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              transition: "border-color 220ms, box-shadow 220ms",
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(45,212,191,0.12)", border: "1px solid rgba(45,212,191,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="1.8" strokeLinecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            </div>
            <div>
              <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-primary)" }}>Songs Queue</p>
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Manage pending requests</p>
            </div>
          </a>
          
          <a
            href="/admin/statistics"
            style={{
              ...cardStyle,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              transition: "border-color 220ms, box-shadow 220ms",
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            </div>
            <div>
              <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-primary)" }}>Statistics</p>
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Track user funnel & drop-offs</p>
            </div>
          </a>

          <a
            href="/admin/analytics"
            style={{
              ...cardStyle,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              transition: "border-color 220ms, box-shadow 220ms",
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(244,63,94,0.12)", border: "1px solid rgba(244,63,94,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            </div>
            <div>
              <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-primary)" }}>Analytics</p>
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Interactive real-time metrics</p>
            </div>
          </a>

          <a
            href="/explore"
            style={{
              ...cardStyle,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              transition: "border-color 220ms, box-shadow 220ms",
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
            <div>
              <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-primary)" }}>Explore Songs</p>
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>View all generated songs</p>
            </div>
          </a>

          <a
            href="/admin/users"
            style={{
              ...cardStyle,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              transition: "border-color 220ms, box-shadow 220ms",
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div>
              <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-primary)" }}>User Management</p>
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Manage users and privileges</p>
            </div>
          </a>

          <a
            href="/admin/notification-emails"
            style={{
              ...cardStyle,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              transition: "border-color 220ms, box-shadow 220ms",
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
            </div>
            <div>
              <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-primary)" }}>Notification Emails</p>
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Manage subscription alerts</p>
            </div>
          </a>

          <a
            href="/admin/promotional-offers"
            style={{
              ...cardStyle,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              transition: "border-color 220ms, box-shadow 220ms",
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <div>
              <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-primary)" }}>Promotional Offers</p>
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Send offers and trial subscriptions</p>
            </div>
          </a>
        </div>

        <div style={{ maxWidth: 560 }}>
          {/* Card 1: Studio Backend */}
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="1.8" strokeLinecap="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07M8.46 8.46a5 5 0 0 0 0 7.07"/>
                </svg>
              </div>
              <div>
                <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>Studio Backend</h2>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>ComfyUI URL for the generation API</p>
              </div>
            </div>

            <form action={saveComfyUiUrl} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>ComfyUI URL</label>
                <input
                  name="comfyUiUrl"
                  type="url"
                  defaultValue={settings.comfyUiUrl}
                  placeholder="https://your-comfyui-host.example.com"
                  style={inputStyle}
                />
              </div>

              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                <button
                  type="submit"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.4rem",
                    padding: "0.55rem 1.1rem", borderRadius: "0.5rem",
                    background: "linear-gradient(135deg, #6366f1, #818cf8)",
                    color: "#fff", fontSize: "0.83rem", fontWeight: 600,
                    border: "none", cursor: "pointer",
                    boxShadow: "0 0 14px rgba(99,102,241,0.25)",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Save URL
                </button>
                <button
                  formAction={testComfyUiUrl}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.4rem",
                    padding: "0.55rem 1.1rem", borderRadius: "0.5rem",
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "var(--text-secondary)", fontSize: "0.83rem", fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 8 12 12 14 14"/></svg>
                  Test
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}