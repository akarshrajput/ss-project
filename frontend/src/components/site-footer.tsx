import Link from "next/link";

const footerLinks = [
  {
    title: "Product",
    items: [
      { href: "/studio", label: "Studio" },
      { href: "/services", label: "Services" },
      { href: "/features", label: "Features" },
    ],
  },
  {
    title: "Company",
    items: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Legal",
    items: [
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(6,8,16,0.9)", marginTop: "5rem" }}>
      <div className="site-container grid gap-10 px-4 py-14 sm:px-6 lg:px-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>

        {/* Brand col */}
        <div className="col-span-full lg:col-span-1" style={{ gridColumn: "1 / span 1" }}>
          <Link href="/" className="flex items-center gap-2.5 mb-4" style={{ textDecoration: "none" }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: "linear-gradient(135deg, #6366f1, #2dd4bf)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M9 18V5l12-2v13M9 18c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-2c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontSize: "1rem", fontWeight: 700, color: "#f1f5f9", fontFamily: '"Space Grotesk", sans-serif' }}>
              Songify
            </span>
          </Link>
          <p style={{ fontSize: "0.83rem", color: "var(--text-muted)", lineHeight: 1.8, maxWidth: 240 }}>
            Songify is the leading <strong style={{ color: "var(--text-secondary)" }}>ai song generator</strong> and <strong style={{ color: "var(--text-secondary)" }}>ai music generator</strong> for creators of every level. Use our <strong style={{ color: "var(--text-secondary)" }}>song maker</strong> and <strong style={{ color: "var(--text-secondary)" }}>lyrics generator</strong> to turn any idea into a full track — free, fast, and effortlessly.
          </p>
        </div>

        {/* Link columns */}
        {footerLinks.map((group) => (
          <div key={group.title}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "1rem" }}>
              {group.title}
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    prefetch={false}
                    style={{ fontSize: "0.875rem", color: "var(--text-muted)", textDecoration: "none", transition: "color 150ms ease" }}
                    className="hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} className="site-container px-4 py-5 sm:px-6 lg:px-8">
        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
          © {new Date().getFullYear()} Songify — Free AI Song Generator &amp; AI Music Maker. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
