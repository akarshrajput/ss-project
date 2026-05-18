import { NextResponse } from "next/server";
import { listCompletedSongs, countCompletedSongs } from "@/lib/song-queue-store";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") ?? undefined;
    const genre = url.searchParams.get("genre") ?? undefined;
    const mood = url.searchParams.get("mood") ?? undefined;
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");

    const [entries, total] = await Promise.all([
      listCompletedSongs({ search, genre, mood, page, limit }),
      countCompletedSongs({ search, genre, mood }),
    ]);

    // Serialize and strip email for privacy
    const serialized = entries.map((e) => ({
      songId: e.songId,
      songTitle: e.songTitle,
      username: e.username,
      genre: e.genre,
      mood: e.mood,
      theme: e.theme,
      duration: e.duration,
      songUrl: e.songUrl,
      completedAt: e.completedAt,
      createdAt: e.createdAt,
      lyrics: e.lyrics,
    }));

    return NextResponse.json({
      songs: serialized,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
