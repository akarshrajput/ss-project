import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getAppUserProfile } from "@/lib/app-store";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildMetadata({
  title: "User Dashboard",
  description: "Private Songify workspace dashboard.",
  path: "/dashboard",
  noIndex: true,
});

const quickLinks = [
  {
    href: "/studio",
    title: "Create Song",
    desc: "Go to Studio and generate your next track using AI.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
    ),
    color: "#6366f1",
  },
  {
    href: "/library",
    title: "My Library",
    desc: "Review all generated and saved songs in your account.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M9 18V5l12-2v13M9 18c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-2c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"/>
      </svg>
    ),
    color: "#2dd4bf",
  },
  {
    href: "/account",
    title: "Account Settings",
    desc: "Manage your login credentials and profile preferences.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    color: "#a855f7",
  },
];

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profile = user ? await getAppUserProfile(user.id) : null;
  const displayName = profile?.fullName ?? user?.user_metadata?.full_name ?? "there";

  return (
    <main className="site-container w-full flex-1 px-4 py-12 sm:px-6 lg:px-8">

      {/* Greeting */}
      <div style={{ marginBottom: "2.5rem" }}>
        <span className="badge badge-violet mb-4">Dashboard</span>
        <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)" }}>
          Welcome back, {displayName} 👋
        </h1>
        <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          {profile?.email ?? user?.email} · Role:{" "}
          <span style={{ color: "var(--accent-violet)", fontWeight: 600 }}>{profile?.role ?? "user"}</span>
        </p>
      </div>

      {/* Quick access grid */}
      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        {quickLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{ textDecoration: "none", display: "block" }}
            className="glass-card glass-card-glow"
          >
            <div style={{ padding: "1.5rem" }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: `${item.color}18`, border: `1px solid ${item.color}28`, display: "flex", alignItems: "center", justifyContent: "center", color: item.color, marginBottom: "1rem" }}>
                {item.icon}
              </div>
              <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
                {item.title}
              </h2>
              <p style={{ fontSize: "0.83rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
