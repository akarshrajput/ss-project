import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum | Legal Notice | Songify",
  description: "Legal notice and company information for Songify. Required by EU law.",
  robots: { index: true, follow: true },
};

export default function ImpressumPage() {
  return (
    <main className="site-container w-full flex-1 px-4 py-12 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '2.2rem', marginBottom: '2rem', color: 'var(--text-primary)' }}>
        Legal Notice
      </h1>
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Company Information</h2>
        <div style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.7 }}>
          NovaVision Consulting FZCO<br />
          Dubai Digital Park<br />
          Dubai Silicon Oasis<br />
          Dubai, UAE
        </div>
      </section>
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Contact</h2>
        <div style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.7 }}>
          Email: <a href="mailto:contact@Novavision-strategy.com" style={{ color: '#6366f1', textDecoration: 'underline' }}>contact@Novavision-strategy.com</a>
        </div>
      </section>
      <section>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Liability Notice</h2>
        <div style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.7 }}>
          Songify provides AI-powered song generation and audio production tools. All generated content is provided for creative and entertainment purposes. Use is at your own risk. We do not guarantee the copyright status, uniqueness, or accuracy of the generated audio tracks and lyrics.
        </div>
      </section>
    </main>
  );
}
