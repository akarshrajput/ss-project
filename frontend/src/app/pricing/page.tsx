import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { AdsterraBanner } from "@/components/ads/adsterra-banner";

export const metadata: Metadata = buildMetadata({
  title: "Pricing — Free Text to Song Generator & Text to Song AI Plans",
  description:
    "Review Singify pricing for our text to song generator free tier, text to song converter online free, and professional text to song AI plans for creators and teams.",
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
    summary: "Best for trying Singify and creating a first draft with no account friction.",
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
          Singify keeps pricing straightforward: start with our <strong style={{ color: "var(--text-primary)" }}>text to song generator free</strong> tier, validate the workflow, and move into a paid plan only when your team needs saved output, repeatable sessions, or custom support. Our <strong style={{ color: "var(--text-primary)" }}>text to song free online</strong> experience lets you <strong style={{ color: "var(--text-primary)" }}>convert text to song</strong> without any commitment.
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

      {/* Responsive Leaderboard & Native Banners */}
      <AdsterraBanner type="responsive" className="mt-10" />
      <AdsterraBanner type="native" className="mt-4" />

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
                The Team plan is designed for businesses and organizations that need a consistent AI audio workflow. It includes multi-user management, custom onboarding, and dedicated support to help you integrate Singify into your production pipeline.
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
        <Link href="/" prefetch={false} className="btn-primary" style={{ textDecoration: "none" }}>
          Open Studio
        </Link>
        <Link href="/services" prefetch={false} className="btn-secondary" style={{ textDecoration: "none" }}>
          Explore Services
        </Link>
      </div>

      <section style={{ maxWidth: 760, marginTop: "2.5rem" }}>
        <div className="glass-card" style={{ padding: "1.75rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.85rem" }}>Why Start with the Free Tier?</h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: "0.85rem" }}>
            The free tier of our <strong style={{ color: "var(--text-primary)" }}>text to song generator free</strong> platform is not a limited demo — it is a full-featured entry point designed to let you experience the real quality of Singify before making any financial commitment. Guest access means you can generate your first track in under a minute with no account, no email, and no payment information required.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: "0.85rem" }}>
            We believe the best way to evaluate an AI audio tool is to actually use it. Reading about features or watching demo videos gives you an incomplete picture. When you <strong style={{ color: "var(--text-primary)" }}>convert text to song</strong> with your own creative input and hear the result in real time, you immediately understand whether the platform can serve your needs. That hands-on experience is why we keep the free tier genuinely useful, not artificially limited.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85 }}>
            For teams evaluating Singify for a production deployment, the free tier also gives you a quick way to test prompt strategies, explore genre coverage, and benchmark output quality before committing to a paid plan. Most teams make a go or no-go decision within a few hours of first use — which is exactly how we designed the evaluation experience.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 760, marginTop: "1.25rem" }}>
        <div className="glass-card" style={{ padding: "1.75rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.85rem" }}>What the Pro and Team Plans Will Include</h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: "0.85rem" }}>
            Our Pro plan is designed for individual creators who need repeatable, high-volume generation with permanent storage and download access. Key features will include unlimited generations per month, priority processing queue, cloud library with MP3 download, and advanced prompt controls including seed locking and style presets. The Pro plan will be the right choice for content creators, musicians, and developers building AI-powered audio applications.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: "0.85rem" }}>
            The Team plan is designed for businesses and organizations that need multi-user access, custom onboarding, and SLA-backed support. It will include everything in Pro, plus team management features, dedicated account support, custom prompt template libraries, and API access for programmatic generation. Enterprise teams using our <strong style={{ color: "var(--text-primary)" }}>text to song AI free</strong> platform at scale will benefit most from this tier.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85 }}>
            Both paid plans are in active development. We are taking a careful approach to ensure that when they launch, the features are polished, the pricing is fair, and the upgrade path from the free tier is seamless. Sign up for a free account today to be notified when paid plans become available — early registered users will receive a discount on their first subscription month.
          </p>
        </div>
      </section>
    </main>
  );
}
