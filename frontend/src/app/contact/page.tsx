import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Contact Songify for product support, partnership discussions, and business onboarding.",
  path: "/contact",
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
    </main>
  );
}
