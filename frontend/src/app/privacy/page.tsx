import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy — Text to Song Generator & Text to Song AI",
  description: "Review how Songify's text to song generator handles account data, generated text to song outputs, and text to song converter online free service analytics.",
  path: "/privacy",
  keywords: [
    "text to song generator",
    "text to song",
    "text to song ai",
    "text to song converter",
  ],
});

export default function PrivacyPage() {
  return (
    <main className="site-container w-full flex-1 flex-col px-4 py-16 sm:px-6 lg:px-8">
      <div style={{ maxWidth: 680 }}>
        <p className="section-eyebrow mb-3">Legal</p>
        <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "2.5rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "2rem" }}>
          Privacy Policy
        </h1>
        
        <div className="glass-card" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {[
              "Songify stores account and generated asset metadata required to deliver platform functionality and user libraries.",
              "We apply security controls to protect user data and only process operational data needed for service performance.",
              "For data access or deletion requests, contact privacy@songify.fun.",
            ].map((text, i) => (
              <p key={i} style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
                {text}
              </p>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ padding: "1.75rem", marginTop: "1rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.65rem" }}>
            Data handled in the product
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
            Depending on how you use Songify, we may process account details, generation prompts, saved outputs, and operational logs. We keep that scope limited to what is needed for product delivery, debugging, and library features.
          </p>
        </div>

        <div className="glass-card" style={{ padding: "1.75rem", marginTop: "1rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.65rem" }}>
            Your controls
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
            Users can request access, correction, or deletion of their data where applicable. If a future enterprise plan adds custom retention or audit requirements, those terms will be documented separately instead of implied here.
          </p>
        </div>

        {/* SEO Content: Additional Privacy Sections */}
        <div className="glass-card" style={{ padding: "1.75rem", marginTop: "1rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.65rem" }}>
            Information We Collect
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
            We collect information you provide directly to us, such as when you create an account, use the Studio, or communicate with us. This may include your name, email address, and any content you generate or upload (e.g., lyrics or text prompts). We also collect technical data automatically, including IP addresses, browser types, and usage statistics to improve our service.
          </p>
        </div>

        <div className="glass-card" style={{ padding: "1.75rem", marginTop: "1rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.65rem" }}>
            How We Use Your Information
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
            We use the information we collect to provide, maintain, and improve our services, including the Songify Studio. This includes processing your generation requests, managing your account, sending technical notices, and responding to your support requests. We may also use aggregated or de-identified information for research and analysis to enhance our AI models.
          </p>
        </div>

        <div className="glass-card" style={{ padding: "1.75rem", marginTop: "1rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.65rem" }}>
            Data Security
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
            We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. We use industry-standard encryption for data in transit and at rest. However, no method of transmission over the internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
          </p>
        </div>
      </div>
    </main>
  );
}
