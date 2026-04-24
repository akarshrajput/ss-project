const missingEnvMessage =
  "Missing Supabase environment values. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.";

export function getSupabasePublicEnvOrNull() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

export function getSupabasePublicEnv() {
  const env = getSupabasePublicEnvOrNull();

  if (!env) {
    throw new Error(missingEnvMessage);
  }

  return env;
}
