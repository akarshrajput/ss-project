import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { ExploreClient } from "@/components/explore/explore-client";

export const metadata: Metadata = buildMetadata({
  title: "Explore AI Songs — Community Creations | Songify",
  description:
    "Browse songs created by the Songify community. Search by username, listen to AI-generated tracks, and discover unique music created from text prompts.",
  path: "/explore",
  keywords: ["ai songs", "explore music", "ai generated songs", "songify community"],
});

export default function ExplorePage() {
  return (
    <main className="site-container w-full flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div style={{ width: "100%" }}>
        {/* Header */}
        <div style={{ marginBottom: "1rem" }}>
          <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "2.25rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.15 }}>
            Explore <span className="gradient-text">AI Songs</span>
          </h1>
          <p style={{ marginTop: "0.5rem", fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 560 }}>
            Discover songs created by our community.
          </p>
        </div>

        <ExploreClient />
      </div>
    </main>
  );
}
