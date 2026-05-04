import { NextResponse } from "next/server";
import { getSongQueueByEmail, isUsernameAvailable, createSongQueueEntry } from "@/lib/song-queue-store";
import { deriveUsernameFromEmail } from "@/lib/username-utils";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      songId?: string;
      lyrics?: string;
      theme?: string | null;
      genre?: string | null;
      mood?: string | null;
      duration?: number;
    };

    if (!body.email || !body.songId) {
      return NextResponse.json({ error: "Missing email or songId." }, { status: 400 });
    }

    const normalizedEmail = body.email.trim();

    // Check if email already exists to maintain same username
    let username: string;
    const existingEntry = await getSongQueueByEmail(normalizedEmail);
    
    if (existingEntry) {
      // Email exists - use the same username
      username = existingEntry.username;
    } else {
      // New email - derive username and check availability
      const baseUsername = deriveUsernameFromEmail(normalizedEmail);
      let resolvedUsername = baseUsername;
      
      // Try base username first
      if (!(await isUsernameAvailable(baseUsername))) {
        // Try with suffixes
        let found = false;
        for (let i = 1; i <= 8; i++) {
          const suffixedUsername = `${baseUsername}_${i}`;
          if (await isUsernameAvailable(suffixedUsername)) {
            resolvedUsername = suffixedUsername;
            found = true;
            break;
          }
        }
        
        // If still not found, use random 4-char suffix
        if (!found) {
          const randomSuffix = Math.random().toString(36).slice(2, 6);
          resolvedUsername = `${baseUsername}_${randomSuffix}`;
        }
      }
      
      username = resolvedUsername;
    }

    // Create the queue entry
    const entry = await createSongQueueEntry({
      lyrics: body.lyrics || "",
      theme: body.theme || null,
      genre: body.genre || null,
      mood: body.mood || null,
      duration: body.duration || 30,
      email: normalizedEmail,
      username,
      songId: body.songId,
    });

    return NextResponse.json({
      success: true,
      email: normalizedEmail,
      username,
      songId: entry.songId,
    });
  } catch (error) {
    console.error("Verification error:", error);
    const msg = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
