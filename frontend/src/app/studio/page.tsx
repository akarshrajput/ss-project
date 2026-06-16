import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getUser } from "@/lib/auth";
import { getActiveSubscription } from "@/lib/subscription-store";
import { StudioPremiumClient } from "@/components/studio/studio-premium-client";

export const metadata: Metadata = buildMetadata({
  title: "Studio — Unlimited Song Creation",
  description: "Create unlimited AI songs with your active subscription.",
  path: "/studio",
  noIndex: true,
});

export default async function StudioPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login?next=/studio&plan=24h-unlimited");
  }

  const subscription = await getActiveSubscription(user.id);

  if (!subscription) {
    redirect("/payment?plan=24h-unlimited");
  }

  return (
    <main className="site-container w-full flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <StudioPremiumClient expiresAt={subscription.expiresAt.toISOString()} />
    </main>
  );
}
