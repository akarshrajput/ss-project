import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { getActiveSubscription } from "@/lib/subscription-store";
import { getComfyUiBaseUrl } from "@/lib/app-store";
import { createSongQueueEntry } from "@/lib/song-queue-store";
import { processQueueEntry } from "@/lib/song/process-queue";

/* ─── Types ─────────────────────────────────────────────────────── */
interface StudioGenerateBody {
  lyrics?: string;
  basePrompt?: string;
  vocalType?: string;
  duration?: number;
  genre?: string;
  mood?: string;
}

/* ─── POST — Premium studio direct generation ─────────────────── */
export async function POST(request: Request) {
  try {
    // 1. Authenticate user
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    // 2. Verify active subscription
    const subscription = await getActiveSubscription(user.id);
    if (!subscription) {
      return NextResponse.json(
        { error: "Active subscription required. Please purchase a plan." },
        { status: 403 },
      );
    }

    // 3. Parse body
    const body = (await request.json()) as StudioGenerateBody;
    const lyrics = (body.lyrics ?? "").trim();

    if (!lyrics) {
      return NextResponse.json({ error: "Lyrics are required." }, { status: 400 });
    }

    const duration =
      body.duration && body.duration >= 10 && body.duration <= 180 ? body.duration : 30;

    // 4. Derive username from authenticated user
    const email = user.email || "";
    const username = email.split("@")[0] || `user_${user.id.slice(0, 5)}`;

    // 5. Create a queue entry (status: pending) so we have a songId
    const entry = await createSongQueueEntry({
      lyrics,
      theme: null,
      genre: body.genre?.trim() || null,
      mood: body.mood?.trim() || null,
      duration,
      email,
      username,
      basePrompt: body.basePrompt?.trim() || null,
      vocalType: body.vocalType?.trim() || null,
    });

    // 6. Use the exact same processing pipeline as admin generate
    const comfyUrl = await getComfyUiBaseUrl();
    const result = await processQueueEntry(entry, comfyUrl, user.id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // 7. Return songId for redirect
    return NextResponse.json({
      success: true,
      songId: entry.songId,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unexpected server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
