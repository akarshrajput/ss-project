import { Suspense } from "react";
import { StudioClient } from "@/components/studio/studio-client";
import type { Metadata } from "next";
import { getComfyUiOnline } from "@/lib/app-store";
import { buildMetadata } from "@/lib/seo";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildMetadata({
  title: "AI Song Studio — Text to Music Creation",
  description:
    "Generate AI songs from lyrics, stories, and mood prompts. Songify Studio supports tone controls, vocal options, and production-ready outputs.",
  path: "/studio",
});

export default async function StudioPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const comfyUiOnline = await getComfyUiOnline();

  return (
    <main className="site-container w-full flex-1 px-4 py-8 sm:px-6 lg:px-8">
      {!comfyUiOnline && (
        <div style={{ marginBottom: "1.25rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.6rem",
            fontSize: "0.8rem", color: "#a5b4fc",
            background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: "999px", padding: "0.4rem 1rem",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", display: "inline-block" }} />
            Studio coming soon — sign up to be notified
          </div>
        </div>
      )}
      <Suspense fallback={
        <div style={{ padding: "4rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
          Loading studio…
        </div>
      }>
        <StudioClient isAuthenticated={Boolean(user)} />
      </Suspense>
    </main>
  );
}

