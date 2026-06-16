import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { getAppUserProfile } from "@/lib/app-store";
import { getUser } from "@/lib/auth";
import { SongsQueueClient } from "@/components/admin/songs-queue-client";
import { CronStatusPanel } from "@/components/admin/cron-status-panel";

export const metadata: Metadata = buildMetadata({
  title: "Songs Queue Management",
  description: "Manage pending and completed song generation requests.",
  path: "/admin/songs-queue-management",
  noIndex: true,
});

export default async function SongsQueueManagementPage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/admin/songs-queue-management");

  const profile = await getAppUserProfile(user.id);
  if (profile?.role !== "admin") redirect("/dashboard");

  return (
    <main className="site-container w-full flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div style={{ width: "100%" }}>
        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <Link href="/admin" style={{ fontSize: "0.8rem", color: "var(--text-muted)", textDecoration: "none" }}>← Admin</Link>
          </div>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "0.4rem",
            fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
            color: "#a5b4fc", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: "999px", padding: "0.3rem 0.85rem", marginBottom: "0.85rem",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", display: "inline-block" }} />
            Queue Management
          </span>
          <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)" }}>
            Songs Queue
          </h1>
          <p style={{ marginTop: "0.4rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Review pending song requests and generate them via ComfyUI.
          </p>
        </div>

        <CronStatusPanel />
        <SongsQueueClient />
      </div>
    </main>
  );
}
