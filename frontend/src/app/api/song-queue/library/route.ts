import { NextResponse } from "next/server";
import { listUserSongs, countUserSongs } from "@/lib/song-queue-store";
import { getUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getUser();
    if (!user || !user.email) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const url = new URL(request.url);
    const search = url.searchParams.get("search") ?? undefined;
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");

    const [entries, total] = await Promise.all([
      listUserSongs({ email: user.email, search, page, limit }),
      countUserSongs({ email: user.email, search }),
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
      isPremium: !!e.isPremium,
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
