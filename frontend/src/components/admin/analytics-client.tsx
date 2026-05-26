"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpotifyLogo, Globe, MusicNote, ChartBar, Compass, Clock } from "@phosphor-icons/react";

interface DailyTrendPoint {
  date: string;
  sessions: number; // pageviews
  completed: number; // unique visitors
}

interface TopCountry {
  country: string;
  count: number;
}

interface TopPage {
  pathname: string;
  count: number;
}

interface TopReferrer {
  referrer: string;
  count: number;
}

interface TopBrowser {
  browser: string;
  count: number;
}

interface TopOS {
  os: string;
  count: number;
}

interface TopDevice {
  device: string;
  count: number;
}

interface RecentEvent {
  sessionId: string;
  lyrics: string; // mapped to pathname
  status: string; // pageview
  country: string;
  updatedAt: string;
  genre: string; // mapped to browser
  mood: string; // mapped to device
}

interface AnalyticsData {
  liveUsers: number;
  totalSessions: number; // pageviews
  emailViewed: number; // unique visitors
  completed: number; // unique visitors
  topCountries: TopCountry[];
  topPages?: TopPage[];
  topReferrers?: TopReferrer[];
  topBrowsers?: TopBrowser[];
  topOS?: TopOS[];
  topDevices?: TopDevice[];
  dailyTrend: DailyTrendPoint[];
  recentEvents: RecentEvent[];
}

interface AnalyticsClientProps {
  initialData: AnalyticsData;
}

export function AnalyticsClient({ initialData }: AnalyticsClientProps) {
  const [data, setData] = useState<AnalyticsData>(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeRange, setActiveRange] = useState<string>("7d");

  // Fetch metrics data when range changes or manual refresh triggers
  const fetchDataForRange = async (range: string) => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/admin/analytics?range=${range}`);
      if (res.ok) {
        const latest = await res.json();
        setData(latest);
        setActiveRange(range);
      }
    } catch (err) {
      console.error("Failed to fetch analytics range:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Background polling for real-time live data every 10 seconds
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch(`/api/admin/analytics?range=${activeRange}`);
        if (res.ok) {
          const latest = await res.json();
          setData(latest);
        }
      } catch (err) {
        console.error("Failed to poll analytics updates:", err);
      }
    };

    const interval = setInterval(fetchLatest, 10000);
    return () => clearInterval(interval);
  }, [activeRange]);

  const handleManualRefresh = () => {
    fetchDataForRange(activeRange);
  };

  const {
    liveUsers,
    totalSessions, // total pageviews
    emailViewed, // unique visitors
    topCountries,
    topPages = [],
    topReferrers = [],
    topBrowsers = [],
    topOS = [],
    topDevices = [],
    dailyTrend,
    recentEvents,
  } = data;

  // Real world calculations
  const totalPageviews = totalSessions;
  const uniqueVisitors = emailViewed;
  const avgPagesPerVisitor = uniqueVisitors > 0 ? (totalPageviews / uniqueVisitors).toFixed(1) : "0.0";

  // ── SVG Chart Calculations
  // Find maximum values for chart scaling
  const maxSessions = Math.max(...dailyTrend.map((t) => t.sessions), 6);
  const chartHeight = 150;
  const chartWidth = 500;
  const paddingX = 40;
  const paddingY = 20;

  // Map daily points to coordinate pairs
  const points = dailyTrend.map((t, idx) => {
    const x = paddingX + (idx / (dailyTrend.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (t.sessions / maxSessions) * (chartHeight - paddingY * 2);
    const cy = chartHeight - paddingY - (t.completed / maxSessions) * (chartHeight - paddingY * 2);
    return { x, y, cy, ...t };
  });

  // SVG Path generator helper
  const sessionsPath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const completedPath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.cy}`).join(" ");

  const sessionsArea = sessionsPath
    ? `${sessionsPath} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
    : "";

  const completedArea = completedPath
    ? `${completedPath} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
    : "";

  // Styling helpers
  const cardStyle: React.CSSProperties = {
    background: "rgba(13, 17, 23, 0.8)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: "1rem",
    padding: "1.5rem",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    backdropFilter: "blur(12px)",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.5; }
        }
        .live-dot {
          animation: pulseGlow 1.8s infinite ease-in-out;
        }
        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
        }
        .dashboard-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 1024px) {
          .dashboard-layout {
            grid-template-columns: 1.7fr 1fr;
          }
        }
        .bar-hover:hover {
          background: rgba(255, 255, 255, 0.02) !important;
        }
      `}} />

      {/* Top Banner & Control */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
        <div>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "0.4rem",
            fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
            color: "#f43f5e", background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)",
            borderRadius: "999px", padding: "0.3rem 0.85rem", marginBottom: "0.5rem",
          }}>
            <span className="live-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#f43f5e", display: "inline-block" }} />
            Site Traffic Analytics
          </span>
          <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "2.25rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Visitor Analytics
          </h1>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem" }}>
          {/* Range Selection Button Group */}
          <div style={{ display: "flex", gap: "0.25rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", padding: "0.2rem", borderRadius: "0.6rem" }}>
            {[
              { label: "24 Hour", value: "24h" },
              { label: "7 Days", value: "7d" },
              { label: "Month", value: "30d" },
              { label: "Year", value: "1y" }
            ].map((btn) => {
              const isActive = activeRange === btn.value;
              return (
                <button
                  key={btn.value}
                  onClick={() => fetchDataForRange(btn.value)}
                  style={{
                    background: isActive ? "#f43f5e" : "transparent",
                    color: isActive ? "#ffffff" : "var(--text-secondary)",
                    border: "none",
                    borderRadius: "0.4rem",
                    padding: "0.35rem 0.8rem",
                    fontSize: "0.75rem",
                    fontWeight: isActive ? 700 : 600,
                    cursor: "pointer",
                    transition: "all 150ms ease"
                  }}
                  className={!isActive ? "hover:text-white" : ""}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>

          {/* Live Visitor Indicator */}
          <div style={{
            display: "flex", alignItems: "center", gap: "0.6rem",
            background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)",
            padding: "0.5rem 1rem", borderRadius: "0.75rem",
          }}>
            <span className="live-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "block" }} />
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#10b981", fontFamily: '"Space Grotesk", sans-serif' }}>
              {liveUsers} Active Online
            </span>
          </div>

          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            style={{
              padding: "0.55rem 1.1rem", borderRadius: "0.6rem", border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)", color: "var(--text-primary)",
              fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", transition: "all 150ms ease"
            }}
            className="hover:bg-white/10"
          >
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* ── METRICS SUMMARY GRID ── */}
      <div className="analytics-grid">
        {/* Total Pageviews */}
        <div style={cardStyle}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Total Pageviews</span>
          <p style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: '"Space Grotesk", sans-serif', margin: "0.2rem 0" }}>{totalPageviews}</p>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Raw volume of page hits</span>
        </div>

        {/* Unique Visitors */}
        <div style={cardStyle}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Unique Visitors</span>
          <p style={{ fontSize: "2rem", fontWeight: 800, color: "#a5b4fc", fontFamily: '"Space Grotesk", sans-serif', margin: "0.2rem 0" }}>{uniqueVisitors}</p>
          <span style={{ fontSize: "0.72rem", color: "#a5b4fc", fontWeight: 600 }}>Unique session indicators</span>
        </div>

        {/* Avg views/session */}
        <div style={cardStyle}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Avg. Pages / Visitor</span>
          <p style={{ fontSize: "2rem", fontWeight: 800, color: "#34d399", fontFamily: '"Space Grotesk", sans-serif', margin: "0.2rem 0" }}>{avgPagesPerVisitor}</p>
          <span style={{ fontSize: "0.72rem", color: "#34d399", fontWeight: 600 }}>Depth of user visits</span>
        </div>

        {/* Live Users Counter */}
        <div style={cardStyle}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Active Live</span>
          <p style={{ fontSize: "2rem", fontWeight: 800, color: "#10b981", fontFamily: '"Space Grotesk", sans-serif', margin: "0.2rem 0" }}>{liveUsers}</p>
          <span style={{ fontSize: "0.72rem", color: "#10b981", fontWeight: 600 }}>Active in the last 5 minutes</span>
        </div>
      </div>

      {/* ── TWO-COLUMN DASHBOARD LAYOUT ── */}
      <div className="dashboard-layout">
        
        {/* LEFT COLUMN: Charts & Timeline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Trend Chart (SVG) */}
          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: '"Space Grotesk", sans-serif' }}>Traffic Trend</h3>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Pageviews vs Unique Visitors ({activeRange === "24h" ? "last 24 hours" : activeRange === "7d" ? "last 7 days" : activeRange === "30d" ? "last 30 days" : "last year"})
                </p>
              </div>
              <div style={{ display: "flex", gap: "1rem", fontSize: "0.72rem" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "#818cf8", fontWeight: 600 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1", display: "inline-block" }} />
                  Pageviews
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "#34d399", fontWeight: 600 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                  Unique Visitors
                </span>
              </div>
            </div>

            {/* SVG Chart Container */}
            <div style={{ position: "relative", width: "100%", height: 180 }}>
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" height="100%" preserveAspectRatio="none">
                <defs>
                  {/* Sessions (Pageviews) Gradient */}
                  <linearGradient id="sessionsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                  </linearGradient>
                  {/* Completed (Visitors) Gradient */}
                  <linearGradient id="completedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Y-Axis Guide Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                  const y = paddingY + ratio * (chartHeight - paddingY * 2);
                  return (
                    <line
                      key={idx}
                      x1={paddingX}
                      y1={y}
                      x2={chartWidth - paddingX}
                      y2={y}
                      stroke="rgba(255,255,255,0.04)"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Sessions Area and Line */}
                {sessionsArea && <polygon points={sessionsArea} fill="url(#sessionsGrad)" />}
                {sessionsPath && <path d={sessionsPath} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />}

                {/* Completed Area and Line */}
                {completedArea && <polygon points={completedArea} fill="url(#completedGrad)" />}
                {completedPath && <path d={completedPath} fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3 2" />}

                {/* Chart Dots & Values */}
                {points.map((p, idx) => {
                  let showLabel = true;
                  if (activeRange === "24h" && idx % 4 !== 0) showLabel = false;
                  if (activeRange === "30d" && idx % 5 !== 0) showLabel = false;

                  return (
                    <g key={idx}>
                      {/* Hover hotspot */}
                      <circle cx={p.x} cy={p.y} r="3.5" fill="#6366f1" stroke="rgba(13,17,23,0.9)" strokeWidth="1" />
                      <circle cx={p.x} cy={p.cy} r="2.5" fill="#10b981" stroke="rgba(13,17,23,0.9)" strokeWidth="0.8" />
                      
                      {/* X-Axis labels */}
                      {showLabel && (
                        <text
                          x={p.x}
                          y={chartHeight - 4}
                          fill="var(--text-muted)"
                          fontSize="7"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {activeRange === "24h" 
                            ? p.date.split(" ")[1] // e.g. "10:00"
                            : activeRange === "1y"
                              ? new Date(p.date + "-02").toLocaleDateString("en-US", { month: "short" }) // e.g. "Jan"
                              : new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                          }
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Browser, OS & Device Breakdown */}
          <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            
            {/* Devices Card */}
            <div style={cardStyle}>
              <h3 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                Top Devices
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {topDevices.map((d, idx) => {
                  const maxCount = Math.max(...topDevices.map((x) => x.count), 1);
                  const pct = Math.round((d.count / maxCount) * 100);
                  return (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", width: "35%", fontWeight: 600 }}>
                        {d.device}
                      </span>
                      <div style={{ flex: 1, height: 12, background: "rgba(255,255,255,0.02)", borderRadius: "3px", overflow: "hidden", position: "relative" }}>
                        <div style={{ height: "100%", background: "#6366f1", opacity: 0.8, width: `${pct}%` }} />
                        <span style={{ position: "absolute", right: "4px", top: "-1px", fontSize: "0.6rem", fontWeight: 700, color: "var(--text-primary)" }}>{d.count}</span>
                      </div>
                    </div>
                  );
                })}
                {topDevices.length === 0 && <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>No device log.</span>}
              </div>
            </div>

            {/* Browsers Card */}
            <div style={cardStyle}>
              <h3 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                Top Browsers
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {topBrowsers.map((b, idx) => {
                  const maxCount = Math.max(...topBrowsers.map((x) => x.count), 1);
                  const pct = Math.round((b.count / maxCount) * 100);
                  return (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", width: "35%", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {b.browser}
                      </span>
                      <div style={{ flex: 1, height: 12, background: "rgba(255,255,255,0.02)", borderRadius: "3px", overflow: "hidden", position: "relative" }}>
                        <div style={{ height: "100%", background: "#10b981", opacity: 0.8, width: `${pct}%` }} />
                        <span style={{ position: "absolute", right: "4px", top: "-1px", fontSize: "0.6rem", fontWeight: 700, color: "var(--text-primary)" }}>{b.count}</span>
                      </div>
                    </div>
                  );
                })}
                {topBrowsers.length === 0 && <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>No browser log.</span>}
              </div>
            </div>

            {/* OS Card */}
            <div style={cardStyle}>
              <h3 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                Operating Systems
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {topOS.map((o, idx) => {
                  const maxCount = Math.max(...topOS.map((x) => x.count), 1);
                  const pct = Math.round((o.count / maxCount) * 100);
                  return (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", width: "35%", fontWeight: 600 }}>
                        {o.os}
                      </span>
                      <div style={{ flex: 1, height: 12, background: "rgba(255,255,255,0.02)", borderRadius: "3px", overflow: "hidden", position: "relative" }}>
                        <div style={{ height: "100%", background: "#fbbf24", opacity: 0.8, width: `${pct}%` }} />
                        <span style={{ position: "absolute", right: "4px", top: "-1px", fontSize: "0.6rem", fontWeight: 700, color: "var(--text-primary)" }}>{o.count}</span>
                      </div>
                    </div>
                  );
                })}
                {topOS.length === 0 && <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>No OS log.</span>}
              </div>
            </div>

          </div>

          {/* Live Visitor Feed (Page Views) */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: '"Space Grotesk", sans-serif', display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Clock size={18} color="#a5b4fc" />
              Live Activities Feed
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
              {recentEvents.map((evt, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.6rem 0.8rem",
                    borderRadius: "0.5rem",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.04)",
                    fontSize: "0.8rem",
                    transition: "all 150ms ease",
                  }}
                  className="bar-hover"
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", maxWidth: "60%" }}>
                    <span style={{ fontWeight: 700, color: "#6366f1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {evt.lyrics}
                    </span>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                      Device: <strong style={{ color: "var(--text-secondary)" }}>{evt.mood}</strong> · Browser: <strong style={{ color: "var(--text-secondary)" }}>{evt.genre}</strong>
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      {evt.country !== "Unknown" ? `🌐 ${evt.country}` : "🌐 ??"}
                    </span>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      {new Date(evt.updatedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}
              {recentEvents.length === 0 && (
                <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>
                  No traffic log. Try loading another page in another tab to trigger events!
                </div>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Country & Preferences */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Top Visited Pages */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: '"Space Grotesk", sans-serif', display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Compass size={18} color="#a5b4fc" />
              Top Visited Pages
            </h3>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.85rem" }}>Most visited page paths on this site</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {topPages.map((p, idx) => {
                const maxCount = Math.max(...topPages.map((x) => x.count), 1);
                const pct = Math.round((p.count / maxCount) * 100);
                return (
                  <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: 600 }}>
                      <span style={{ color: "var(--text-secondary)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", maxWidth: "80%" }}>
                        {p.pathname}
                      </span>
                      <span style={{ color: "var(--text-primary)" }}>{p.count}</span>
                    </div>
                    {/* Horizontal Bar */}
                    <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.03)", width: "100%", overflow: "hidden" }}>
                      <div style={{ height: "100%", background: "#6366f1", opacity: 0.85, width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
              {topPages.length === 0 && (
                <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "1.5rem" }}>
                  No page views tracked.
                </div>
              )}
            </div>
          </div>

          {/* Top Referrers */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: '"Space Grotesk", sans-serif', display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <ChartBar size={18} color="#a5b4fc" />
              Traffic Sources
            </h3>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.85rem" }}>Top referrer domains</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {topReferrers.map((r, idx) => {
                const maxCount = Math.max(...topReferrers.map((x) => x.count), 1);
                const pct = Math.round((r.count / maxCount) * 100);
                return (
                  <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: 600 }}>
                      <span style={{ color: "var(--text-secondary)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", maxWidth: "80%" }}>
                        {r.referrer === "direct" ? "Direct Traffic" : r.referrer}
                      </span>
                      <span style={{ color: "var(--text-primary)" }}>{r.count}</span>
                    </div>
                    {/* Horizontal Bar */}
                    <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.03)", width: "100%", overflow: "hidden" }}>
                      <div style={{ height: "100%", background: "#10b981", opacity: 0.85, width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
              {topReferrers.length === 0 && (
                <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "1.5rem" }}>
                  No referrers logged.
                </div>
              )}
            </div>
          </div>

          {/* Geo Distribution */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: '"Space Grotesk", sans-serif', display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Globe size={18} color="#a5b4fc" />
              Geo Locations
            </h3>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.85rem" }}>Top countries by page hits</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {topCountries.map((c, idx) => {
                const maxCount = Math.max(...topCountries.map((x) => x.count), 1);
                const pct = Math.round((c.count / maxCount) * 100);
                return (
                  <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: 600 }}>
                      <span style={{ color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <span>🌐</span> {c.country === "Unknown" ? "Unknown Region" : `Country Code: ${c.country}`}
                      </span>
                      <span style={{ color: "var(--text-primary)" }}>{c.count}</span>
                    </div>
                    {/* Horizontal Bar */}
                    <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.03)", width: "100%", overflow: "hidden" }}>
                      <div style={{ height: "100%", background: "#fbbf24", opacity: 0.85, width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
              {topCountries.length === 0 && (
                <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "1.5rem" }}>
                  No locations tracked.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
