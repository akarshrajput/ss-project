import { NextResponse } from "next/server";
import { z } from "zod";
import { buildLyrics, buildTags, buildWorkflow } from "@/lib/song/prompt";
import type { SongGenerateInput, SongGenerateResult } from "@/lib/song/types";
import { getComfyUiBaseUrl } from "@/lib/app-store";
import { getUser } from "@/lib/auth";
import { hasActiveSubscription } from "@/lib/subscription-store";
import { saveDirectSong } from "@/lib/song-queue-store";
import { persistRemoteAudioToStorage } from "@/lib/audio-storage";

const requestSchema: z.ZodType<SongGenerateInput> = z.object({
  basePrompt: z.string().min(5),
  lyrics: z.string(),
  lyricsMode: z.enum(["use", "story", "instrumental"]),
  genre: z.string().nullable(),
  moods: z.array(z.string()).max(2),
  scene: z.string().nullable(),
  vocalType: z.string().min(1),
  vocalStyles: z.array(z.string()),
  language: z.string().min(2),
  accent: z.string().min(1),
  bpm: z.number().min(40).max(220),
  energy: z.number().min(0).max(100),
  keyScale: z.string().min(1),
  length: z.number().min(10).max(180),
  structure: z.string().min(1),
  complexity: z.number().min(0).max(100),
  seed: z.number().int().min(0).max(999_999_999),
  vibeLock: z.boolean(),
  kidSafe: z.boolean(),
  timeSignature: z.enum(["3", "4", "6"]),
});

function randomInt() {
  return Math.floor(Math.random() * 999_999_999);
}

async function waitForHistory(promptId: string, comfyUrl: string, timeoutMs = 180_000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const historyResponse = await fetch(`${comfyUrl}/history/${promptId}`, {
      cache: "no-store",
    });

    if (historyResponse.ok) {
      const historyData = (await historyResponse.json()) as Record<string, unknown>;
      const promptEntry = historyData[promptId] as
        | {
          outputs?: {
            "107"?: {
              audio?: Array<{ filename: string; subfolder?: string; type: string }>;
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

  throw new Error("Generation timed out after waiting for ComfyUI history output.");
}

async function persistSongIfAuthenticated(params: {
  input: SongGenerateInput;
  audioUrl: string;
  tags: string;
}) {
  const user = await getUser();

  if (!user) {
    return undefined;
  }

  const objectPath = `${user.id}/${Date.now()}-${params.input.seed}.mp3`;
  const publicUrl = await persistRemoteAudioToStorage({
    sourceUrl: params.audioUrl,
    objectPath
  });

  if (!publicUrl) {
    return undefined;
  }

  const isPremium = await hasActiveSubscription(user.id);

  // Save to MongoDB instead of Supabase DB
  const username = user.email?.split("@")[0] || `user_${user.id.slice(0, 5)}`;

  await saveDirectSong({
    userId: user.id,
    email: user.email || "",
    username: username,
    lyrics: params.input.lyrics,
    genre: params.input.genre,
    mood: params.input.moods[0] ?? null,
    duration: params.input.length,
    audioUrl: publicUrl,
    promptTags: params.tags,
    isPremium
  });

  return publicUrl;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request payload" },
        { status: 400 },
      );
    }

    const input = parsed.data;
    const comfyUrl = await getComfyUiBaseUrl();
    const seed = input.vibeLock ? input.seed : randomInt();
    const normalizedInput = { ...input, seed };

    const tags = buildTags(normalizedInput);
    const lyrics = buildLyrics(normalizedInput);

    const workflow = buildWorkflow({
      tags,
      lyrics,
      seed,
      duration: normalizedInput.length,
      bpm: normalizedInput.bpm,
      language: normalizedInput.language,
      keyScale: normalizedInput.keyScale,
      timeSignature: normalizedInput.timeSignature,
    });

    const promptResponse = await fetch(`${comfyUrl}/prompt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: crypto.randomUUID(), prompt: workflow }),
      cache: "no-store",
    });

    if (!promptResponse.ok) {
      const text = await promptResponse.text();
      return NextResponse.json(
        { error: `ComfyUI prompt error (${promptResponse.status}): ${text.slice(0, 180)}` },
        { status: 502 },
      );
    }

    const promptData = (await promptResponse.json()) as { prompt_id?: string };
    if (!promptData.prompt_id) {
      return NextResponse.json({ error: "ComfyUI did not return prompt_id." }, { status: 502 });
    }

    const outputAudio = await waitForHistory(promptData.prompt_id, comfyUrl);
    const audioUrl = `${comfyUrl}/view?filename=${encodeURIComponent(outputAudio.filename)}&subfolder=${encodeURIComponent(outputAudio.subfolder ?? "")}&type=${encodeURIComponent(outputAudio.type)}`;

    const persistedAudioUrl = await persistSongIfAuthenticated({
      input: normalizedInput,
      audioUrl,
      tags,
    });

    const result: SongGenerateResult = {
      promptId: promptData.prompt_id,
      tags,
      audioUrl,
      persistedAudioUrl,
      seed,
    };

    return NextResponse.json(result);
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : "Unexpected server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
