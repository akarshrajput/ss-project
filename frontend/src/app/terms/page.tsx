import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service — AI Song Generator | Singify",
  description: "Read Singify terms for text to song generator usage, text to song converter online free acceptable use, and text to song AI platform access conditions.",
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
              "By using Singify, you agree to platform usage rules, account security responsibilities, and lawful use of generated outputs.",
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
            Singify should be used for lawful creative, product, and research work. We may restrict access if a workflow violates platform rules, attempts abuse, or creates unacceptable operational risk for other users.
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
            The service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of Singify and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Singify.
          </p>
        </div>

        <div className="glass-card" style={{ padding: "1.75rem", marginTop: "1rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.65rem" }}>
            Limitation of liability
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
            In no event shall Singify, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
          </p>
        </div>
        <div className="glass-card" style={{ padding: "1.75rem", marginTop: "1rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.65rem" }}>
            Generated Content and Ownership
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: "0.85rem" }}>
            When you use our <strong style={{ color: "var(--text-primary)" }}>text to song generator</strong> to create audio content, you retain ownership of the creative inputs you provide — your lyrics, prompts, and textual ideas. The AI-generated audio output is provided to you for personal and commercial use, subject to the terms outlined here. You are responsible for ensuring that your use of generated content complies with applicable copyright laws in your jurisdiction.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85 }}>
            Singify does not claim ownership over the songs you create using our <strong style={{ color: "var(--text-primary)" }}>text to song AI</strong> platform. However, you acknowledge that AI-generated music may have similarities to existing works, and you should perform appropriate due diligence before using generated content commercially or distributing it publicly. We make no warranties regarding the originality or copyright status of generated outputs.
          </p>
        </div>

        <div className="glass-card" style={{ padding: "1.75rem", marginTop: "1rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.65rem" }}>
            Prohibited Uses
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: "0.85rem" }}>
            You may not use the Singify <strong style={{ color: "var(--text-primary)" }}>text to song converter</strong> for any unlawful purpose or in violation of any international, federal, provincial, or state regulations, rules, laws, or local ordinances. You may not use the service to generate content that is defamatory, obscene, abusive, harassing, or otherwise objectionable.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85 }}>
            Automated scraping, bot-based generation at scale without prior written permission, or attempts to reverse-engineer the AI model are prohibited. Violation of these terms may result in immediate suspension of your account and access to the platform, with or without prior notice.
          </p>
        </div>

        <div className="glass-card" style={{ padding: "1.75rem", marginTop: "1rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.65rem" }}>
            Changes to Terms and Governing Law
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: "0.85rem" }}>
            We reserve the right to modify these terms at any time. We will notify users of significant changes by posting the new terms on this page with an updated effective date. Your continued use of Singify after any changes constitutes your acceptance of the new terms. We encourage you to review these terms periodically for any updates or changes.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85 }}>
            These terms shall be governed and construed in accordance with the laws of the United Arab Emirates, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these terms will not be considered a waiver of those rights. If any provision of these terms is held to be invalid or unenforceable by a court, the remaining provisions of these terms will remain in effect.
          </p>
        </div>
      </div>
    </main>
  );
}
