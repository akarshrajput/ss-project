import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Pricing",
  description:
    "Review Songify pricing, free access, and professional studio workflow options for creators, teams, and product use cases.",
  path: "/pricing",
});

const plans = [
  {
    name: "Free",
    price: "$0",
    summary: "Best for trying Songify and creating a first draft with no account friction.",
    features: ["Guest access to Studio", "Fast AI generation", "Browser playback"],
    accent: "#6366f1",
  },
  {
    name: "Pro",
    price: "Coming soon",
    summary: "For creators who need repeatable output, downloads, and a saved workflow.",
    features: ["Saved library", "Download-ready exports", "Priority queue for regular use"],
    accent: "#2dd4bf",
  },
  {
    name: "Team",
    price: "Custom",
    summary: "For internal teams evaluating a consistent AI audio workflow at scale.",
    features: ["Multi-user planning", "Custom onboarding", "Enterprise support"],
    accent: "#a855f7",
  },
];

export default function PricingPage() {
  return (
    <main className="site-container w-full flex-1 flex-col px-4 py-16 sm:px-6 lg:px-8">
      <div style={{ maxWidth: 720, marginBottom: "3rem" }}>
        <p className="section-eyebrow mb-3">Pricing</p>
        <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "2.5rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.15 }}>
          Simple pricing for AI song creation
        </h1>
        <p style={{ marginTop: "1rem", fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
          Songify keeps pricing straightforward: start free, validate the workflow, and move into a paid plan only when your team needs saved output, repeatable sessions, or custom support.
        </p>
        <p style={{ marginTop: "0.85rem", fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
          The current public experience focuses on the Studio so visitors can test generation immediately. This page keeps the pricing URL crawlable and gives search engines a clear canonical destination instead of a redirect chain.
        </p>
      </div>

      <section style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {plans.map((plan) => (
          <article key={plan.name} className="glass-card glass-card-glow" style={{ padding: "1.75rem", borderTop: `2px solid ${plan.accent}` }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: plan.accent, marginBottom: "0.5rem" }}>
              {plan.name}
            </p>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.6rem" }}>
              {plan.price}
            </h2>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "1rem" }}>
              {plan.summary}
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {plan.features.map((feature) => (
                <li key={feature} style={{ fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  • {feature}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section style={{ maxWidth: 760, marginTop: "3rem" }}>
        <div className="glass-card" style={{ padding: "1.75rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.75rem" }}>
            What this means for SEO and users
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "0.75rem" }}>
            A dedicated pricing page improves crawlability, lets us describe the product honestly, and gives partners a stable URL to reference. It also prevents semrush from seeing a redirect where a real content page should exist.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
            If you want to try the product now, the Studio remains the primary call to action. When plan details are finalized, this page can be expanded without changing the route or breaking existing links.
          </p>
        </div>
      </section>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "2rem" }}>
        <Link href="/studio" prefetch={false} className="btn-primary" style={{ textDecoration: "none" }}>
          Open Studio
        </Link>
        <Link href="/services" prefetch={false} className="btn-secondary" style={{ textDecoration: "none" }}>
          Explore Services
        </Link>
      </div>
    </main>
  );
}
