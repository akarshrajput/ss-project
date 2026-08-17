import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy — Text to Song Generator & Text to Song AI",
  description: "Review how Singify's text to song generator handles account data, generated text to song outputs, and text to song converter online free service analytics.",
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
              "Singify stores account and generated asset metadata required to deliver platform functionality and user libraries.",
              "We apply security controls to protect user data and only process operational data needed for service performance.",
              "For data access or deletion requests, contact privacy@singify.fun.",
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
            Depending on how you use Singify, we may process account details, generation prompts, saved outputs, and operational logs. We keep that scope limited to what is needed for product delivery, debugging, and library features.
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
            We use the information we collect to provide, maintain, and improve our services, including the Singify Studio. This includes processing your generation requests, managing your account, sending technical notices, and responding to your support requests. We may also use aggregated or de-identified information for research and analysis to enhance our AI models.
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
        <div className="glass-card" style={{ padding: "1.75rem", marginTop: "1rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.65rem" }}>
            Cookies and Tracking Technologies
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: "0.85rem" }}>
            Singify uses cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85 }}>
            We use session cookies to operate our service, preference cookies to remember your preferences and various settings, and security cookies for security purposes. We may also use third-party analytics tools to understand how our <strong style={{ color: "var(--text-primary)" }}>text to song generator</strong> is used so we can improve the experience for all users.
          </p>
        </div>

        <div className="glass-card" style={{ padding: "1.75rem", marginTop: "1rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.65rem" }}>
            Third-Party Services and Sharing
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: "0.85rem" }}>
            We do not sell, trade, or rent your personal information to third parties. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates, and advertisers for the purposes outlined above.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85 }}>
            We may use third-party service providers to help us operate our business, including our <strong style={{ color: "var(--text-primary)" }}>text to song AI</strong> infrastructure. These third parties have access to your personal data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose. All providers are vetted for compliance with applicable data protection laws.
          </p>
        </div>

        <div className="glass-card" style={{ padding: "1.75rem", marginTop: "1rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.65rem" }}>
            Children&apos;s Privacy
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: "0.85rem" }}>
            Our <strong style={{ color: "var(--text-primary)" }}>text to song converter online free</strong> service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us. If we become aware that we have collected personal data from children without verification of parental consent, we take steps to remove that information from our servers.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85 }}>
            Changes to this privacy policy will be communicated via our website. We encourage users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect. You acknowledge and agree that it is your responsibility to review this privacy policy periodically and become aware of modifications.
          </p>
        </div>
      </div>
    </main>
  );
}
