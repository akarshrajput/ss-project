import Link from "next/link";
import { getAppUserProfile } from "@/lib/app-store";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/studio", label: "Studio" },
  { href: "/services", label: "Services" },
  { href: "/features", label: "Features" },
];

const userItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/library", label: "Library" },
  { href: "/account", label: "Account" },
];

export async function SiteHeader() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profile = user ? await getAppUserProfile(user.id) : null;

  return (
    <header className="sticky top-0 z-40" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(6,8,16,0.82)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}>
      <div className="site-container flex w-full items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group" style={{ textDecoration: "none" }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: "linear-gradient(135deg, #6366f1, #2dd4bf)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 16px rgba(99,102,241,0.4)",
            transition: "box-shadow 200ms ease",
          }}
            className="group-hover:shadow-[0_0_24px_rgba(99,102,241,0.6)]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18V5l12-2v13M9 18c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-2c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize: "1.05rem", fontWeight: 700, color: "#f1f5f9", fontFamily: '"Space Grotesk", sans-serif', letterSpacing: "-0.02em" }}>
            Songify
          </span>
        </Link>

        {/* Main Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.href} className="nav-link" href={item.href} prefetch={false}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {userItems.map((item) => (
                <Link key={item.href} className="nav-link hidden sm:block" href={item.href} prefetch={false}>
                  {item.label}
                </Link>
              ))}
              {profile?.role === "admin" && (
                <Link
                  className="nav-link"
                  href="/admin"
                  prefetch={false}
                  style={{ color: "#a5b4fc", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}
                >
                  Admin
                </Link>
              )}
            </>
          ) : (
            <>
              <Link className="nav-link" href="/login" prefetch={false}>
                Log in
              </Link>
              <Link
                href="/register"
                prefetch={false}
                className="btn-primary"
                style={{ padding: "0.45rem 1rem", fontSize: "0.85rem" }}
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
