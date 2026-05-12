import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Pricing — Free Text to Song Generator & Text to Song AI Plans",
  description:
    "Review Songify pricing for our text to song generator free tier, text to song converter online free, and professional text to song AI plans for creators and teams.",
  path: "/pricing",
  keywords: [
    "text to song generator free",
    "text to song free",
    "text to song ai free",
    "text to song converter online free",
    "text to song free online",
    "convert text to song",
  ],
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
          Songify keeps pricing straightforward: start with our <strong style={{ color: "var(--text-primary)" }}>text to song generator free</strong> tier, validate the workflow, and move into a paid plan only when your team needs saved output, repeatable sessions, or custom support. Our <strong style={{ color: "var(--text-primary)" }}>text to song free online</strong> experience lets you <strong style={{ color: "var(--text-primary)" }}>convert text to song</strong> without any commitment.
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
            A dedicated pricing page improves crawlability, lets us describe the product honestly, and gives partners a stable URL to reference. It also prevents search engines from seeing a redirect where a real content page should exist.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
            If you want to try the product now, the Studio remains the primary call to action. When plan details are finalized, this page can be expanded without changing the route or breaking existing links.
          </p>
        </div>
      </section>

      {/* SEO Content: Pricing FAQ Section */}
      <section style={{ maxWidth: 760, marginTop: "2rem" }}>
        <div className="glass-card" style={{ padding: "1.75rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "1.25rem" }}>
            Pricing Frequently Asked Questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                Is the Free plan really free?
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                Yes, our Free plan is completely free to use. You can access the Studio and generate songs without creating an account or entering credit card details. This allows you to test the platform and see if it fits your needs before committing to a paid tier.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                When will the Pro plan be available?
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                We are actively working on the Pro plan features, including file downloads and library storage. We expect to launch it in the coming months. Sign up for our newsletter to be notified when it goes live.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                What are the benefits of the Team plan?
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                The Team plan is designed for businesses and organizations that need a consistent AI audio workflow. It includes multi-user management, custom onboarding, and dedicated support to help you integrate Songify into your production pipeline.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                Do you offer refunds?
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                Since we offer a free tier to test the service, we generally do not offer refunds once a paid plan is active. However, if you experience technical issues or are dissatisfied, please contact our support team.
              </p>
            </div>
          </div>
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
