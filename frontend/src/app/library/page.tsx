import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { LibrarySongCard } from "@/components/ui/library-song-card";

export const metadata: Metadata = buildMetadata({
  title: "Audio Library",
  description: "Private Songify audio library for authenticated users.",
  path: "/library",
  noIndex: true,
});

type SongRow = {
  id: string;
  title: string | null;
  prompt_tags: string | null;
  genre: string | null;
  mood: string | null;
  audio_url: string | null;
  created_at: string;
};

export default async function LibraryPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("songs")
    .select("id,title,prompt_tags,genre,mood,audio_url,created_at")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(24);

  const songs = (data ?? []) as SongRow[];

  return (
    <main className="site-container w-full flex-1 px-4 py-12 sm:px-6 lg:px-8">

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <span className="badge badge-teal mb-3">Library</span>
          <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)" }}>
            Your Audio Library
          </h1>
          <p style={{ marginTop: "0.4rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            {songs.length} track{songs.length !== 1 ? "s" : ""} saved
          </p>
        </div>
        <Link href="/studio" className="btn-primary" style={{ textDecoration: "none" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Song
        </Link>
      </div>

      {error && (
        <div className="alert-warning mb-6">
          Could not load songs. Run the SQL migration in README and verify table policies.
        </div>
      )}

      {!error && songs.length === 0 && (
        <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="1.5">
              <path d="M9 18V5l12-2v13M9 18c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-2c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"/>
            </svg>
          </div>
          <p style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.4rem" }}>No songs yet</p>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>Create your first track in the Studio and it will appear here.</p>
          <Link href="/studio" className="btn-primary" style={{ textDecoration: "none" }}>Open Studio</Link>
        </div>
      )}

      <section style={{ display: "grid", gap: "1.25rem", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
        {songs.map((song, i) => (
          <LibrarySongCard key={song.id} song={song} index={i} />
        ))}
      </section>
    </main>
  );
}

