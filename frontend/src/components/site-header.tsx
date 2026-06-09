import Link from "next/link";
import Image from "next/image";
import { getAppUserProfile } from "@/lib/app-store";
import { createOptionalSupabaseServerClient } from "@/lib/supabase/server";
import { hasActiveSubscription } from "@/lib/subscription-store";
import { UserMenu } from "@/components/ui/user-menu";

import { PromoBanner } from "@/components/ui/promo-banner";

const navItems = [
  // { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  // { href: "/services", label: "Services" },
  // { href: "/features", label: "Features" },
];

export async function SiteHeader() {
  const supabase = await createOptionalSupabaseServerClient();
  const user = supabase
    ? (await supabase.auth.getUser()).data.user
    : null;
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

        {/* Right side */}
        <div className="flex items-center gap-2">
          {navItems.map((item) => (
            <Link key={item.href} className="nav-link hidden md:block" href={item.href} prefetch={false}>
              {item.label}
            </Link>
          ))}
          {user ? (
            <>
              {isSubscribed && (
                <Link
                  className="nav-link hidden md:block"
                  href="/studio"
                  prefetch={false}
                >
                  Studio
                </Link>
              )}
              {profile?.role === "admin" && (
                <Link
                  className="nav-link hidden md:block"
                  href="/admin"
                  prefetch={false}
                >
                  Admin
                </Link>
              )}
              <UserMenu />
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </header>
  );
}

