import { signOut } from "@/app/actions/auth";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getAppUserProfile } from "@/lib/app-store";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildMetadata({
  title: "Account Settings",
  description: "Private Songify account settings for authenticated users.",
  path: "/account",
  noIndex: true,
});

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profile = user ? await getAppUserProfile(user.id) : null;
  const fullName = profile?.fullName ?? user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? "Name not set";

  return (
    <main className="site-container w-full flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div style={{ marginBottom: "2rem" }}>
        <span className="badge badge-violet mb-3">Account</span>
        <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)" }}>
          Account Settings
        </h1>
      </div>

      <div style={{ maxWidth: 560 }}>
        <div className="glass-card" style={{ padding: "2rem" }}>
          {/* Profile fields */}
          <div style={{ display: "grid", gap: "1.5rem" }}>
            {[
              { label: "Full Name", value: fullName },
              { label: "Email", value: profile?.email ?? user?.email ?? "—" },
              { label: "Role", value: profile?.role ?? "user", accent: true },
            ].map((field) => (
              <div key={field.label} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "1.25rem" }}>
                <p style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.35rem" }}>
                  {field.label}
                </p>
                <p style={{ fontSize: "1rem", fontWeight: 500, color: field.accent ? "var(--accent-violet)" : "var(--text-primary)" }}>
                  {field.value}
                </p>
              </div>
            ))}
          </div>

          {/* Sign out */}
          <form action={signOut} className="mt-6">
            <button type="submit" className="btn-danger">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
              Sign out
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
