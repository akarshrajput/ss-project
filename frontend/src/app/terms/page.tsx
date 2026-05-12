import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service — Text to Song Generator & Text to Song Converter",
  description: "Read Songify terms for text to song generator usage, text to song converter online free acceptable use, and text to song AI platform access conditions.",
  path: "/terms",
  keywords: [
    "text to song generator",
    "text to song",
    "text to song converter",
    "text to song ai",
  ],
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

        <div className="glass-card" style={{ padding: "1.75rem", marginTop: "1rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.65rem" }}>
            Acceptable use
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
            Songify should be used for lawful creative, product, and research work. We may restrict access if a workflow violates platform rules, attempts abuse, or creates unacceptable operational risk for other users.
          </p>
        </div>

        <div className="glass-card" style={{ padding: "1.75rem", marginTop: "1rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.65rem" }}>
            Service expectations
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
            Public product pages can evolve as the service matures. When a route is meant to be indexed, it should resolve directly and contain enough explanatory copy to be useful without relying on another page.
          </p>
        </div>

        {/* SEO Content: Additional Terms Sections */}
        <div className="glass-card" style={{ padding: "1.75rem", marginTop: "1rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.65rem" }}>
            User accounts
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the terms, which may result in immediate termination of your account on our service. You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
          </p>
        </div>

        <div className="glass-card" style={{ padding: "1.75rem", marginTop: "1rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.65rem" }}>
            Intellectual property
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
            The service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of Songify and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Songify.
          </p>
        </div>

        <div className="glass-card" style={{ padding: "1.75rem", marginTop: "1rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.65rem" }}>
            Limitation of liability
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
            In no event shall Songify, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
          </p>
        </div>
      </div>
    </main>
  );
}
