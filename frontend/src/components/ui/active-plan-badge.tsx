"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function ActivePlanBadge({ expiresAt }: { expiresAt: Date }) {
  const [timeLeft, setTimeLeft] = useState("calculating...");

  useEffect(() => {
    const update = () => {
      const ms = new Date(expiresAt).getTime() - Date.now();
      if (ms <= 0) {
        setTimeLeft("Expired");
        return;
      }
      const h = Math.floor(ms / (1000 * 60 * 60));
      const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((ms % (1000 * 60)) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };
    update();
    const interval = setInterval(update, 1000); // update every minute
    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <Link
      href="/"
      onClick={(e) => {
        // Just focus the prompt input if they click this badge
        const el = document.getElementById("prompt-input") || document.querySelector("textarea");
        if (el) {
          e.preventDefault();
          el.focus();
        }
      }}
      className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-sm font-semibold text-teal-300 transition-colors hover:bg-teal-500/20"
      style={{ textDecoration: "none" }}
    >
      Generate without delay ({timeLeft}) remaining &rarr;
    </Link>
  );
}
