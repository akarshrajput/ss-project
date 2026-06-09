"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "@phosphor-icons/react";

interface PromoBannerProps {
  user: any;
}

export function PromoBanner({ user }: PromoBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show if the user hasn't dismissed it
    const dismissed = localStorage.getItem("songify_promo_banner_dismissed");
    if (!dismissed) {
      // setIsVisible(true); // Temporarily hidden as per user request
    }
  }, []);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("songify_promo_banner_dismissed", "true");
  };

  return (
    <div style={{ 
      background: "linear-gradient(90deg, rgba(30,27,75,0.8), rgba(15,23,42,0.8))", 
      padding: "0.5rem 2.5rem 0.5rem 1rem", 
      textAlign: "center",
      position: "relative"
    }}>
      <Link href={user ? "/payment?plan=24h-unlimited" : "/register?plan=24h-unlimited"} style={{ color: "#fff", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none", display: "inline-block", letterSpacing: "0.01em" }}>
        Unlock 24 hours of unlimited, high-quality songs without delay for just $1 <span aria-hidden="true" style={{ opacity: 0.8 }}>&rarr;</span>
      </Link>
      <button 
        onClick={handleDismiss}
        style={{
          position: "absolute",
          right: "0.75rem",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.6)",
          cursor: "pointer",
          padding: "0.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "0.25rem",
        }}
        aria-label="Dismiss banner"
        onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.background = "none"; }}
      >
        <X size={16} weight="bold" />
      </button>
    </div>
  );
}
