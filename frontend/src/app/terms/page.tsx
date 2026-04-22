import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description: "Read Songify terms for account usage, acceptable use, and platform access conditions.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <main className="site-container w-full flex-1 flex-col px-4 py-16 sm:px-6 lg:px-8">
      <div style={{ maxWidth: 680 }}>
        <p className="section-eyebrow mb-3">Legal</p>
        <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "2.5rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "2rem" }}>
          Terms of Service
        </h1>
        <div className="glass-card" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {[
              "By using Songify, you agree to platform usage rules, account security responsibilities, and lawful use of generated outputs.",
              "You are responsible for ensuring prompts and generated content comply with your jurisdiction and distribution requirements.",
              "For enterprise contracts and SLAs, contact our sales team for custom terms.",
            ].map((text, i) => (
              <p key={i} style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
                {text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
