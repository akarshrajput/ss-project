"use client";

import { useState, useEffect, useCallback } from "react";

type CronLog = {
  _id: string;
  triggeredAt: string;
  completedAt: string;
  comfyUiOnline: boolean;
  totalPending: number;
  processed: number;
  failed: number;
  skipped: number;
  results: Array<{
    songId: string;
    status: "success" | "failed" | "skipped";
    error?: string;
    durationMs: number;
  }>;
};

type CronStatusData = {
  comfyUrl: string;
  comfyOnline: boolean;
  pendingCount: number;
  logs: CronLog[];
};

export function CronStatusPanel() {
  const [data, setData] = useState<CronStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [triggerLoading, setTriggerLoading] = useState(false);
  const [triggerResult, setTriggerResult] = useState<string | null>(null);
  const [showLogs, setShowLogs] = useState(false);

  const Spinner = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );

  const fetchStatus = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    try {
      const res = await fetch("/api/song-queue/cron/status");
      if (res.ok) {
        setData(await res.json());
      }
    } catch {
      // Silently fail
    } finally {
      if (isManualRefresh) setIsRefreshing(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  async function handleTriggerCron() {
    setTriggerLoading(true);
    setTriggerResult(null);
    try {
      const res = await fetch("/api/song-queue/cron/trigger", {
        method: "POST",
      });
      const result = await res.json();
      if (res.ok) {
        if (result.skipped) {
          setTriggerResult(`⏭️ Skipped: ${result.reason}`);
        } else {
          setTriggerResult(
            `✅ Done: ${result.processed} processed, ${result.failed} failed, ${result.skipped} skipped`,
          );
        }
        // Refresh status after trigger
        fetchStatus();
      } else {
        setTriggerResult(`❌ Error: ${result.error}`);
      }
    } catch (err) {
      setTriggerResult(`❌ Failed to trigger cron.`);
    } finally {
      setTriggerLoading(false);
    }
  }

  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleString();
  }

  function formatDuration(ms: number) {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60_000).toFixed(1)}m`;
  }

  const lastLog = data?.logs?.[0] ?? null;

  const cardStyle: React.CSSProperties = {
    background: "rgba(13,17,23,0.8)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "1rem",
    backdropFilter: "blur(20px)",
    padding: "1.5rem",
    width: "100%",
    marginBottom: "1.5rem",
  };

  const dotStyle = (online: boolean): React.CSSProperties => ({
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: online ? "#22c55e" : "#ef4444",
    boxShadow: online
      ? "0 0 8px rgba(34,197,94,0.5)"
      : "0 0 8px rgba(239,68,68,0.5)",
    display: "inline-block",
    animation: online ? "pulse 2s infinite" : undefined,
  });

  if (loading) {
    return (
      <div style={cardStyle}>
        <div
          style={{
            fontSize: "0.85rem",
            color: "var(--text-muted)",
            textAlign: "center",
            padding: "1rem",
          }}
        >
          Loading cron status...
        </div>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.25rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "rgba(16,185,129,0.12)",
              border: "1px solid rgba(16,185,129,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#34d399"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              Automated Queue Processing
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "0.75rem",
                color: "var(--text-muted)",
              }}
            >
              Cron runs every hour automatically
            </p>
          </div>
        </div>
      </div>

      {/* Status Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "0.75rem",
          marginBottom: "1.25rem",
        }}
      >
        {/* ComfyUI Status */}
        <div
          style={{
            background: "rgba(0,0,0,0.2)",
            borderRadius: "0.75rem",
            padding: "0.85rem",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--text-muted)",
              marginBottom: "0.4rem",
            }}
          >
            ComfyUI GPU
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.88rem",
              fontWeight: 600,
              color: data?.comfyOnline ? "#86efac" : "#fca5a5",
            }}
          >
            <span style={dotStyle(data?.comfyOnline ?? false)} />
            {data?.comfyOnline ? "Online" : "Offline"}
          </div>
        </div>

        {/* Pending Count */}
        <div
          style={{
            background: "rgba(0,0,0,0.2)",
            borderRadius: "0.75rem",
            padding: "0.85rem",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--text-muted)",
              marginBottom: "0.4rem",
            }}
          >
            Pending Songs
          </div>
          <div
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              color:
                (data?.pendingCount ?? 0) > 0 ? "#fbbf24" : "var(--text-primary)",
            }}
          >
            {data?.pendingCount ?? 0}
          </div>
        </div>

        {/* Last Run */}
        <div
          style={{
            background: "rgba(0,0,0,0.2)",
            borderRadius: "0.75rem",
            padding: "0.85rem",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--text-muted)",
              marginBottom: "0.4rem",
            }}
          >
            Last Cron Run
          </div>
          <div
            style={{
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            {lastLog ? formatTime(lastLog.triggeredAt) : "Never"}
          </div>
        </div>

        {/* Last Run Result */}
        <div
          style={{
            background: "rgba(0,0,0,0.2)",
            borderRadius: "0.75rem",
            padding: "0.85rem",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--text-muted)",
              marginBottom: "0.4rem",
            }}
          >
            Last Result
          </div>
          {lastLog ? (
            <div
              style={{
                fontSize: "0.82rem",
                fontWeight: 600,
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
              }}
            >
              {lastLog.processed > 0 && (
                <span style={{ color: "#86efac" }}>
                  {lastLog.processed} ✓
                </span>
              )}
              {lastLog.failed > 0 && (
                <span style={{ color: "#fca5a5" }}>
                  {lastLog.failed} ✗
                </span>
              )}
              {lastLog.skipped > 0 && (
                <span style={{ color: "#fbbf24" }}>
                  {lastLog.skipped} ⏭
                </span>
              )}
              {!lastLog.comfyUiOnline && (
                <span style={{ color: "#fca5a5", fontSize: "0.78rem" }}>
                  GPU offline
                </span>
              )}
              {lastLog.comfyUiOnline &&
                lastLog.processed === 0 &&
                lastLog.failed === 0 &&
                lastLog.skipped === 0 && (
                  <span style={{ color: "var(--text-muted)" }}>
                    Queue empty
                  </span>
                )}
            </div>
          ) : (
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              —
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div
        style={{
          display: "flex",
          gap: "0.6rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <button
          type="button"
          onClick={handleTriggerCron}
          disabled={triggerLoading}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.55rem 1.1rem",
            borderRadius: "0.6rem",
            background: triggerLoading
              ? "rgba(255,255,255,0.05)"
              : "rgba(16,185,129,0.15)",
            border: "1px solid rgba(16,185,129,0.3)",
            color: triggerLoading ? "var(--text-muted)" : "#34d399",
            fontSize: "0.83rem",
            fontWeight: 600,
            cursor: triggerLoading ? "not-allowed" : "pointer",
            transition: "all 200ms ease",
          }}
        >
          {triggerLoading ? (
            <>
              <Spinner />
              Running...
            </>
          ) : (
            <>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Run Cron Now
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => fetchStatus(true)}
          disabled={isRefreshing}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.55rem 1.1rem",
            borderRadius: "0.6rem",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "var(--text-secondary)",
            fontSize: "0.83rem",
            fontWeight: 600,
            cursor: isRefreshing ? "not-allowed" : "pointer",
            transition: "all 200ms ease",
          }}
        >
          {isRefreshing ? (
            <Spinner />
          ) : (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M21 2v6h-6" />
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
              <path d="M3 22v-6h6" />
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
          )}
          Refresh
        </button>

        {(data?.logs?.length ?? 0) > 0 && (
          <button
            type="button"
            onClick={() => setShowLogs(!showLogs)}
            style={{
              background: "none",
              border: "none",
              color: "#6366f1",
              fontSize: "0.83rem",
              fontWeight: 600,
              cursor: "pointer",
              padding: "0.55rem 0.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            {showLogs ? "Hide History" : "View History"}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: showLogs ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 200ms",
              }}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        )}
      </div>

      {/* Trigger Result */}
      {triggerResult && (
        <div
          style={{
            marginTop: "0.75rem",
            fontSize: "0.85rem",
            padding: "0.6rem 0.85rem",
            borderRadius: "0.5rem",
            background: triggerResult.startsWith("✅")
              ? "rgba(34,197,94,0.07)"
              : triggerResult.startsWith("⏭️")
                ? "rgba(245,158,11,0.07)"
                : "rgba(239,68,68,0.07)",
            border: triggerResult.startsWith("✅")
              ? "1px solid rgba(34,197,94,0.2)"
              : triggerResult.startsWith("⏭️")
                ? "1px solid rgba(245,158,11,0.2)"
                : "1px solid rgba(239,68,68,0.2)",
            color: triggerResult.startsWith("✅")
              ? "#86efac"
              : triggerResult.startsWith("⏭️")
                ? "#fbbf24"
                : "#fca5a5",
          }}
        >
          {triggerResult}
        </div>
      )}

      {/* History Logs */}
      {showLogs && data?.logs && data.logs.length > 0 && (
        <div
          style={{
            marginTop: "1rem",
            background: "rgba(0,0,0,0.2)",
            borderRadius: "0.75rem",
            border: "1px solid rgba(255,255,255,0.05)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "0.75rem 1rem",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--text-muted)",
            }}
          >
            Recent Cron Runs
          </div>
          {data.logs.map((log) => (
            <div
              key={log._id}
              style={{
                padding: "0.75rem 1rem",
                borderBottom: "1px solid rgba(255,255,255,0.03)",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                fontSize: "0.82rem",
              }}
            >
              <span style={{ color: "var(--text-muted)", minWidth: "150px" }}>
                {formatTime(log.triggeredAt)}
              </span>
              <span style={dotStyle(log.comfyUiOnline)} />
              {!log.comfyUiOnline ? (
                <span style={{ color: "#fca5a5" }}>GPU offline — skipped</span>
              ) : log.totalPending === 0 ? (
                <span style={{ color: "var(--text-muted)" }}>
                  Queue empty
                </span>
              ) : (
                <div
                  style={{
                    display: "flex",
                    gap: "0.6rem",
                    flexWrap: "wrap",
                  }}
                >
                  {log.processed > 0 && (
                    <span style={{ color: "#86efac", fontWeight: 600 }}>
                      {log.processed} generated
                    </span>
                  )}
                  {log.failed > 0 && (
                    <span style={{ color: "#fca5a5", fontWeight: 600 }}>
                      {log.failed} failed
                    </span>
                  )}
                  {log.skipped > 0 && (
                    <span style={{ color: "#fbbf24", fontWeight: 600 }}>
                      {log.skipped} skipped
                    </span>
                  )}
                </div>
              )}
              {log.completedAt && log.triggeredAt && (
                <span
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.75rem",
                    marginLeft: "auto",
                  }}
                >
                  {formatDuration(
                    new Date(log.completedAt).getTime() -
                      new Date(log.triggeredAt).getTime(),
                  )}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
