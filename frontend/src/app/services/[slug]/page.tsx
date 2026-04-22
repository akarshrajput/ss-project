import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { getServiceBySlug, servicePages } from "@/lib/services";
import { buildBreadcrumbSchema, buildFaqSchema, buildServiceSchema } from "@/lib/structured-data";

export function generateStaticParams() {
  return servicePages.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const service = getServiceBySlug(resolvedParams.slug);
  if (!service) {
    return buildMetadata({ title: "Service Not Found", description: "The requested Songify service page was not found.", path: `/services/${resolvedParams.slug}`, noIndex: true });
  }
  return buildMetadata({ title: service.title, description: service.description, path: `/services/${service.slug}` });
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const service = getServiceBySlug(resolvedParams.slug);
  if (!service) notFound();

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.name, path: `/services/${service.slug}` },
  ]);
  const serviceSchema = buildServiceSchema({ name: service.name, description: service.description, path: `/services/${service.slug}` });
  const faqSchema = buildFaqSchema(service.faqItems);

  return (
    <main className="site-container w-full flex-1 flex-col px-4 py-16 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />

      {/* Breadcrumb */}
      <nav style={{ display: "flex", gap: "0.5rem", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "2rem", alignItems: "center" }}>
        <Link href="/services" style={{ color: "var(--text-muted)", textDecoration: "none", transition: "color 150ms" }} className="hover:text-white">Services</Link>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
        <span style={{ color: "var(--text-secondary)" }}>{service.name}</span>
      </nav>

      {/* Header */}
      <div style={{ maxWidth: 680, marginBottom: "2.5rem" }}>
        <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "2.4rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.15 }}>
          {service.name}
        </h1>
        <p style={{ marginTop: "1rem", fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.75 }}>
          {service.intro}
        </p>
      </div>

      {/* Use cases */}
      <section className="glass-card" style={{ padding: "2rem", maxWidth: 740, marginBottom: "1.25rem" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "1.25rem" }}>
          Primary Use Cases
        </h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {service.useCases.map((item) => (
            <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.7rem", fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}>
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Workflow */}
      <section className="glass-card" style={{ padding: "2rem", maxWidth: 740, marginBottom: "1.25rem" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.75rem" }}>
          How teams use this in Songify
        </h2>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.75 }}>
          Start in Studio to set prompt direction, output style, and duration. Then generate and iterate until you
          reach the desired tone. Authenticated users can save final outputs to the Songify library and reuse
          successful settings across projects.
        </p>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 740, marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "1.25rem", marginTop: "0.5rem" }}>
          Common Questions
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {service.faqItems.map((item) => (
            <article key={item.question} className="glass-card" style={{ padding: "1.25rem" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                {item.question}
              </h3>
              <p style={{ fontSize: "0.83rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                {item.answer}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* CTAs */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
        <Link href="/studio" prefetch={false} className="btn-primary" style={{ textDecoration: "none" }}>Open Studio</Link>
        <Link href="/services" prefetch={false} className="btn-secondary" style={{ textDecoration: "none" }}>All Services</Link>
        <Link href="/pricing" prefetch={false} className="btn-secondary" style={{ textDecoration: "none" }}>Pricing</Link>
      </div>
    </main>
  );
}
