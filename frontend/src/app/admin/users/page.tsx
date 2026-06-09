import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { getAppUserProfile, listAppUserProfiles } from "@/lib/app-store";
import { getAllActiveSubscriptions } from "@/lib/subscription-store";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { RoleForm } from "./role-form";
import { SubscriptionInfo, SubscriptionDTO } from "./subscription-info";
import { DeleteUserForm } from "./delete-form";

export const metadata: Metadata = buildMetadata({
  title: "User Management | Admin",
  description: "Manage users and privileges.",
  path: "/admin/users",
  noIndex: true,
});

export default async function AdminUsersPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/admin/users");

  const profile = await getAppUserProfile(user.id);
  if (profile?.role !== "admin") redirect("/dashboard");

  const [users, activeSubs] = await Promise.all([
    listAppUserProfiles(),
    getAllActiveSubscriptions(),
  ]);

  const subMap = new Map(activeSubs.map((s) => [s.userId, s]));

  return (
    <main className="site-container w-full flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div style={{ maxWidth: 1020, margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ marginBottom: "2rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
              color: "#818cf8", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: "999px", padding: "0.3rem 0.85rem", marginBottom: "0.85rem",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", display: "inline-block" }} />
              Admin
            </span>
            <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)" }}>
              User Management
            </h1>
            <p style={{ marginTop: "0.4rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              View and manage user roles and privileges.
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

        {/* Table */}
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
                  <th style={{ padding: "1rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>User</th>
                  <th style={{ padding: "1rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Email</th>
                  <th style={{ padding: "1rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Role</th>
                  <th style={{ padding: "1rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Subscription</th>
                  <th style={{ padding: "1rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Joined</th>
                  <th style={{ padding: "1rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((appUser) => {
                  const sub = subMap.get(appUser.userId);
                  const subDTO: SubscriptionDTO | null = sub ? {
                    plan: sub.plan,
                    startsAt: sub.startsAt.toISOString(),
                    expiresAt: sub.expiresAt.toISOString(),
                  } : null;

                  return (
                    <tr key={appUser.userId} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding: "1rem", fontSize: "0.875rem", color: "var(--text-primary)", fontWeight: 500 }}>
                        {appUser.fullName || "Anonymous"}
                      </td>
                      <td style={{ padding: "1rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                        {appUser.email || "No email"}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <span style={{
                          display: "inline-block",
                          padding: "0.2rem 0.6rem",
                          borderRadius: "999px",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          background: appUser.role === "admin" ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.05)",
                          color: appUser.role === "admin" ? "#a5b4fc" : "var(--text-secondary)",
                          border: `1px solid ${appUser.role === "admin" ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.1)"}`,
                        }}>
                          {appUser.role}
                        </span>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <SubscriptionInfo sub={subDTO} />
                      </td>
                      <td style={{ padding: "1rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                        {new Date(appUser.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.5rem" }}>
                          {appUser.userId !== user.id ? (
                            <>
                              <RoleForm userId={appUser.userId} currentRole={appUser.role} />
                              <DeleteUserForm userId={appUser.userId} />
                            </>
                          ) : (
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontStyle: "italic" }}>You</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: "3rem 1rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}
