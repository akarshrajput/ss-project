"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut } from "@/app/actions/auth";

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setOpen(!open)}
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "rgba(99,102,241,0.15)",
          border: "1px solid rgba(99,102,241,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#a5b4fc",
          cursor: "pointer",
          transition: "background 150ms"
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.25)")}
        onMouseOut={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.15)")}
        aria-label="User menu"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: "absolute",
          top: "100%",
          right: 0,
          marginTop: "0.5rem",
          width: 160,
          background: "rgba(13,17,23,0.95)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "0.75rem",
          padding: "0.5rem",
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          zIndex: 50
        }}>
          <Link
            href="/me"
            onClick={() => setOpen(false)}
            style={{
              padding: "0.5rem 0.75rem",
              borderRadius: "0.4rem",
              color: "var(--text-primary)",
              fontSize: "0.85rem",
              textDecoration: "none",
              display: "block",
              transition: "background 150ms"
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
            onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
          >
            My Profile
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              style={{
                width: "100%",
                textAlign: "left",
                padding: "0.5rem 0.75rem",
                borderRadius: "0.4rem",
                color: "#fca5a5",
                fontSize: "0.85rem",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                transition: "background 150ms"
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Logout
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
