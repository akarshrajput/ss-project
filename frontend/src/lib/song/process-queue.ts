/**
 * Shared queue-entry processing pipeline.
 *
 * Both the manual "Generate Now" button and the automated cron job call
 * this function so the behaviour is always identical.
 *
 * Flow:
 *   1. Build ComfyUI workflow from entry metadata
 *   2. Submit prompt to ComfyUI
 *   3. Poll ComfyUI /history until audio output appears (up to 3 min)
 *   4. Download audio and persist to Supabase Storage
 *   5. Mark the queue entry as "completed" in MongoDB
 *   6. Send email notification to the user
 *
 * Atomicity:
 *   - Steps 1–4 must all succeed for the entry to leave "pending" state.
 *   - Step 6 (email) is best-effort: failure is logged but does not
 *     revert the completion.
 */

import type { SongQueueEntry } from "@/lib/song-queue-store";
import { markSongCompleted } from "@/lib/song-queue-store";
import { persistRemoteAudioToS3 } from "@/lib/audio-storage";
import { buildTags, buildLyrics, buildWorkflow } from "@/lib/song/prompt";
import nodemailer from "nodemailer";

// ── Types ──────────────────────────────────────────────────────────

export type ProcessResult =
  | { success: true; songUrl: string; alreadyCompleted: boolean }
  | { success: false; error: string };

// ── ComfyUI history poller ─────────────────────────────────────────

async function waitForHistory(
  promptId: string,
  comfyUrl: string,
  timeoutMs = 180_000,
) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const historyResponse = await fetch(`${comfyUrl}/history/${promptId}`, {
      cache: "no-store",
    });

    if (historyResponse.ok) {
      const historyData = (await historyResponse.json()) as Record<
        string,
        unknown
      >;
      const promptEntry = historyData[promptId] as
        | {
            outputs?: {
              "107"?: {
                audio?: Array<{
                  filename: string;
                  subfolder?: string;
                  type: string;
                }>;
              };
            };
          }
        | undefined;

      const audio = promptEntry?.outputs?.["107"]?.audio?.[0];
      if (audio) {
        return audio;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 1_500));
  }

  throw new Error(
    "Generation timed out after waiting for ComfyUI history output.",
  );
}

// ── Email sender (direct, no HTTP round-trip) ──────────────────────

async function sendCompletionEmail(params: {
  email: string;
  username: string;
  songId: string;
  songTitle: string;
}) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.songify.fun";
  const songLink = `${siteUrl}/song/${params.songId}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; color: #334155; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: left;">
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px solid #e2e8f0; text-align: center;">
              <div style="font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">Songify</div>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px; font-size: 16px; font-weight: 600; color: #0f172a;">
                Hi @${params.username},
              </p>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #475569;">
                Your custom song request for <span style="font-weight: 600; color: #0f172a;">"${params.songTitle}"</span> has been successfully generated and is now available to stream or download.
              </p>
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding: 8px 0 32px;">
                    <a href="${songLink}" style="display: inline-block; padding: 14px 28px; background-color: #4f46e5; color: #ffffff; border-radius: 8px; font-size: 16px; font-weight: 600; text-decoration: none;">View Song Page</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0 0 8px; font-size: 14px; color: #64748b;">
                If the button above does not work, copy and paste this link:
              </p>
              <p style="margin: 0; font-size: 14px; word-break: break-all;">
                <a href="${songLink}" style="color: #4f46e5; text-decoration: underline;">${songLink}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 13px; line-height: 1.5; color: #64748b;">
                You are receiving this email because you requested a song generation on Songify.
              </p>
              <p style="margin: 0; font-size: 13px; color: #94a3b8;">
                &copy; ${new Date().getFullYear()} Songify. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    console.warn(
      "⚠️ GMAIL_USER or GMAIL_PASS not set. Email not sent for:",
      params.email,
    );
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Songify AI" <${process.env.GMAIL_USER}>`,
    to: params.email,
    subject: `🎵 Your Song "${params.songTitle}" is Ready! — Songify`,
    html,
  });

  console.log("✅ Email notification sent to:", params.email);
}

// ── Main processing function ───────────────────────────────────────

export async function processQueueEntry(
  entry: SongQueueEntry,
  comfyUrl: string,
  /** Used to build S3 object paths. Pass a userId or "cron". */
  uploaderPrefix: string,
): Promise<ProcessResult> {
  // Idempotency: skip if already completed
  if (entry.status === "completed" && entry.songUrl) {
    return { success: true, songUrl: entry.songUrl, alreadyCompleted: true };
  }

  const entryId = entry._id!.toString();

  // ── Step 1: Build workflow ─────────────────────────────────────
  const seed = Math.floor(Math.random() * 999_999_999);

  const professionalPrefix = "professional studio recording, radio-ready production, polished mix and master, high fidelity audio, rich instrumentation";
  const userBasePrompt = entry.basePrompt || "";
  const combinedBasePrompt = userBasePrompt
    ? `${professionalPrefix}, ${userBasePrompt}`
    : professionalPrefix;

  const fakeInput = {
    basePrompt: combinedBasePrompt,
    lyrics: entry.lyrics,
    lyricsMode: "use" as const,
    genre: entry.genre || "",
    moods: entry.mood ? [entry.mood] : [],
    scene: entry.theme,
    vocalType: entry.vocalType
      ? entry.vocalType === "Children"
        ? "Children vocal"
        : entry.vocalType === "Male voice"
          ? "Male vocal"
          : "Female vocal"
      : "Female vocal",
    vocalStyles: [],
    language: "en",
    accent: "US",
    bpm: 90,
    energy: 75,
    keyScale: "G major",
    length: entry.duration,
    structure: "Verse+Chorus",
    complexity: 70,
    seed,
    vibeLock: false,
    kidSafe: true,
    timeSignature: "4" as const,
  };

  const tags = buildTags(fakeInput);
  const lyrics = buildLyrics(fakeInput);
  const workflow = buildWorkflow({
    tags,
    lyrics,
    seed,
    duration: entry.duration,
    bpm: 90,
    language: "en",
    keyScale: "G major",
    timeSignature: "4",
  });

  // ── Step 2: Submit to ComfyUI ──────────────────────────────────
  const promptResponse = await fetch(`${comfyUrl}/prompt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: crypto.randomUUID(),
      prompt: workflow,
    }),
    cache: "no-store",
  });

  if (!promptResponse.ok) {
    const text = await promptResponse.text();
    throw new Error(
      `ComfyUI prompt error (${promptResponse.status}): ${text.slice(0, 180)}`,
    );
  }

  const promptData = (await promptResponse.json()) as {
    prompt_id?: string;
  };
  if (!promptData.prompt_id) {
    throw new Error("ComfyUI did not return prompt_id.");
  }

  // ── Step 3: Wait for generation output ─────────────────────────
  const outputAudio = await waitForHistory(promptData.prompt_id, comfyUrl);
  const audioUrl = `${comfyUrl}/view?filename=${encodeURIComponent(outputAudio.filename)}&subfolder=${encodeURIComponent(outputAudio.subfolder ?? "")}&type=${encodeURIComponent(outputAudio.type)}`;

  // ── Step 4: Persist audio to AWS S3 ────────────────────────────
  const stableAudioUrl = await persistRemoteAudioToS3({
    sourceUrl: audioUrl,
    objectPath: `${uploaderPrefix}/community-${entry.songId}-${Date.now()}.mp3`,
  });
  const finalAudioUrl = stableAudioUrl ?? audioUrl;

  // ── Step 5: Mark completed in MongoDB ──────────────────────────
  await markSongCompleted(entryId, finalAudioUrl);

  // ── Step 6: Send email (best-effort) ───────────────────────────
  try {
    await sendCompletionEmail({
      email: entry.email,
      username: entry.username,
      songId: entry.songId,
      songTitle: entry.songTitle,
    });
  } catch (emailErr) {
    console.error(
      `⚠️ Email failed for ${entry.email} (song ${entry.songId}):`,
      emailErr instanceof Error ? emailErr.message : emailErr,
    );
    // Email failure is non-blocking — song is already marked completed
  }

  return { success: true, songUrl: finalAudioUrl, alreadyCompleted: false };
}
