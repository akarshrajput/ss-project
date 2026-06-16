import { NextResponse } from "next/server";
import { getSongQueueById } from "@/lib/song-queue-store";
import { getComfyUiBaseUrl, getAppUserProfile } from "@/lib/app-store";
import { getUser } from "@/lib/auth";
import { processQueueEntry } from "@/lib/song/process-queue";

export async function POST(request: Request) {
  try {
    // Auth check
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 },
      );
    }
    const profile = await getAppUserProfile(user.id);
    if (profile?.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required." },
        { status: 403 },
      );
    }

    const body = (await request.json()) as { id?: string };
    if (!body.id) {
      return NextResponse.json(
        { error: "Queue entry id is required." },
        { status: 400 },
      );
    }

    const entry = await getSongQueueById(body.id);
    if (!entry) {
      return NextResponse.json(
        { error: "Queue entry not found." },
        { status: 404 },
      );
    }

    const comfyUrl = await getComfyUiBaseUrl();

    // Use the shared processing pipeline — identical logic for manual and cron
    const result = await processQueueEntry(
      entry,
      comfyUrl,
      user.id,
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        alreadyCompleted: result.alreadyCompleted,
        songUrl: result.songUrl,
      });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
