import { NextResponse } from "next/server";
import {
  createSongQueueEntry,
  listSongQueue,
  getSongQueueCount,
  markSongCompleted,
  getSongQueueById,
  getSongQueueByEmail,
  isUsernameAvailable,
  SongQueueStatus,
} from "@/lib/song-queue-store";
import { deriveUsernameFromEmail } from "@/lib/username-utils";
import { persistRemoteAudioToS3 } from "@/lib/audio-storage";
import { getUser } from "@/lib/auth";
import { getAppUserProfile } from "@/lib/app-store";
import { getActiveSubscription } from "@/lib/subscription-store";

// ─── POST — create new queue entry ────────────────────────────────
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      lyrics?: string;
      theme?: string;
      genre?: string;
      mood?: string;
      duration?: number;
      email?: string;
      username?: string;
      basePrompt?: string;
      vocalType?: string;
      source?: string;
    };

    const lyrics = (body.lyrics ?? "").trim();
    let email = (body.email ?? "").trim().toLowerCase();
    let username = (body.username ?? "").trim();

    if (!lyrics) {
      return NextResponse.json({ error: "Lyrics are required." }, { status: 400 });
    }

    if (body.source === "studio") {
      const user = await getUser();
      if (!user) {
        return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
      }

      const subscription = await getActiveSubscription(user.id);
      if (!subscription) {
        return NextResponse.json(
          { error: "An active subscription is required." },
          { status: 403 },
        );
      }

      email = user.email.trim().toLowerCase();
      username = deriveUsernameFromEmail(email);
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }
    if (!username || username.length < 3 || username.length > 30) {
      return NextResponse.json(
        { error: "Username must be 3-30 characters." },
        { status: 400 },
      );
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { error: "Username can only contain letters, numbers, and underscores." },
        { status: 400 },
      );
    }

    // Ensure we reuse the same username for this email if it already exists in the DB
    let finalUsername = username;
    const existing = await getSongQueueByEmail(email);
    if (existing) {
      finalUsername = existing.username;
    } else {
      // If client didn't send a username, derive one from email
      if (!finalUsername) finalUsername = deriveUsernameFromEmail(email);

      // If chosen username is not available, try suffixes, then random suffix
      if (!(await isUsernameAvailable(finalUsername))) {
        let found = false;
        for (let i = 1; i <= 8; i++) {
          const cand = `${finalUsername}_${i}`;
          if (await isUsernameAvailable(cand)) {
            finalUsername = cand;
            found = true;
            break;
          }
        }
        if (!found) {
          const randomSuffix = Math.random().toString(36).slice(2, 6);
          finalUsername = `${finalUsername}_${randomSuffix}`;
        }
      }
    }

    const entry = await createSongQueueEntry({
      lyrics,
      theme: body.theme?.trim() || null,
      genre: body.genre?.trim() || null,
      mood: body.mood?.trim() || null,
      duration: body.duration && body.duration >= 10 && body.duration <= 180 ? body.duration : 30,
      email,
      username: finalUsername,
      basePrompt: body.basePrompt?.trim() || null,
      vocalType: body.vocalType?.trim() || null,
    });

    return NextResponse.json({ success: true, songId: entry.songId });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// ─── GET — list queue entries (admin) ─────────────────────────────
export async function GET(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }
    const profile = await getAppUserProfile(user.id);
    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }

    const url = new URL(request.url);
    const status = url.searchParams.get("status") as SongQueueStatus | null;
    const search = url.searchParams.get("search") || undefined;
    const sortBy = url.searchParams.get("sortBy") || "createdAt";
    const sortOrder = parseInt(url.searchParams.get("sortOrder") || "-1") as 1 | -1;
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");

    const entries = await listSongQueue({
      status: status ?? undefined,
      search,
      sortBy,
      sortOrder,
      page,
      limit,
    });

    const total = await getSongQueueCount({
      status: status ?? undefined,
      search,
    });

    // Serialize _id
    const serialized = entries.map((e) => ({
      ...e,
      _id: e._id?.toString(),
    }));

    return NextResponse.json({
      entries: serialized,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// ─── PATCH — mark as completed (admin) ────────────────────────────
export async function PATCH(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }
    const profile = await getAppUserProfile(user.id);
    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }

    const body = (await request.json()) as { id?: string; songUrl?: string };
    if (!body.id || !body.songUrl) {
      return NextResponse.json({ error: "id and songUrl are required." }, { status: 400 });
    }

    const entry = await getSongQueueById(body.id);
    if (!entry) {
      return NextResponse.json({ error: "Queue entry not found." }, { status: 404 });
    }

    const stableAudioUrl = await persistRemoteAudioToS3({
      sourceUrl: body.songUrl,
      objectPath: `community/${entry.songId}-${Date.now()}.mp3`,
    });

    await markSongCompleted(body.id, stableAudioUrl ?? body.songUrl);

    // Send email notification
    try {
      const origin = new URL(request.url).origin;
      await fetch(`${origin}/api/song-queue/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: entry.email,
          username: entry.username,
          songId: entry.songId,
          songTitle: entry.songTitle,
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
