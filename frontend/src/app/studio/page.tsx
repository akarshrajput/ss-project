import { Suspense } from "react";
import { StudioClient } from "@/components/studio/studio-client";
import type { Metadata } from "next";
import { getComfyUiOnline } from "@/lib/app-store";
import { buildMetadata } from "@/lib/seo";
import { createOptionalSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildMetadata({
  title: "AI Song Studio — Text to Music Creation",
  description:
    "Generate AI songs from lyrics, stories, and mood prompts. Songify Studio supports tone controls, vocal options, and production-ready outputs.",
  path: "/studio",
});

export default async function StudioPage() {
  const supabase = await createOptionalSupabaseServerClient();
  const user = supabase
    ? (await supabase.auth.getUser()).data.user
    : null;
  const comfyUiOnline = await getComfyUiOnline();

  return (
    <main className="site-container w-full flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div style={{ maxWidth: 760, marginBottom: "1.25rem" }}>
        <p className="section-eyebrow mb-3">Studio</p>
        <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.15 }}>
          Create and refine audio from one workspace
        </h1>
        <p style={{ marginTop: "0.85rem", fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
          The Studio is the operational center of Songify. It keeps generation, preview, and iteration in one place so users can move from prompt to output without bouncing across unrelated pages.
        </p>
      </div>
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

      <section style={{ maxWidth: 760, marginTop: "2rem" }}>
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.65rem" }}>
            Before you generate
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
            Use the Studio when you are ready to test the product hands-on. For plan details, visit Pricing; for use-case context, see the Services pages. That structure gives the site a cleaner internal link map and helps visitors understand the product faster.
          </p>
        </div>
      </section>
    </main>
  );
}
