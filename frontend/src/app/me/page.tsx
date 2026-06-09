import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getActiveSubscription } from "@/lib/subscription-store";
import { MeClient } from "@/components/me/me-client";

export const metadata: Metadata = buildMetadata({
  title: "My Profile",
  description: "Manage your Songify account.",
  path: "/me",
  noIndex: true,
});

export default async function MePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const subscription = await getActiveSubscription(user.id);
  const isSubscribed = !!subscription;
  const expiresAt = subscription ? subscription.expiresAt.toISOString() : null;

  return (
    <main className="site-container w-full flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div style={{ maxWidth: 840, margin: "0 auto" }}>
        
        <div style={{ marginBottom: "2.5rem" }}>
          <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)" }}>
            My Profile
          </h1>
          <p style={{ marginTop: "0.5rem", fontSize: "0.95rem", color: "var(--text-secondary)" }}>
            Manage your account and subscription.
          </p>
        </div>

        <MeClient 
          email={user.email ?? ""} 
          isSubscribed={isSubscribed} 
          expiresAt={expiresAt} 
        />
      </div>
    </main>
  );
}
