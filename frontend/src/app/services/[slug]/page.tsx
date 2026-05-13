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
  return buildMetadata({
    title: service.title,
    description: service.description,
    path: `/services/${service.slug}`,
    keywords: [
      "text to song generator",
      "text to song",
      "text to song ai",
      "text to song converter",
      "convert text to song",
      "text to song maker",
      "text to audio song",
    ],
  });
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
        <p style={{ marginTop: "0.85rem", fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.75 }}>
          This is part of the Songify <strong style={{ color: "var(--text-primary)" }}>text to song generator</strong> platform. Use our <strong style={{ color: "var(--text-primary)" }}>text to song converter online free</strong> tools to <strong style={{ color: "var(--text-primary)" }}>convert text to song</strong>, <strong style={{ color: "var(--text-primary)" }}>text to rap song</strong>, or <strong style={{ color: "var(--text-primary)" }}>text to audio song</strong> directly from the Studio.
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

      <section className="glass-card" style={{ padding: "2rem", maxWidth: 740, marginBottom: "1.25rem" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.75rem" }}>
          Practical fit
        </h2>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.75 }}>
          These service pages are meant to help a buyer, editor, or product owner understand when to use Songify. The content focuses on the output quality, the workflow, and the kind of project where the service makes the most sense.
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
        <Link href="/" prefetch={false} className="btn-primary" style={{ textDecoration: "none" }}>Open Studio</Link>
        <Link href="/services" prefetch={false} className="btn-secondary" style={{ textDecoration: "none" }}>All Services</Link>
        <Link href="/pricing" prefetch={false} className="btn-secondary" style={{ textDecoration: "none" }}>Pricing</Link>
      </div>

      <section style={{ maxWidth: 740, marginTop: "2.5rem" }}>
        <div className="glass-card" style={{ padding: "1.75rem" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.85rem" }}>Getting the Best Results from This Service</h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: "0.85rem" }}>
            The quality of AI-generated audio is directly related to the quality of your input. When using this service, be as specific as possible about the tone, mood, pace, and intended audience for your content. Instead of a vague prompt like &quot;make a song about summer,&quot; try something like &quot;upbeat pop song about a summer road trip with friends, energetic and nostalgic, 90s style guitars.&quot; The more context you provide, the better the output will match your vision.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: "0.85rem" }}>
            Iteration is a core part of the workflow. Do not expect the first generation to be perfect — use it as a starting point. Listen to the output, note what works and what doesn&apos;t, then adjust your prompt and regenerate. The Songify platform is designed for fast iteration cycles, so you can go from rough idea to polished output in just a few rounds of refinement.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85 }}>
            Once you find a generation you are happy with, save it to your library if you are logged in. This gives you a permanent reference point that you can compare against future generations, share with collaborators, or use as a benchmark for similar projects. Your library is your creative archive — and it grows more valuable the more you use it.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 740, marginTop: "1.25rem" }}>
        <div className="glass-card" style={{ padding: "1.75rem" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.85rem" }}>Integration with Your Existing Workflow</h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: "0.85rem" }}>
            Songify is designed to fit into your existing content production process, not replace it. The audio files you generate can be downloaded as MP3s and imported directly into video editors, DAWs, podcast software, or any other tool in your stack. We support standard audio formats that are compatible with all major platforms including Adobe Premiere, Final Cut Pro, GarageBand, Audacity, and DaVinci Resolve.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.85 }}>
            For teams with higher-volume needs, we offer API access and custom integration support through our enterprise plan. This allows you to trigger generation programmatically, integrate with content management systems, and build automated audio production pipelines. Contact our sales team to discuss how Songify can be embedded into your specific workflow at scale.
          </p>
        </div>
      </section>
    </main>
  );
}
