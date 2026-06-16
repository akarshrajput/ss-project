/**
 * POST /api/song-queue/cron/trigger
 *
 * Admin-only endpoint to manually trigger the cron queue processing.
 * Authenticates via session cookies (admin role required), then internally
 * calls the cron GET handler by passing the CRON_SECRET.
 */

import { NextResponse } from "next/server";
import { getAppUserProfile } from "@/lib/app-store";
import { getUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // Auth check — admin only
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }
    const profile = await getAppUserProfile(user.id);
    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }

    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) {
      return NextResponse.json(
        { error: "CRON_SECRET is not configured on the server." },
        { status: 500 },
      );
    }

    // Call the cron endpoint internally
    const origin = new URL(request.url).origin;
    const cronResponse = await fetch(`${origin}/api/song-queue/cron`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cronSecret}`,
      },
      cache: "no-store",
    });

    const result = await cronResponse.json();

    return NextResponse.json(result, { status: cronResponse.status });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
