import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { getAppUserProfile } from "@/lib/app-store";
import { getUser } from "@/lib/auth";
import { listNotificationEmails } from "@/lib/notification-email-store";
import { addNotificationEmailAction } from "./actions";
import { RemoveButton } from "./remove-btn";

export const metadata: Metadata = buildMetadata({
  title: "Notification Emails | Admin",
  description: "Manage emails that receive notifications on premium subscriptions.",
  path: "/admin/notification-emails",
  noIndex: true,
});

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function readParam(value: string | string[] | undefined, fallback = "") {
  if (Array.isArray(value)) return value[0] ?? fallback;
  return value ?? fallback;
}

export default async function NotificationEmailsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const error = readParam(params.error);
  const notice = readParam(params.notice);

  const user = await getUser();

  if (!user) redirect("/login?next=/admin/notification-emails");

  const profile = await getAppUserProfile(user.id);
  if (profile?.role !== "admin") redirect("/dashboard");

  const notificationEmails = await listNotificationEmails();

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

  return (
    <main className="site-container w-full flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div style={{ maxWidth: 1020, width: "100%" }}>
        
        {/* Header */}
        <div style={{ marginBottom: "2rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
              color: "#60a5fa", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
              borderRadius: "999px", padding: "0.3rem 0.85rem", marginBottom: "0.85rem",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", display: "inline-block" }} />
              Admin
            </span>
            <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)" }}>
              Notification Emails
            </h1>
            <p style={{ marginTop: "0.4rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              Manage who receives an email alert when a user purchases a premium subscription.
            </p>
          </div>
          <a
            href="/admin"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              padding: "0.55rem 1.1rem", borderRadius: "0.5rem",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--text-secondary)", fontSize: "0.83rem", fontWeight: 600,
              textDecoration: "none", transition: "background 150ms",
            }}
          >
            ← Back to Admin
          </a>
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

        <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "1fr", maxWidth: 800 }}>
          {/* Add Form */}
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
              </div>
              <div>
                <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>Add Email Address</h2>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Add a new recipient to the notification list.</p>
              </div>
            </div>

            <form action={addNotificationEmailAction} style={{ display: "flex", gap: "1rem", alignItems: "flex-end", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Email Address</label>
                <input
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  required
                  style={inputStyle}
                />
              </div>
              <button
                type="submit"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.4rem",
                  padding: "0.55rem 1.1rem", borderRadius: "0.5rem",
                  background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
                  color: "#fff", fontSize: "0.83rem", fontWeight: 600,
                  border: "none", cursor: "pointer",
                  boxShadow: "0 0 14px rgba(59,130,246,0.25)",
                  height: 38
                }}
              >
                Add Email
              </button>
            </form>
          </div>

          {/* List */}
          <div style={{
            background: "rgba(13,17,23,0.8)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "0.875rem",
            backdropFilter: "blur(16px)",
            overflow: "hidden",
          }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    <th style={{ padding: "1rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Email Address</th>
                    <th style={{ padding: "1rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Added</th>
                    <th style={{ padding: "1rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {notificationEmails.map((ne) => (
                    <tr key={ne.email} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding: "1rem", fontSize: "0.875rem", color: "var(--text-primary)", fontWeight: 500 }}>
                        {ne.email}
                      </td>
                      <td style={{ padding: "1rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                        {new Date(ne.addedAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "1rem", textAlign: "right" }}>
                        <RemoveButton email={ne.email} />
                      </td>
                    </tr>
                  ))}
                  {notificationEmails.length === 0 && (
                    <tr>
                      <td colSpan={3} style={{ padding: "3rem 1rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                        No email addresses have been added yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
