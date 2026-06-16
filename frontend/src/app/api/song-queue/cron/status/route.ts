/**
 * GET /api/song-queue/cron/status
 *
 * Returns the latest cron run logs for the admin dashboard.
 * Requires admin authentication via session cookies.
 */

import { NextResponse } from "next/server";
import { getAppUserProfile, getComfyUiBaseUrl, isComfyUiOnline } from "@/lib/app-store";
import { getUser } from "@/lib/auth";
import { getMongoDb } from "@/lib/mongodb";
import { getSongQueueCount } from "@/lib/song-queue-store";

export async function GET() {
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

    // Fetch latest cron logs (last 10)
    const db = await getMongoDb();
    const logs = await db
      .collection("cronLogs")
      .find({})
      .sort({ triggeredAt: -1 })
      .limit(10)
      .toArray();

    // Get current ComfyUI status
    const comfyUrl = await getComfyUiBaseUrl();
    const comfyOnline = await isComfyUiOnline(comfyUrl);

    // Get current pending count
    const pendingCount = await getSongQueueCount({ status: "pending" });

    return NextResponse.json({
      comfyUrl,
      comfyOnline,
      pendingCount,
      logs: logs.map((l) => ({
        ...l,
        _id: l._id.toString(),
      })),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
