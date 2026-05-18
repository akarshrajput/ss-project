import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { getAppUserProfile } from "@/lib/app-store";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAnalyticsStats } from "@/lib/analytics-store";

export const metadata: Metadata = buildMetadata({
  title: "Generator Statistics & Drop-off Tracker",
  description: "Track user funnel conversion and details of abandoned song generations.",
  path: "/admin/statistics",
  noIndex: true,
});

export default async function AdminStatisticsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin/statistics");

  const profile = await getAppUserProfile(user.id);
  if (profile?.role !== "admin") redirect("/dashboard");

  // Fetch stats from MongoDB
  const stats = await getAnalyticsStats();

  // ── Shared Card Styles
  const cardStyle: React.CSSProperties = {
    background: "rgba(13, 17, 23, 0.8)",
    border: "1px solid rgba(255, 255, 255, 0.07)",
    borderRadius: "1rem",
    backdropFilter: "blur(16px)",
    padding: "1.5rem",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.4)",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  };

  const metricTitleStyle: React.CSSProperties = {
    fontSize: "0.78rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "var(--text-muted)",
  };

  const metricValueStyle: React.CSSProperties = {
    fontSize: "2rem",
    fontWeight: 800,
    color: "var(--text-primary)",
    fontFamily: '"Space Grotesk", sans-serif',
    lineHeight: 1.2,
  };

  const badgeStyle = (status: string): React.CSSProperties => {
    const isStep1 = status === "started";
    return {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.35rem",
      padding: "0.25rem 0.65rem",
      borderRadius: "999px",
      fontSize: "0.72rem",
      fontWeight: 600,
      background: isStep1 ? "rgba(239, 68, 68, 0.12)" : "rgba(245, 158, 11, 0.12)",
      color: isStep1 ? "#f87171" : "#fbbf24",
      border: isStep1 ? "1px solid rgba(239, 68, 68, 0.25)" : "1px solid rgba(245, 158, 11, 0.25)",
      width: "fit-content",
    };
  };

  return (
    <main className="site-container w-full flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}>
        
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <Link href="/admin" style={{ fontSize: "0.82rem", color: "var(--text-muted)", textDecoration: "none", transition: "color 150ms" }} className="hover:text-white">
              Admin Dashboard
            </Link>
          </div>
          
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
            <div>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
                color: "#a5b4fc", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: "999px", padding: "0.3rem 0.85rem", marginBottom: "0.85rem",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", display: "inline-block" }} />
                Analytics & Insights
              </span>
              <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "2.25rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                Funnel Statistics
              </h1>
            </div>
            
            <a href="/admin/statistics" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              padding: "0.6rem 1.25rem", borderRadius: "0.6rem", border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)", color: "var(--text-primary)",
              fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", textDecoration: "none",
              transition: "all 150ms ease"
            }} className="hover:bg-white/10">
              Refresh Data
            </a>
          </div>
        </div>

        {/* ── METRICS GRID ── */}
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", marginBottom: "2rem" }}>
          
          {/* Card 1: Total Interested */}
          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span style={metricTitleStyle}>Started Flow</span>
            </div>
            <p style={metricValueStyle}>{stats.totalStarted}</p>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "auto" }}>
              Typed lyrics and opened Step 1
            </p>
          </div>

          {/* Card 2: Reached Email */}
          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span style={metricTitleStyle}>Reached Email Step</span>
            </div>
            <p style={metricValueStyle}>{stats.proceededToEmail}</p>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "auto" }}>
              {stats.emailProceedRate}% of interested users · Step 2
            </p>
          </div>

          {/* Card 3: Completed */}
          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span style={metricTitleStyle}>Completed Songs</span>
            </div>
            <p style={metricValueStyle}>{stats.completed}</p>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "auto" }}>
              {stats.emailSubmitRate}% email submission rate
            </p>
          </div>

          {/* Card 4: Drop-offs */}
          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span style={metricTitleStyle}>Total Drop-offs</span>
            </div>
            <p style={{ ...metricValueStyle, color: "#f87171" }}>{stats.totalDropoffs}</p>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "auto" }}>
              {stats.totalStarted > 0 ? Math.round((stats.totalDropoffs / stats.totalStarted) * 100) : 0}% abandonment rate
            </p>
          </div>

          {/* Card 5: Conversion Rate */}
          <div style={{ ...cardStyle, border: "1px solid rgba(16,185,129,0.2)", background: "linear-gradient(135deg, rgba(13,17,23,0.9), rgba(16,185,129,0.05))" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span style={metricTitleStyle}>Conversion Rate</span>
            </div>
            <p style={{ ...metricValueStyle, color: "#34d399" }}>{stats.conversionRate}%</p>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "auto" }}>
              Overall lyrics-to-song conversion
            </p>
          </div>

        </div>

        {/* ─── VISUAL FUNNEL PROGRESSION ─── */}
        <div style={{ ...cardStyle, gap: "1.5rem", marginBottom: "2.5rem" }}>
          <div>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: '"Space Grotesk", sans-serif' }}>
              User Progression Funnel
            </h2>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
              Visual representation of drop-offs at each step of the lyrics generation flow.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            
            {/* Step 1 */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                <span style={{ color: "var(--text-primary)" }}>1. Entered Lyrics & Clicked Generate (Step 1 Popup)</span>
                <span style={{ color: "#a5b4fc" }}>{stats.totalStarted} users (100%)</span>
              </div>
              <div style={{ height: 10, borderRadius: 999, background: "rgba(255,255,255,0.05)", width: "100%", overflow: "hidden" }}>
                <div style={{ height: "100%", background: "linear-gradient(90deg, #6366f1, #818cf8)", width: stats.totalStarted > 0 ? "100%" : "0%" }} />
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                <span style={{ color: "var(--text-primary)" }}>2. Custom Options Confirmed & Reached Email Input (Step 2 Popup)</span>
                <span style={{ color: "#fbbf24" }}>{stats.proceededToEmail} users ({stats.emailProceedRate}%)</span>
              </div>
              <div style={{ height: 10, borderRadius: 999, background: "rgba(255,255,255,0.05)", width: "100%", overflow: "hidden" }}>
                <div style={{ height: "100%", background: "linear-gradient(90deg, #f59e0b, #fbbf24)", width: `${stats.emailProceedRate}%` }} />
              </div>
              <p style={{ fontSize: "0.72rem", color: "#fca5a5", marginTop: "0.25rem", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                <span>Drop-off before this step:</span>
                <strong>{stats.dropoffCustomize} users ({stats.totalStarted > 0 ? Math.round((stats.dropoffCustomize / stats.totalStarted) * 100) : 0}%)</strong>
              </p>
            </div>

            {/* Step 3 */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                <span style={{ color: "var(--text-primary)" }}>3. Entered Email & Successfully Generated Song</span>
                <span style={{ color: "#34d399" }}>{stats.completed} users ({stats.conversionRate}%)</span>
              </div>
              <div style={{ height: 10, borderRadius: 999, background: "rgba(255,255,255,0.05)", width: "100%", overflow: "hidden" }}>
                <div style={{ height: "100%", background: "linear-gradient(90deg, #10b981, #34d399)", width: `${stats.conversionRate}%` }} />
              </div>
              <p style={{ fontSize: "0.72rem", color: "#fca5a5", marginTop: "0.25rem", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                <span>Drop-off at email gate:</span>
                <strong>{stats.dropoffEmail} users ({stats.totalStarted > 0 ? Math.round((stats.dropoffEmail / stats.totalStarted) * 100) : 0}%)</strong>
              </p>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
