import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { getAppSettings, getAppUserProfile, listAppUserProfiles } from "@/lib/app-store";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { saveComfyUiUrl, saveUserRole, testComfyUiUrl } from "./actions";

export const metadata: Metadata = buildMetadata({
  title: "Admin",
  description: "Manage Songify users, roles, and the Studio backend URL.",
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

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/admin");

  const profile = await getAppUserProfile(user.id);
  if (profile?.role !== "admin") redirect("/dashboard");

  const [users, settings] = await Promise.all([
    listAppUserProfiles(),
    getAppSettings(),
  ]);

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
            Studio Settings &amp; Users
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

        {/* Two-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "1.25rem", alignItems: "start" }}>

          {/* ── Left: Backend config ── */}
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

          {/* ── Right: User management ── */}
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div>
                <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>User Management</h2>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{users.length} registered account{users.length !== 1 ? "s" : ""}</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", maxHeight: "32rem", overflowY: "auto", paddingRight: "0.25rem" }}>
              {users.map((item) => (
                <form
                  key={item.userId}
                  action={saveUserRole}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    gap: "0.75rem", flexWrap: "wrap",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "0.625rem",
                    padding: "0.85rem 1rem",
                  }}
                >
                  <input type="hidden" name="userId" value={item.userId} />

                  {/* User info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.fullName ?? item.email ?? item.userId}
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                      {item.email ?? "No email saved"}
                    </p>
                  </div>

                  {/* Role selector + button */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                    {/* Current role badge */}
                    <span style={{
                      fontSize: "0.68rem", fontWeight: 700, padding: "0.2rem 0.55rem",
                      borderRadius: "999px",
                      background: item.role === "admin" ? "rgba(239,68,68,0.1)" : "rgba(99,102,241,0.1)",
                      border: item.role === "admin" ? "1px solid rgba(239,68,68,0.25)" : "1px solid rgba(99,102,241,0.2)",
                      color: item.role === "admin" ? "#f87171" : "#a5b4fc",
                    }}>
                      {item.role ?? "user"}
                    </span>

                    <select
                      name="role"
                      defaultValue={item.role}
                      style={{
                        ...inputStyle,
                        width: "auto",
                        padding: "0.35rem 1.75rem 0.35rem 0.6rem",
                        fontSize: "0.78rem",
                        appearance: "none",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 0.5rem center",
                        cursor: "pointer",
                      }}
                    >
                      <option value="user" style={{ background: "#111827" }}>User</option>
                      <option value="admin" style={{ background: "#111827" }}>Admin</option>
                    </select>

                    <button
                      type="submit"
                      style={{
                        padding: "0.35rem 0.75rem",
                        borderRadius: "0.4rem",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "var(--text-secondary)",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        transition: "all 150ms",
                      }}
                    >
                      Update
                    </button>
                  </div>
                </form>
              ))}

              {users.length === 0 && (
                <p style={{ textAlign: "center", padding: "2rem 0", fontSize: "0.83rem", color: "var(--text-muted)" }}>
                  No users registered yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}