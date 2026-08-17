"use client";

import { useRef, useEffect, useState, useCallback } from "react";

/* ─── Song data (same as original DemoSongs) ──────────────────────── */
const DEMO_SONGS = [
  {
    title: "Poem Song",
    genre: "Classical",
    mood: "Dreamy",
    vocalType: "Female voice",
    duration: "2 min",
    accent: "#6366f1",
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=600&auto=format&fit=crop",
    songLink: "https://wrehkhvdxnpqturqquqr.supabase.co/storage/v1/object/public/songs/0feb3a23-e20d-4678-82e5-907b816d8d21/community-mpc5jq39-lk7xtq-1779174226097.mp3",
    listenLink: "https://www.singify.fun/song/mpc5jq39-lk7xtq",
  },
  {
    title: "Funny Song",
    genre: "Pop",
    mood: "Happy",
    vocalType: "Male voice",
    duration: "60s",
    accent: "#2dd4bf",
    image: "/covers/cover_pop_1783050118926.png",
    songLink: "https://wrehkhvdxnpqturqquqr.supabase.co/storage/v1/object/public/songs/0feb3a23-e20d-4678-82e5-907b816d8d21/community-mpc5kgji-rv6kqx-1779174207335.mp3",
    listenLink: "https://www.singify.fun/song/mpc5kgji-rv6kqx",
  },
  {
    title: "Beats Song",
    genre: "Hip-Hop",
    mood: "Dark",
    vocalType: "Male voice",
    duration: "1 min",
    accent: "#a855f7",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop",
    songLink: "https://wrehkhvdxnpqturqquqr.supabase.co/storage/v1/object/public/songs/0feb3a23-e20d-4678-82e5-907b816d8d21/community-mpasbr6i-b7hgb1-1779083810845.mp3",
    listenLink: "https://www.singify.fun/song/mpasbr6i-b7hgb1",
  },
  {
    title: "Funk Song",
    genre: "Jazz",
    mood: "Upbeat",
    vocalType: "Female voice",
    duration: "2 min",
    accent: "#f59e0b",
    image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?q=80&w=600&auto=format&fit=crop",
    songLink: "https://wrehkhvdxnpqturqquqr.supabase.co/storage/v1/object/public/songs/0feb3a23-e20d-4678-82e5-907b816d8d21/community-mpc5odd5-kjjqpw-1779174189408.mp3",
    listenLink: "https://www.singify.fun/song/mpc5odd5-kjjqpw",
  },
  {
    title: "Lyrics Song",
    genre: "Folk",
    mood: "Melancholic",
    vocalType: "Male voice",
    duration: "2 min",
    accent: "#06b6d4",
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=600&auto=format&fit=crop",
    songLink: "https://wrehkhvdxnpqturqquqr.supabase.co/storage/v1/object/public/songs/0feb3a23-e20d-4678-82e5-907b816d8d21/community-mpasczu3-c5atxz-1779083777473.mp3",
    listenLink: "https://www.singify.fun/song/mpasczu3-c5atxz",
  },
  {
    title: "Sad Song",
    genre: "R&B",
    mood: "Sad",
    vocalType: "Female voice",
    duration: "2 min",
    accent: "#ef4444",
    image: "https://images.unsplash.com/photo-1493225457124-a1a2a4af3049?q=80&w=600&auto=format&fit=crop",
    songLink: "https://wrehkhvdxnpqturqquqr.supabase.co/storage/v1/object/public/songs/0feb3a23-e20d-4678-82e5-907b816d8d21/community-mpc5qk54-f60ctn-1779172801317.mp3",
    listenLink: "https://www.singify.fun/song/mpc5qk54-f60ctn",
  },
  {
    title: "Motivational Song",
    genre: "Rock",
    mood: "Energetic",
    vocalType: "Male voice",
    duration: "2 min",
    accent: "#22c55e",
    image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=600&auto=format&fit=crop",
    songLink: "https://wrehkhvdxnpqturqquqr.supabase.co/storage/v1/object/public/songs/0feb3a23-e20d-4678-82e5-907b816d8d21/community-mpc5s2kw-nyvjyf-1779172780200.mp3",
    listenLink: "https://www.singify.fun/song/mpc5s2kw-nyvjyf",
  },
  {
    title: "Horror Song",
    genre: "EDM",
    mood: "Dark",
    vocalType: "Female voice",
    duration: "2 min",
    accent: "#e879f9",
    image: "/covers/cover_edm_1783050133906.png",
    songLink: "https://wrehkhvdxnpqturqquqr.supabase.co/storage/v1/object/public/songs/0feb3a23-e20d-4678-82e5-907b816d8d21/community-mpasf1n2-er2gui-1779083727318.mp3",
    listenLink: "https://www.singify.fun/song/mpc5vcps-cadck1",
  },
  {
    title: "Anime Opening",
    genre: "Rock",
    mood: "Energetic",
    vocalType: "Children",
    duration: "1 min",
    accent: "#fb7185",
    image: "/covers/cover_anime_1783050143882.png",
    songLink: "https://wrehkhvdxnpqturqquqr.supabase.co/storage/v1/object/public/songs/0feb3a23-e20d-4678-82e5-907b816d8d21/community-mpasg4qa-mfjqva-1779083714673.mp3",
    listenLink: "https://www.singify.fun/song/mpasg4qa-mfjqva",
  },
  {
    title: "Travel Song",
    genre: "Folk",
    mood: "Calm",
    vocalType: "Male voice",
    duration: "1 min",
    accent: "#14b8a6",
    image: "/covers/cover_travel_1783050152979.png",
    songLink: "https://wrehkhvdxnpqturqquqr.supabase.co/storage/v1/object/public/songs/0feb3a23-e20d-4678-82e5-907b816d8d21/community-mpash5vx-jh100c-1779083699270.mp3",
    listenLink: "https://www.singify.fun/song/mpash5vx-jh100c",
  },
];

/* ─── Gradient covers keyed by accent ─────────────────────────────── */
const COVERS: Record<string, { bg: string }> = {
  "#6366f1": { bg: "linear-gradient(160deg, #111827, #1e1b4b)" }, // subtle indigo
  "#2dd4bf": { bg: "linear-gradient(160deg, #111827, #064e3b)" }, // subtle teal
  "#a855f7": { bg: "linear-gradient(160deg, #111827, #3b0764)" }, // subtle purple
  "#f59e0b": { bg: "linear-gradient(160deg, #111827, #451a03)" }, // subtle amber
  "#06b6d4": { bg: "linear-gradient(160deg, #111827, #083344)" }, // subtle cyan
  "#ef4444": { bg: "linear-gradient(160deg, #111827, #450a0a)" }, // subtle red
  "#22c55e": { bg: "linear-gradient(160deg, #111827, #052e16)" }, // subtle green
  "#e879f9": { bg: "linear-gradient(160deg, #111827, #4a044e)" }, // subtle pink
  "#fb7185": { bg: "linear-gradient(160deg, #111827, #4c0519)" }, // subtle rose
  "#14b8a6": { bg: "linear-gradient(160deg, #111827, #0f3d3e)" }, // subtle emerald
};

function formatPlays(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}

/* ─── Component ────────────────────────────────────────────────────── */
export function DemoSongsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Generate stable "fake" stats per song (seeded from title length)
  const stats = DEMO_SONGS.map((s) => {
    const seed = s.title.length * 31 + s.genre.length * 17;
    return {
      plays: 150_000 + ((seed * 2347) % 400_000),
      likes: 10_000 + ((seed * 1231) % 40_000),
    };
  });

  // Infinite scroll animation
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let raf: number;
    let pos = 0;
    const speed = 0.4; // px per frame

    let isPaused = false;
    let scrollTimeout: ReturnType<typeof setTimeout>;

    const step = () => {
      if (!isPaused) {
        pos += speed;
        // When we've scrolled past the first set, reset seamlessly
        const halfWidth = el.scrollWidth / 2;
        if (pos >= halfWidth) pos -= halfWidth;
        else if (pos < 0) pos += halfWidth; // Handle manual scroll left
        
        el.scrollLeft = pos;
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);

    const pauseHover = () => { isPaused = true; };
    const resumeHover = () => {
      pos = el.scrollLeft; // Sync before resuming
      isPaused = false;
    };

    const onScroll = () => {
      // Ignore scroll events generated by our auto-scroll script
      if (!isPaused && Math.abs(el.scrollLeft - pos) <= 2) {
        return;
      }
      // User is scrolling manually (or momentum scroll)
      isPaused = true;
      pos = el.scrollLeft;
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isPaused = false;
      }, 150); // Resume shortly after native scrolling stops completely
    };

    el.addEventListener("mouseenter", pauseHover);
    el.addEventListener("mouseleave", resumeHover);
    el.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(scrollTimeout);
      el.removeEventListener("mouseenter", pauseHover);
      el.removeEventListener("mouseleave", resumeHover);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  const togglePlay = useCallback((idx: number, songLink: string) => {
    if (playingIdx === idx) {
      audioRef.current?.pause();
      setPlayingIdx(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(songLink);
    audio.volume = 0.7;
    audio.play().catch(() => {});
    audio.onended = () => setPlayingIdx(null);
    audioRef.current = audio;
    setPlayingIdx(idx);
  }, [playingIdx]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => { audioRef.current?.pause(); };
  }, []);

  // Duplicate songs for seamless loop
  const allCards = [...DEMO_SONGS, ...DEMO_SONGS];
  const allStats = [...stats, ...stats];

  return (
    <section className="w-full pt-16" aria-labelledby="demo-carousel-heading">
      <div className="site-container px-4 sm:px-6 lg:px-8 text-center mb-10">
        <h2
          id="demo-carousel-heading"
          className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
          style={{ fontFamily: '"Space Grotesk", sans-serif', color: "var(--text-primary)" }}
        >
          Experience the Magic of AI Music
        </h2>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>
          Listen to amazing tracks generated by our community. From poetic melodies to upbeat pop, discover what you can create.
        </p>
      </div>

      {/* Full-width scrolling track */}
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: "0.75rem",
          overflowX: "auto",
          padding: "0 0 1rem",
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
          cursor: "grab",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="demo-carousel-scroll"
      >
        {allCards.map((song, i) => {
          const cover = COVERS[song.accent] ?? { bg: `linear-gradient(160deg, #111827, #1e293b)` };
          const s = allStats[i];
          const realIdx = i % DEMO_SONGS.length;
          const isPlaying = playingIdx === realIdx;

          return (
            <div
              className="group"
              key={`${song.title}-${i}`}
              style={{
                flex: "0 0 calc((100vw - 3rem) / 5)",
                minWidth: "calc((100vw - 3rem) / 5)",
                borderRadius: "0.75rem",
                background: "rgba(17, 24, 39, 0.4)",
                border: "1px solid rgba(255,255,255,0.05)",
                cursor: "pointer",
                overflow: "hidden",
              }}
            >
              {/* Cover art image */}
              <div
                onClick={() => togglePlay(realIdx, song.songLink)}
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "1 / 1",
                  backgroundColor: cover.bg,
                  backgroundImage: `url(${song.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {/* Dark overlay when not playing to make it feel cohesive */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: isPlaying ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.4)",
                  transition: "background-color 300ms ease",
                }} />

                {/* Play button */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: isPlaying ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    backdropFilter: "blur(4px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 150ms ease",
                  }}
                >
                  {isPlaying ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.9)">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.9)" style={{ marginLeft: 2 }}>
                      <polygon points="6 3 20 12 6 21 6 3" />
                    </svg>
                  )}
                </div>

                {/* Stats overlay at bottom of cover */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: "0.6rem",
                    padding: "0.5rem 0.65rem",
                    background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "0.7rem", color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    {formatPlays(s.plays)}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "0.7rem", color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                    {formatPlays(s.likes)}
                  </span>
                </div>
              </div>

              {/* Song info below cover */}
              <div style={{ padding: "0.8rem 0.8rem 1rem", textAlign: "left" }}>
                <p
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {song.title}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.4rem" }}>
                  <span
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--text-muted)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {song.genre} · {song.mood}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .demo-carousel-scroll::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}
