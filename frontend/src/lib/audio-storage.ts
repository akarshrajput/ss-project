export async function persistRemoteAudioToSupabase(params: {
  supabase: any;
  sourceUrl: string;
  objectPath: string;
  bucketName?: string;
}): Promise<string | undefined> {
  const { supabase, sourceUrl, objectPath, bucketName = "songs" } = params;

  const audioResponse = await fetch(sourceUrl);
  if (!audioResponse.ok) return undefined;

  const audioBuffer = await audioResponse.arrayBuffer();
  const contentType = audioResponse.headers.get("content-type") ?? "audio/mpeg";

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(objectPath, audioBuffer, { contentType, upsert: false });

  if (uploadError) {
    console.error("Supabase upload error:", uploadError);
    return undefined;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucketName).getPublicUrl(objectPath);

  return publicUrl;
}