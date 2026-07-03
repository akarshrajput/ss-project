"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileMenuProps {
  items: { href: string; label: string }[];
  isLoggedIn: boolean;
  isSubscribed: boolean;
  isAdmin: boolean;
}

export function MobileMenu({ items, isLoggedIn, isSubscribed, isAdmin }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 38,
          height: 38,
          borderRadius: "0.5rem",
          border: "1px solid rgba(255,255,255,0.1)",
          background: open ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)",
          cursor: "pointer",
          transition: "all 150ms ease",
        }}
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {/* Overlay + Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              top: 0,
              zIndex: 49,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
            }}
          />

          {/* Menu panel */}
          <nav
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              width: "min(260px, 75vw)",
              height: "100dvh",
              zIndex: 50,
              background: "rgba(13,17,23,0.98)",
              borderLeft: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              display: "flex",
              flexDirection: "column",
              padding: "1rem",
              animation: "slide-in-right 0.2s ease-out",
            }}
          >
            {/* Close button */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  borderRadius: "0.4rem",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.04)",
                  cursor: "pointer",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0.55rem 0.75rem",
                    borderRadius: "0.4rem",
                    color: pathname === item.href ? "#a5b4fc" : "var(--text-secondary)",
                    fontWeight: pathname === item.href ? 600 : 500,
                    fontSize: "0.85rem",
                    textDecoration: "none",
                    background: pathname === item.href ? "rgba(99,102,241,0.1)" : "transparent",
                    transition: "all 150ms ease",
                  }}
                >
                  {item.label}
                </Link>
              ))}

              {isLoggedIn && isSubscribed && (
                <Link
                  href="/studio"
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0.55rem 0.75rem",
                    borderRadius: "0.4rem",
                    color: pathname === "/studio" ? "#a5b4fc" : "var(--text-secondary)",
                    fontWeight: pathname === "/studio" ? 600 : 500,
                    fontSize: "0.85rem",
                    textDecoration: "none",
                    background: pathname === "/studio" ? "rgba(99,102,241,0.1)" : "transparent",
                    transition: "all 150ms ease",
                  }}
                >
                  Studio
                </Link>
              )}

              {isLoggedIn && isAdmin && (
                <Link
                  href="/admin"
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0.55rem 0.75rem",
                    borderRadius: "0.4rem",
                    color: pathname === "/admin" ? "#a5b4fc" : "var(--text-secondary)",
                    fontWeight: pathname === "/admin" ? 600 : 500,
                    fontSize: "0.85rem",
                    textDecoration: "none",
                    background: pathname === "/admin" ? "rgba(99,102,241,0.1)" : "transparent",
                    transition: "all 150ms ease",
                  }}
                >
                  Admin
                </Link>
              )}

              {isLoggedIn && (
                <Link
                  href="/me"
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0.55rem 0.75rem",
                    borderRadius: "0.4rem",
                    color: "var(--text-secondary)",
                    fontWeight: 500,
                    fontSize: "0.85rem",
                    textDecoration: "none",
                    transition: "all 150ms ease",
                  }}
                >
                  My Account
                </Link>
              )}
            </div>

            {/* Auth links — no divider */}
            {!isLoggedIn && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginTop: "0.75rem" }}>
                <Link
                  href="/login"
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0.55rem 0.75rem",
                    borderRadius: "0.4rem",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "var(--text-primary)",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    textDecoration: "none",
                    transition: "all 150ms ease",
                  }}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0.55rem 0.75rem",
                    borderRadius: "0.4rem",
                    background: "linear-gradient(135deg, #6366f1, #818cf8)",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    textDecoration: "none",
                    border: "none",
                    boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
                    transition: "all 150ms ease",
                  }}
                >
                  Register
                </Link>
              </div>
            )}
          </nav>

          <style>{`
            @keyframes slide-in-right {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
          `}</style>
        </>
      )}
    </div>
  );
}
