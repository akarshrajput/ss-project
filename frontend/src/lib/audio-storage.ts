import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
}

export async function persistRemoteAudioToStorage(params: {
  sourceUrl: string;
  objectPath: string;
  bucketName?: string;
}): Promise<string | undefined> {
  const { sourceUrl, objectPath, bucketName = process.env.SUPABASE_BUCKET_NAME || "songs" } = params;

  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error(
        "Supabase credentials (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY or ANON_KEY) are not configured."
      );
      return undefined;
    }

    const audioResponse = await fetch(sourceUrl);
    if (!audioResponse.ok) {
      console.error(
        `Failed to fetch source audio from ${sourceUrl}: ${audioResponse.status} ${audioResponse.statusText}`
      );
      return undefined;
    }

    const audioBuffer = await audioResponse.arrayBuffer();
    const contentType = audioResponse.headers.get("content-type") ?? "audio/mpeg";

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(objectPath, Buffer.from(audioBuffer), {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase Storage upload error:", uploadError);
      return undefined;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(objectPath);

    return publicUrl;
  } catch (error) {
    console.error("Error persisting audio to Supabase Storage:", error);
    return undefined;
  }
}

// Aliases for backwards compatibility
export const persistRemoteAudioToSupabase = persistRemoteAudioToStorage;
export const persistRemoteAudioToS3 = persistRemoteAudioToStorage;
export const persistRemoteAudio = persistRemoteAudioToStorage;