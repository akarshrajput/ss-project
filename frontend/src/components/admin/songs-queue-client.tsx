"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type QueueEntry = {
  _id: string;
  lyrics: string;
  theme: string | null;
  genre: string | null;
  mood: string | null;
  duration: number;
  email: string;
  username: string;
  status: "pending" | "completed" | "rejected";
  songUrl: string | null;
  songId: string;
  songTitle: string;
  createdAt: string;
  completedAt: string | null;
  rejectedAt?: string | null;
  rejectionComment?: string | null;
};

type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export function SongsQueueClient() {
  const [entries, setEntries] = useState<QueueEntry[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [statusFilter, setStatusFilter] = useState<"pending" | "completed" | "rejected">("pending");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<-1 | 1>(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);
  const [isQueueProcessing, setIsQueueProcessing] = useState(false);
  const queueProcessingRef = useRef(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<QueueEntry | null>(null);
  const [rejectComment, setRejectComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        status: statusFilter,
        search: search.trim(),
        sortBy,
        sortOrder: sortOrder.toString(),
        page: page.toString(),
        limit: "20",
      });

      const res = await fetch(`/api/song-queue?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Failed to load queue.");
      const data = await res.json();
      setEntries(data.entries);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, sortBy, sortOrder, page]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setPage(1); // Reset to first page on search
  };

  async function handleGenerate(id: string) {
    if (generating && generating !== id) return false;
    setGenerating(id);
    setError(null);
    setNotice(null);
    try {
      const res = await fetch("/api/song-queue/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed.");
      
      // Remove from local list for animation
      setEntries(prev => prev.filter(e => e._id !== id));
      
      setNotice(data.alreadyCompleted ? "Already generated." : "Generated successfully!");
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed.");
      return false;
    } finally {
      setGenerating(null);
    }
  }

  async function handleGenerateQueueWise() {
    if (isQueueProcessing) {
      setIsQueueProcessing(false);
      queueProcessingRef.current = false;
      return;
    }

    const pendingOnPage = entries.filter(e => e.status === "pending");
    if (pendingOnPage.length === 0) {
      setError("No pending songs on this page to generate.");
      return;
    }

    setIsQueueProcessing(true);
    queueProcessingRef.current = true;
    setError(null);
    setNotice(null);

    for (const entry of pendingOnPage) {
      if (!queueProcessingRef.current) break;
      const success = await handleGenerate(entry._id);
      if (!success) break;
      // Small pause between items for visual smoothness
      await new Promise(r => setTimeout(r, 800));
    }

    setIsQueueProcessing(false);
    queueProcessingRef.current = false;
    fetchEntries(); // Refresh at the end to fill the page
  }

  function openRejectModal(entry: QueueEntry) {
    setRejectTarget(entry);
    setRejectComment("");
    setShowRejectModal(true);
  }

  async function confirmReject() {
    if (!rejectTarget?._id) return;

    setRejectingId(rejectTarget._id);
    setError(null);
    setNotice(null);

    try {
      const res = await fetch("/api/song-queue/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: rejectTarget._id,
          comment: rejectComment,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reject song request.");

      setEntries((prev) => prev.filter((e) => e._id !== rejectTarget._id));
      setShowRejectModal(false);
      setRejectTarget(null);
      setRejectComment("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject song request.");
    } finally {
      setRejectingId(null);
    }
  }

  const [expandedInfo, setExpandedInfo] = useState<Set<string>>(new Set());

  const toggleInfo = (id: string) => {
    const next = new Set(expandedInfo);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedInfo(next);
  };

  const cardStyle: React.CSSProperties = {
    background: "rgba(13,17,23,0.8)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "1rem",
    backdropFilter: "blur(20px)",
    padding: "1.5rem",
    width: "100%", // FULL WIDTH
  };

  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const sortOptions = [
    { label: "Newest First", value: "createdAt:-1" },
    { label: "Oldest First", value: "createdAt:1" },
    { label: "By Username", value: "username:1" },
    { label: "By Email", value: "email:1" },
  ];

  const activeSortLabel = sortOptions.find(o => o.value === `${sortBy}:${sortOrder}`)?.label || "Sort By";

  const controlBtn = (active: boolean): React.CSSProperties => ({
    padding: "0.5rem 1rem",
    borderRadius: "0.6rem",
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
    border: active ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.1)",
    background: active ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.03)",
    color: active ? "#a5b4fc" : "var(--text-secondary)",
    transition: "all 200ms ease",
  });

  return (
    <div style={{ width: "100%" }}>
      {/* Search and Filters Bar */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
        {/* Status Filters */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="button" onClick={() => { setStatusFilter("pending"); setPage(1); }} style={controlBtn(statusFilter === "pending")}>
            Pending
          </button>
          <button type="button" onClick={() => { setStatusFilter("completed"); setPage(1); }} style={controlBtn(statusFilter === "completed")}>
            Completed
          </button>
          <button type="button" onClick={() => { setStatusFilter("rejected"); setPage(1); }} style={controlBtn(statusFilter === "rejected")}>
            Rejected
          </button>
        </div>

        {/* Queue Wise Generation Button */}
        {statusFilter === "pending" && (
          <button
            type="button"
            onClick={handleGenerateQueueWise}
            disabled={Boolean((generating !== null && !isQueueProcessing) || loading)}
            suppressHydrationWarning
            style={{
              ...controlBtn(isQueueProcessing),
              background: isQueueProcessing ? "rgba(239, 68, 68, 0.15)" : "rgba(99,102,241,0.15)",
              borderColor: isQueueProcessing ? "rgba(239, 68, 68, 0.4)" : "rgba(99,102,241,0.4)",
              color: isQueueProcessing ? "#fca5a5" : "#a5b4fc",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            {isQueueProcessing ? (
              <>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", animation: "pulse 1.5s infinite" }} />
                Stop Auto-Queue
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8" />
                  <path d="M3 16.2V21m0 0h4.8M3 21l6-6" />
                  <path d="M21 7.8V3m0 0h-4.8M21 3l-6 6" />
                  <path d="M3 7.8V3m0 0h4.8M3 3l6 6" />
                </svg>
                Generate Queue Wise
              </>
            )}
          </button>
        )}

        {/* Search */}
        <div style={{ flex: 1, position: "relative", minWidth: 250 }}>
          <input
            type="text"
            placeholder="Search by username, email, or lyrics..."
            value={search}
            onChange={handleSearchChange}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "0.6rem",
              padding: "0.5rem 1rem",
              fontSize: "0.85rem",
              color: "white",
              outline: "none",
            }}
          />
        </div>

        {/* Custom Sorting Dropdown */}
        <div style={{ position: "relative" }} ref={sortRef}>
          <button
            type="button"
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "0.6rem",
              padding: "0.5rem 1rem",
              fontSize: "0.85rem",
              color: "var(--text-secondary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              minWidth: "140px",
              justifyContent: "space-between"
            }}
          >
            {activeSortLabel}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {showSortDropdown && (
            <div style={{
              position: "absolute",
              top: "100%",
              right: 0,
              marginTop: "0.5rem",
              background: "rgba(13,17,23,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "0.75rem",
              padding: "0.4rem",
              zIndex: 100,
              minWidth: "160px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              backdropFilter: "blur(12px)"
            }}>
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    const [field, order] = opt.value.split(":");
                    setSortBy(field);
                    setSortOrder(parseInt(order) as -1 | 1);
                    setPage(1);
                    setShowSortDropdown(false);
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "0.6rem 0.8rem",
                    background: `${sortBy}:${sortOrder}` === opt.value ? "rgba(99,102,241,0.15)" : "transparent",
                    border: "none",
                    borderRadius: "0.5rem",
                    color: `${sortBy}:${sortOrder}` === opt.value ? "#a5b4fc" : "var(--text-secondary)",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 150ms ease"
                  }}
                  onMouseEnter={(e) => {
                    if (`${sortBy}:${sortOrder}` !== opt.value) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    if (`${sortBy}:${sortOrder}` !== opt.value) e.currentTarget.style.background = "transparent";
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: "1.5rem", fontSize: "0.875rem", color: "#fca5a5", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "0.75rem", padding: "1rem" }}>
          ⚠️ {error}
        </div>
      )}
      {notice && (
        <div style={{ marginBottom: "1.5rem", fontSize: "0.875rem", color: "#86efac", background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "0.75rem", padding: "1rem" }}>
          ✓ {notice}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "5rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
          <div style={{ marginBottom: "1rem" }}>Fetching queue data...</div>
          {/* Simple spinner could go here */}
        </div>
      ) : entries.length === 0 ? (
        <div style={{ textAlign: "center", padding: "5rem", color: "var(--text-muted)", fontSize: "0.9rem", background: "rgba(255,255,255,0.02)", borderRadius: "1rem", border: "1px dashed rgba(255,255,255,0.1)" }}>
          No {statusFilter} entries matching your criteria.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
          <AnimatePresence initial={false} mode="popLayout">
            {entries.map((entry) => (
              <motion.div
                key={entry._id}
                layout="position"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50, filter: "blur(10px)", transition: { duration: 0.4 } }}
                transition={{ layout: { type: "spring", stiffness: 480, damping: 40 }, duration: 0.22 }}
                style={cardStyle}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "2rem" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>@{entry.username}</span>
                    <span style={{
                      fontSize: "0.7rem", fontWeight: 700, padding: "0.25rem 0.6rem", borderRadius: "999px",
                      background: entry.status === "pending"
                        ? "rgba(245,158,11,0.1)"
                        : entry.status === "completed"
                          ? "rgba(34,197,94,0.1)"
                          : "rgba(239,68,68,0.1)",
                      color: entry.status === "pending"
                        ? "#fbbf24"
                        : entry.status === "completed"
                          ? "#86efac"
                          : "#fca5a5",
                      border: `1px solid ${entry.status === "pending"
                        ? "rgba(245,158,11,0.2)"
                        : entry.status === "completed"
                          ? "rgba(34,197,94,0.2)"
                          : "rgba(239,68,68,0.2)"}`,
                      textTransform: "uppercase", letterSpacing: "0.05em"
                    }}>
                      {entry.status}
                    </span>
                  </div>

                  <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {entry.email}
                  </p>

                  <div style={{ marginBottom: "1rem" }}>
                    <button
                      type="button"
                      onClick={() => toggleInfo(entry._id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#6366f1",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        padding: 0,
                        marginBottom: expandedInfo.has(entry._id) ? "1rem" : 0,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem"
                      }}
                    >
                      {expandedInfo.has(entry._id) ? "Hide info" : "See info"}
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
                          transform: expandedInfo.has(entry._id) ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 200ms"
                        }}
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>

                    {expandedInfo.has(entry._id) && (
                      <div style={{
                        background: "rgba(0,0,0,0.2)",
                        padding: "1.25rem",
                        borderRadius: "0.75rem",
                        border: "1px solid rgba(255,255,255,0.05)",
                        animation: "fade-in 200ms ease"
                      }}>
                        {/* Tags */}
                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                          {[entry.genre, entry.mood, entry.theme].filter(Boolean).map((tag, idx) => (
                            <span key={idx} style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem", borderRadius: "0.4rem", background: "rgba(99,102,241,0.1)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" }}>
                              {tag}
                            </span>
                          ))}
                          <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem", borderRadius: "0.4rem", background: "rgba(255,255,255,0.05)", color: "var(--text-muted)", border: "1px solid rgba(255,255,255,0.1)" }}>
                            {entry.duration}s
                          </span>
                        </div>

                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.75rem", lineHeight: 1.5 }}>
                          Submitted: {new Date(entry.createdAt).toLocaleString()}
                          {entry.completedAt && ` • Completed: ${new Date(entry.completedAt).toLocaleString()}`}
                          {entry.rejectedAt && ` • Rejected: ${new Date(entry.rejectedAt).toLocaleString()}`}
                        </p>

                        {/* Lyrics */}
                        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                          {entry.lyrics}
                        </p>
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ flex: 1 }} />
                    {entry.songUrl && (
                      <a href={`/song/${entry.songId}`} target="_blank" style={{ fontSize: "0.8rem", color: "#6366f1", fontWeight: 600, textDecoration: "none", borderBottom: "1px solid transparent", transition: "border 200ms" }}
                        onMouseEnter={(e) => e.currentTarget.style.borderBottomColor = "#6366f1"}
                        onMouseLeave={(e) => e.currentTarget.style.borderBottomColor = "transparent"}
                      >
                        View Public Song Page ↗
                      </a>
                    )}
                  </div>
                </div>

                {entry.status === "pending" && (
                  <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    <button type="button" onClick={() => handleGenerate(entry._id)} disabled={Boolean(generating !== null)} suppressHydrationWarning
                      style={{
                        padding: "0.75rem 1.5rem", borderRadius: "0.75rem", border: "none", fontSize: "0.9rem", fontWeight: 700,
                        background: (generating !== null && generating !== entry._id) ? "rgba(255,255,255,0.05)" : generating === entry._id ? "rgba(99,102,241,0.3)" : "linear-gradient(135deg, #6366f1, #818cf8)",
                        color: (generating !== null && generating !== entry._id) ? "var(--text-muted)" : "#fff",
                        cursor: generating !== null ? "not-allowed" : "pointer",
                        boxShadow: generating !== null ? "none" : "0 4px 20px rgba(99,102,241,0.3)",
                        transition: "all 200ms ease", whiteSpace: "nowrap",
                      }}>
                      {generating === entry._id ? "Generating..." : (generating !== null) ? "Queue Busy" : "Generate Now"}
                    </button>
                    <button
                      type="button"
                      onClick={() => openRejectModal(entry)}
                      disabled={Boolean(generating !== null || rejectingId !== null)}
                      suppressHydrationWarning
                      style={{
                        padding: "0.7rem 1.5rem",
                        borderRadius: "0.75rem",
                        border: "1px solid rgba(239,68,68,0.35)",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        background: "rgba(239,68,68,0.12)",
                        color: "#fca5a5",
                        cursor: (generating !== null || rejectingId !== null) ? "not-allowed" : "pointer",
                        transition: "all 200ms ease",
                        whiteSpace: "nowrap",
                        opacity: (generating !== null || rejectingId !== null) ? 0.7 : 1,
                      }}
                    >
                      {rejectingId === entry._id ? "Rejecting..." : "Reject"}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "2rem", paddingBottom: "2rem" }}>
          <button
            disabled={Boolean(page === 1 || loading)}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            suppressHydrationWarning
            style={{ ...controlBtn(false), opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? "not-allowed" : "pointer" }}
          >
            Previous
          </button>
          <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Page <strong>{page}</strong> of {pagination.totalPages}
          </span>
          <button
            disabled={Boolean(page === pagination.totalPages || loading)}
            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
            suppressHydrationWarning
            style={{ ...controlBtn(false), opacity: page === pagination.totalPages ? 0.5 : 1, cursor: page === pagination.totalPages ? "not-allowed" : "pointer" }}
          >
            Next
          </button>
        </div>
      )}

      {showRejectModal && rejectTarget && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(2,6,23,0.72)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            zIndex: 1200,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 560,
              borderRadius: "1rem",
              border: "1px solid rgba(239,68,68,0.25)",
              background: "rgba(15,23,42,0.96)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
              padding: "1.25rem",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#f8fafc" }}>
              Reject Song Request
            </h3>
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem", color: "#94a3b8", lineHeight: 1.6 }}>
              This will mark the request as rejected and send an email update to @{rejectTarget.username} ({rejectTarget.email}).
            </p>

            <div style={{ marginTop: "1rem" }}>
              <label htmlFor="rejectComment" style={{ display: "block", fontSize: "0.78rem", color: "#cbd5e1", marginBottom: "0.45rem", fontWeight: 600 }}>
                Rejection Comment (Optional)
              </label>
              <textarea
                id="rejectComment"
                value={rejectComment}
                onChange={(e) => setRejectComment(e.target.value)}
                placeholder="Optional note for the user about why this request was rejected..."
                rows={4}
                style={{
                  width: "100%",
                  resize: "vertical",
                  borderRadius: "0.7rem",
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(2,6,23,0.7)",
                  color: "#e2e8f0",
                  padding: "0.75rem",
                  fontSize: "0.85rem",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "0.65rem" }}>
              <button
                type="button"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectTarget(null);
                  setRejectComment("");
                }}
                disabled={Boolean(rejectingId)}
                style={{
                  padding: "0.62rem 0.95rem",
                  borderRadius: "0.65rem",
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "transparent",
                  color: "#cbd5e1",
                  fontSize: "0.84rem",
                  fontWeight: 600,
                  cursor: rejectingId ? "not-allowed" : "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmReject}
                disabled={Boolean(rejectingId)}
                style={{
                  padding: "0.62rem 0.95rem",
                  borderRadius: "0.65rem",
                  border: "1px solid rgba(239,68,68,0.45)",
                  background: "rgba(239,68,68,0.18)",
                  color: "#fecaca",
                  fontSize: "0.84rem",
                  fontWeight: 700,
                  cursor: rejectingId ? "not-allowed" : "pointer",
                }}
              >
                {rejectingId ? "Rejecting..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
