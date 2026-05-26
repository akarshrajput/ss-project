import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { getAppUserProfile } from "@/lib/app-store";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getRichAnalyticsData } from "@/lib/analytics-store";
import { AnalyticsClient } from "@/components/admin/analytics-client";

export const metadata: Metadata = buildMetadata({
  title: "Analytics Dashboard",
  description: "Interactive real-time analytics for visitors, locations, preferences, and conversions.",
  path: "/admin/analytics",
  noIndex: true,
});

export default async function AdminAnalyticsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect("/login?next=/admin/analytics");

  const profile = await getAppUserProfile(user.id);
  if (profile?.role !== "admin") redirect("/dashboard");

  // Fetch initial analytics metrics directly from MongoDB
  const initialData = await getRichAnalyticsData();

  return (
    <main className="site-container w-full flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* Navigation Breadcrumbs */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Link href="/admin" style={{ fontSize: "0.82rem", color: "var(--text-muted)", textDecoration: "none", transition: "color 150ms" }} className="hover:text-white">
            Admin Dashboard
          </Link>
          <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>/</span>
          <span style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 600 }}>Analytics</span>
        </div>

        {/* Mount Interactive Client Dashboard */}
        <AnalyticsClient initialData={initialData} />

      </div>
    </main>
  );
}
