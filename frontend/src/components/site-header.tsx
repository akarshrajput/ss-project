import Link from "next/link";
import Image from "next/image";
import { getAppUserProfile } from "@/lib/app-store";
import { getUser } from "@/lib/auth";
import { hasActiveSubscription } from "@/lib/subscription-store";
import { UserMenu } from "@/components/ui/user-menu";
import { MobileMenu } from "@/components/ui/mobile-menu";

import { PromoBanner } from "@/components/ui/promo-banner";

const navItems = [
  // { href: "/", label: "Home" },
  { href: "/explore", label: "Explore Songs" },
  // { href: "/services", label: "Services" },
  // { href: "/features", label: "Features" },
];

export async function SiteHeader() {
  const user = await getUser();
  const profile = user ? await getAppUserProfile(user.id) : null;
  const isSubscribed = user ? await hasActiveSubscription(user.id) : false;

  return (
    <header className="sticky top-0 z-40" style={{ boxShadow: "0 16px 32px -8px var(--bg-base)", background: "rgba(14, 24, 33, 0.82)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}>
      {!isSubscribed && <PromoBanner user={user} />}
      <div className="site-container flex w-full items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group" style={{ textDecoration: "none" }}>
          <Image
            src="/songify-logo.png"
            alt="Songify"
            width={32}
            height={32}
            className="rounded-[9px] shadow-[0_0_16px_rgba(99,102,241,0.4)] transition-shadow duration-200 group-hover:shadow-[0_0_24px_rgba(99,102,241,0.6)]"
          />
          <span style={{ fontSize: "1.05rem", fontWeight: 700, color: "#f1f5f9", fontFamily: '"Space Grotesk", sans-serif', letterSpacing: "-0.02em" }}>
            Songify
          </span>
        </Link>

        {/* Right side — desktop */}
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <Link key={item.href} className="nav-link" href={item.href} prefetch={false}>
              {item.label}
            </Link>
          ))}
          {user ? (
            <>
              {isSubscribed && (
                <Link
                  className="nav-link"
                  href="/studio"
                  prefetch={false}
                >
                  Studio
                </Link>
              )}
              {profile?.role === "admin" && (
                <Link
                  className="nav-link"
                  href="/admin"
                  prefetch={false}
                >
                  Admin
                </Link>
              )}
              <UserMenu />
            </>
          ) : (
            <>
              <Link
                className="nav-link"
                href="/login"
                prefetch={false}
              >
                Login
              </Link>
              <Link
                className="nav-link border border-indigo-600/30 bg-indigo-500/10 flex items-center justify-center"
                href="/register"
                prefetch={false}
                style={{
                  color: "#fff",
                  padding: "0.4rem 1rem",
                  borderRadius: "10px",
                  fontWeight: 600,
                }}
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Right side — mobile */}
        <div className="flex items-center gap-2 md:hidden">
          {user && <UserMenu />}
          <MobileMenu
            items={navItems}
            isLoggedIn={!!user}
            isSubscribed={isSubscribed}
            isAdmin={profile?.role === "admin"}
          />
        </div>
      </div>
    </header>
  );
}
