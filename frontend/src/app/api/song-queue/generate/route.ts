import { NextResponse } from "next/server";
import { getSongQueueById, markSongCompleted } from "@/lib/song-queue-store";
import { getComfyUiBaseUrl, getAppUserProfile } from "@/lib/app-store";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { persistRemoteAudioToSupabase } from "@/lib/audio-storage";

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

export async function POST(request: Request) {
  try {
    // Auth check
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
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

    if (entry.status === "completed" && entry.songUrl) {
      return NextResponse.json({
        success: true,
        alreadyCompleted: true,
        songUrl: entry.songUrl,
      });
    }

    const comfyUrl = await getComfyUiBaseUrl();

    // Build a simple workflow using the entry's data
    // Import the workflow builder
    const { buildTags, buildLyrics, buildWorkflow } = await import(
      "@/lib/song/prompt"
    );

    const seed = Math.floor(Math.random() * 999_999_999);

    const fakeInput = {
      basePrompt: entry.basePrompt || "",
      lyrics: entry.lyrics,
      lyricsMode: "use" as const,
      genre: entry.genre || "",
      moods: entry.mood ? [entry.mood] : [],
      scene: entry.theme,
      vocalType: entry.vocalType ? (entry.vocalType === "Children" ? "Children vocal" : entry.vocalType === "Male voice" ? "Male vocal" : "Female vocal") : "Female vocal",
      vocalStyles: [],
      language: "en",
      accent: "US",
      bpm: 90,
      energy: 50,
      keyScale: "G major",
      length: entry.duration,
      structure: "Verse+Chorus",
      complexity: 40,
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

    // Send to ComfyUI
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
      return NextResponse.json(
        {
          error: `ComfyUI prompt error (${promptResponse.status}): ${text.slice(0, 180)}`,
        },
        { status: 502 },
      );
    }

    const promptData = (await promptResponse.json()) as {
      prompt_id?: string;
    };
    if (!promptData.prompt_id) {
      return NextResponse.json(
        { error: "ComfyUI did not return prompt_id." },
        { status: 502 },
      );
    }

    // Wait for result
    const outputAudio = await waitForHistory(promptData.prompt_id, comfyUrl);
    const audioUrl = `${comfyUrl}/view?filename=${encodeURIComponent(outputAudio.filename)}&subfolder=${encodeURIComponent(outputAudio.subfolder ?? "")}&type=${encodeURIComponent(outputAudio.type)}`;
    const stableAudioUrl = await persistRemoteAudioToSupabase({
      supabase,
      sourceUrl: audioUrl,
      objectPath: `${user.id}/community-${entry.songId}-${Date.now()}.mp3`,
    });
    const finalAudioUrl = stableAudioUrl ?? audioUrl;

    // Mark as completed
    await markSongCompleted(body.id, finalAudioUrl);

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

    return NextResponse.json({ success: true, songUrl: finalAudioUrl });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
