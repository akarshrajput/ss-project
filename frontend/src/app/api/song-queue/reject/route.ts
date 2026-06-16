import { NextResponse } from "next/server";
import { getAppUserProfile } from "@/lib/app-store";
import { getUser } from "@/lib/auth";
import { getSongQueueById, markSongRejected } from "@/lib/song-queue-store";

export async function POST(request: Request) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const profile = await getAppUserProfile(user.id);
    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }

    const body = (await request.json()) as { id?: string; comment?: string };
    if (!body.id) {
      return NextResponse.json({ error: "Queue entry id is required." }, { status: 400 });
    }

    const entry = await getSongQueueById(body.id);
    if (!entry) {
      return NextResponse.json({ error: "Queue entry not found." }, { status: 404 });
    }

    if (entry.status === "completed") {
      return NextResponse.json(
        { error: "Completed songs cannot be rejected." },
        { status: 400 },
      );
    }

    await markSongRejected(body.id, body.comment);

    try {
      const origin = new URL(request.url).origin;
      await fetch(`${origin}/api/song-queue/send-rejection-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: entry.email,
          username: entry.username,
          songId: entry.songId,
          songTitle: entry.songTitle,
          genre: entry.genre,
          mood: entry.mood,
          duration: entry.duration,
          rejectionComment: body.comment?.trim() || null,
        }),
      });
    } catch {
      // Email failure shouldn't block the response
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
