/**
 * Automated cron endpoint for processing the song generation queue.
 *
 * Called every hour by an external scheduler (Vercel Cron, cron-job.org, etc.).
 * Protected by a bearer token (`CRON_SECRET` env var).
 *
 * Flow:
 *   1. Validate bearer token
 *   2. Check if ComfyUI GPU server is online
 *   3. Fetch all pending queue entries (oldest first)
 *   4. Process each entry sequentially (generate → upload → complete → email)
 *   5. Log the run to MongoDB `cronLogs` collection
 *   6. Return a summary
 */

import { NextResponse } from "next/server";
import { getComfyUiBaseUrl, isComfyUiOnline } from "@/lib/app-store";
import { listSongQueue } from "@/lib/song-queue-store";
import { processQueueEntry } from "@/lib/song/process-queue";
import { getMongoDb } from "@/lib/mongodb";

// ── Types ──────────────────────────────────────────────────────────

type EntryResult = {
  songId: string;
  status: "success" | "failed" | "skipped";
  error?: string;
  durationMs: number;
};

type CronLogDoc = {
  triggeredAt: Date;
  completedAt: Date;
  comfyUiOnline: boolean;
  totalPending: number;
  processed: number;
  failed: number;
  skipped: number;
  results: EntryResult[];
};

// ── Helpers ────────────────────────────────────────────────────────

async function writeCronLog(log: CronLogDoc) {
  try {
    const db = await getMongoDb();
    await db.collection<CronLogDoc>("cronLogs").insertOne(log);
  } catch (err) {
    console.error("⚠️ Failed to write cron log:", err);
  }
}

function validateCronSecret(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("❌ CRON_SECRET env var is not configured.");
    return false;
  }

  // Support both "Authorization: Bearer <secret>" and Vercel's "x-cron-secret" header
  const authHeader = request.headers.get("authorization");
  const vercelCron = request.headers.get("x-cron-secret");

  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/i, "");
    return token === secret;
  }

  if (vercelCron) {
    return vercelCron === secret;
  }

  return false;
}

// ── GET /api/song-queue/cron ───────────────────────────────────────

export async function GET(request: Request) {
  const triggeredAt = new Date();

  // ── Auth ────────────────────────────────────────────────────────
  if (!validateCronSecret(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Provide a valid CRON_SECRET." },
      { status: 401 },
    );
  }

  // ── Check ComfyUI health ───────────────────────────────────────
  const comfyUrl = await getComfyUiBaseUrl();
  const online = await isComfyUiOnline(comfyUrl);

  if (!online) {
    const log: CronLogDoc = {
      triggeredAt,
      completedAt: new Date(),
      comfyUiOnline: false,
      totalPending: 0,
      processed: 0,
      failed: 0,
      skipped: 0,
      results: [],
    };
    await writeCronLog(log);

    console.log("⏭️ Cron: ComfyUI is offline. Skipping queue processing.");
    return NextResponse.json({
      skipped: true,
      reason: "ComfyUI server is offline or unreachable.",
      comfyUrl,
    });
  }

  // ── Fetch all pending entries ──────────────────────────────────
  const pendingEntries = await listSongQueue({
    status: "pending",
    sortBy: "createdAt",
    sortOrder: 1, // oldest first
    page: 1,
    limit: 500, // process up to 500 per run (safety cap)
  });

  if (pendingEntries.length === 0) {
    const log: CronLogDoc = {
      triggeredAt,
      completedAt: new Date(),
      comfyUiOnline: true,
      totalPending: 0,
      processed: 0,
      failed: 0,
      skipped: 0,
      results: [],
    };
    await writeCronLog(log);

    console.log("✅ Cron: No pending entries in queue.");
    return NextResponse.json({
      skipped: true,
      reason: "No pending songs in the queue.",
      comfyUiOnline: true,
    });
  }

  // ── Process entries sequentially ───────────────────────────────
  const results: EntryResult[] = [];
  let processed = 0;
  let failed = 0;
  let skipped = 0;

  console.log(
    `🚀 Cron: Starting queue processing. ${pendingEntries.length} pending entries.`,
  );

  for (const entry of pendingEntries) {
    const entryStart = Date.now();
    const songId = entry.songId;

    try {
      // Re-check ComfyUI health before each song (GPU might crash mid-run)
      const stillOnline = await isComfyUiOnline(comfyUrl);
      if (!stillOnline) {
        console.warn(
          `⚠️ Cron: ComfyUI went offline during processing. Stopping at song ${songId}.`,
        );
        results.push({
          songId,
          status: "skipped",
          error: "ComfyUI went offline during processing.",
          durationMs: Date.now() - entryStart,
        });
        skipped++;
        break; // Stop processing — GPU is gone
      }

      const result = await processQueueEntry(
        entry,
        comfyUrl,
        "cron",
      );

      if (result.success) {
        if (result.alreadyCompleted) {
          results.push({
            songId,
            status: "skipped",
            error: "Already completed.",
            durationMs: Date.now() - entryStart,
          });
          skipped++;
        } else {
          results.push({
            songId,
            status: "success",
            durationMs: Date.now() - entryStart,
          });
          processed++;
          console.log(`✅ Cron: Processed song ${songId} successfully.`);
        }
      } else {
        results.push({
          songId,
          status: "failed",
          error: result.error,
          durationMs: Date.now() - entryStart,
        });
        failed++;
        console.error(`❌ Cron: Failed to process song ${songId}:`, result.error);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      results.push({
        songId,
        status: "failed",
        error: errorMsg,
        durationMs: Date.now() - entryStart,
      });
      failed++;
      console.error(`❌ Cron: Exception for song ${songId}:`, errorMsg);

      // If it's a ComfyUI connection error, stop processing entirely
      if (
        errorMsg.includes("ComfyUI") ||
        errorMsg.includes("fetch") ||
        errorMsg.includes("ECONNREFUSED")
      ) {
        console.warn(
          "⚠️ Cron: ComfyUI appears down. Stopping queue processing.",
        );
        break;
      }
    }

    // Small pause between songs to avoid overloading ComfyUI
    await new Promise((r) => setTimeout(r, 1_000));
  }

  // ── Write cron log ─────────────────────────────────────────────
  const log: CronLogDoc = {
    triggeredAt,
    completedAt: new Date(),
    comfyUiOnline: true,
    totalPending: pendingEntries.length,
    processed,
    failed,
    skipped,
    results,
  };
  await writeCronLog(log);

  console.log(
    `🏁 Cron: Done. Processed: ${processed}, Failed: ${failed}, Skipped: ${skipped}`,
  );

  return NextResponse.json({
    success: true,
    totalPending: pendingEntries.length,
    processed,
    failed,
    skipped,
    results,
  });
}
