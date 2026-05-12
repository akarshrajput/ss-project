import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata({
  title: "Contact — Text to Song Generator Support & Partnerships",
  description: "Contact Songify for text to song generator support, text to song AI partnership discussions, and text to song converter online free onboarding.",
  path: "/contact",
  keywords: [
    "text to song generator",
    "text to song",
    "text to song ai",
    "convert text to song",
  ],
});

const contacts = [
  { label: "General Support", value: "support@songify.fun", icon: "💬", desc: "For product questions, bug reports, and help with your account." },
  { label: "Sales & Partnerships", value: "sales@songify.fun", icon: "🤝", desc: "For enterprise plans, API access, and custom integration discussions." },
  { label: "Response Window", value: "Mon – Fri, within 24h", icon: "⏱️", desc: "Our team is available on weekdays and responds within one business day." },
];

export default function ContactPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ]);

  return (
    <main className="site-container w-full flex-1 flex-col px-4 py-16 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbSchema} />

      <div style={{ maxWidth: 600, marginBottom: "3rem" }}>
        <p className="section-eyebrow mb-3">Contact</p>
        <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "2.5rem", fontWeight: 700, color: "var(--text-primary)" }}>
          Get in touch
        </h1>
        <p style={{ marginTop: "0.75rem", fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
          For support, partnerships, or enterprise deployment planning — reach out and our team will get back to you.
        </p>
        <p style={{ marginTop: "0.85rem", fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.75 }}>
          Please include your use case, timeline, and any workflow constraints in the first message. That helps us route the request faster and keeps the response specific instead of generic.
        </p>
      </div>

      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", maxWidth: 860 }}>
        {contacts.map((c) => (
          <div key={c.label} className="glass-card" style={{ padding: "1.5rem" }}>
            <span style={{ fontSize: "1.6rem", display: "block", marginBottom: "0.75rem" }}>{c.icon}</span>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.4rem" }}>
              {c.label}
            </p>
            <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
              {c.value}
            </p>
            <p style={{ fontSize: "0.83rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {c.desc}
            </p>
          </div>
        ))}
      </div>

      <section style={{ maxWidth: 860, marginTop: "2.25rem" }}>
        <div className="glass-card" style={{ padding: "1.75rem" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.65rem" }}>
            What to include in a message
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
            If you are contacting us about a rollout, mention the number of users, the type of audio you want to create, and whether you need a public plan page or custom deployment help. That makes the conversation more useful for both sides.
          </p>
        </div>
      </section>

      {/* SEO Content: FAQ Section */}
      <section style={{ maxWidth: 860, marginTop: "2.25rem" }}>
        <div className="glass-card" style={{ padding: "1.75rem" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "1.25rem" }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                How long does it take to get a response?
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                Our team typically responds within 24 hours on business days (Monday through Friday). If you contact us over the weekend, we will get back to you on Monday.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                Do you offer phone support?
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                Currently, we only offer support via email and our ticketing system. This allows us to keep a record of your request and provide more accurate and detailed assistance.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                Can I request a custom feature?
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                Yes, we value user feedback! If you have an idea for a feature that would improve your workflow, please send it to support@songify.fun. While we cannot guarantee all requests will be implemented, we review every suggestion.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                Where can I find documentation?
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                We are actively working on a comprehensive documentation site. In the meantime, you can find helpful tips and guides on our blog or by asking our support team directly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
