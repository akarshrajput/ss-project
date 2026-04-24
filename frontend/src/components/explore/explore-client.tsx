"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, Suspense, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { WavePlayer } from "@/components/ui/wave-player";

type ExploreSong = {
  songId: string;
  songTitle: string;
  username: string;
  genre: string | null;
  mood: string | null;
  theme: string | null;
  duration: number;
  songUrl: string | null;
  completedAt: string | null;
  createdAt: string;
};

const GENRES = ["All", "Pop", "Rock", "Hip-Hop", "R&B", "Country", "Jazz", "Lo-fi", "EDM", "Folk", "Classical"];
const MOODS = ["All", "Happy", "Sad", "Energetic", "Calm", "Dark", "Dreamy", "Upbeat", "Melancholic"];

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [songs, setSongs] = useState<ExploreSong[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [showMoodDropdown, setShowMoodDropdown] = useState(false);
  const genreRef = useRef<HTMLDivElement>(null);
  const moodRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (genreRef.current && !genreRef.current.contains(e.target as Node)) {
        setShowGenreDropdown(false);
      }
      if (moodRef.current && !moodRef.current.contains(e.target as Node)) {
        setShowMoodDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filters from URL
  const search = searchParams.get("search") || "";
  const genre = searchParams.get("genre") || "All";
  const mood = searchParams.get("mood") || "All";
  const page = parseInt(searchParams.get("page") || "1");

  const [searchInput, setSearchInput] = useState(search);

  // Sync search input with URL
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const updateUrl = useCallback((newParams: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === "" || value === "All") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    // Reset to page 1 if search/filter changes, unless page is explicitly set
    if (!newParams.page && page !== 1) {
      params.set("page", "1");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router, page]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchInput !== search) {
        updateUrl({ search: searchInput, page: 1 });
      }
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput, search, updateUrl]);

  const fetchSongs = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        search,
        genre,
        mood,
        page: String(page),
        limit: "20"
      }).toString();
      
      const res = await fetch(`/api/song-queue/explore?${query}`);
      if (res.ok) {
        const data = await res.json();
        setSongs(data.songs);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, [search, genre, mood, page]);

  useEffect(() => { fetchSongs(); }, [fetchSongs]);

  const handlePageChange = (p: number) => {
    if (p >= 1 && p <= totalPages) {
      updateUrl({ page: p });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Search & Filters */}
      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: "1.5rem", marginBottom: "3rem" }}>
        
        {/* Search */}
        <div style={{
          position: "relative",
          borderRadius: "0.75rem", border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(13,17,23,0.8)", backdropFilter: "blur(16px)",
          flex: "1 1 300px", maxWidth: 600
        }}>
          <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </div>
          <input
            type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by username, songs .."
            style={{
              width: "100%", padding: "0.6rem 1.25rem 0.6rem 2.75rem", background: "transparent",
              border: "none", outline: "none", color: "var(--text-primary)", fontSize: "0.95rem", fontFamily: "inherit",
            }}
          />
        </div>

        {/* Categories (Dropdown Filters) */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
          
          {/* Genre Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", position: "relative" }} ref={genreRef}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Genre:</span>
            <button
              type="button"
              onClick={() => setShowGenreDropdown(!showGenreDropdown)}
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
              {genre}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {showGenreDropdown && (
              <div style={{
                position: "absolute",
                top: "100%",
                left: "3.5rem",
                marginTop: "0.5rem",
                background: "rgba(13,17,23,0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "0.75rem",
                padding: "0.4rem",
                zIndex: 100,
                minWidth: "160px",
                maxHeight: "300px",
                overflowY: "auto",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                backdropFilter: "blur(12px)"
              }}>
                {GENRES.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => { updateUrl({ genre: g, page: 1 }); setShowGenreDropdown(false); }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "0.5rem 0.75rem",
                      background: genre === g ? "rgba(99,102,241,0.15)" : "transparent",
                      border: "none",
                      borderRadius: "0.4rem",
                      color: genre === g ? "#a5b4fc" : "var(--text-primary)",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      marginBottom: "0.1rem"
                    }}
                    onMouseEnter={(e) => { if (genre !== g) e.currentTarget.style.background = "rgba(255,255,255,0.05)" }}
                    onMouseLeave={(e) => { if (genre !== g) e.currentTarget.style.background = "transparent" }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mood Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", position: "relative" }} ref={moodRef}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Mood:</span>
            <button
              type="button"
              onClick={() => setShowMoodDropdown(!showMoodDropdown)}
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
              {mood}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {showMoodDropdown && (
              <div style={{
                position: "absolute",
                top: "100%",
                left: "3.5rem",
                marginTop: "0.5rem",
                background: "rgba(13,17,23,0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "0.75rem",
                padding: "0.4rem",
                zIndex: 100,
                minWidth: "160px",
                maxHeight: "300px",
                overflowY: "auto",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                backdropFilter: "blur(12px)"
              }}>
                {MOODS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => { updateUrl({ mood: m, page: 1 }); setShowMoodDropdown(false); }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "0.5rem 0.75rem",
                      background: mood === m ? "rgba(45,212,191,0.15)" : "transparent",
                      border: "none",
                      borderRadius: "0.4rem",
                      color: mood === m ? "#2dd4bf" : "var(--text-primary)",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      marginBottom: "0.1rem"
                    }}
                    onMouseEnter={(e) => { if (mood !== m) e.currentTarget.style.background = "rgba(255,255,255,0.05)" }}
                    onMouseLeave={(e) => { if (mood !== m) e.currentTarget.style.background = "transparent" }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "8rem", color: "var(--text-muted)" }}>
          <div className="animate-spin" style={{ width: 40, height: 40, border: "3px solid rgba(255,255,255,0.1)", borderTopColor: "#6366f1", borderRadius: "50%", margin: "0 auto 1.5rem" }}></div>
          Loading community songs...
        </div>
      ) : songs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "6rem 2rem", background: "rgba(255,255,255,0.02)", borderRadius: "1.5rem", border: "1px dashed rgba(255,255,255,0.1)" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "2rem" }}>🎵</div>
          <p style={{ fontSize: "1rem", color: "var(--text-muted)" }}>
            No songs found matching your filters. Try something else!
          </p>
          <button onClick={() => router.push(pathname)} style={{ marginTop: "1rem", color: "#6366f1", background: "none", border: "none", fontWeight: 600, cursor: "pointer" }}>Clear All Filters</button>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {songs.map((song) => (
              <div key={song.songId}>
                {song.songUrl && (
                  <WavePlayer
                    src={song.songUrl}
                    title={song.songTitle}
                    artist={`@${song.username}`}
                    genre={song.genre ?? undefined}
                    duration={`${song.duration}s`}
                    accent={song.genre === "Lo-fi" ? "#a855f7" : song.genre === "Hip-Hop" ? "#2dd4bf" : "#6366f1"}
                    titleHref={`/song/${song.songId}`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1.5rem", marginTop: "4rem" }}>
              <button
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
                style={{
                  padding: "0.6rem 1.25rem", borderRadius: "0.75rem", border: "1px solid rgba(255,255,255,0.1)",
                  background: page <= 1 ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)",
                  color: page <= 1 ? "var(--text-muted)" : "var(--text-primary)",
                  cursor: page <= 1 ? "not-allowed" : "pointer", fontWeight: 600, fontSize: "0.85rem", transition: "all 200ms ease"
                }}
              >
                ← Previous
              </button>
              
              <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 600 }}>
                Page <span style={{ color: "var(--text-primary)" }}>{page}</span> of {totalPages}
              </div>

              <button
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
                style={{
                  padding: "0.6rem 1.25rem", borderRadius: "0.75rem", border: "1px solid rgba(255,255,255,0.1)",
                  background: page >= totalPages ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)",
                  color: page >= totalPages ? "var(--text-muted)" : "var(--text-primary)",
                  cursor: page >= totalPages ? "not-allowed" : "pointer", fontWeight: 600, fontSize: "0.85rem", transition: "all 200ms ease"
                }}
              >
                Next →
              </button>
            </div>
          )}
          
          <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Showing {songs.length} of {total} community songs
          </p>
        </>
      )}
    </div>
  );
}

export function ExploreClient() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "8rem", color: "var(--text-muted)" }}>Loading community gallery...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
