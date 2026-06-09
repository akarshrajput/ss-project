"use client";

import { useState, useEffect } from "react";

function formatTime(ms: number) {
  if (ms <= 0) return "00:00:00";
  const totalSec = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
  const s = String(totalSec % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export function CountdownTimer({ expiresAt }: { expiresAt: string }) {
  const expiryMs = new Date(expiresAt).getTime();
  const [remaining, setRemaining] = useState(() => Math.max(0, expiryMs - Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      const left = Math.max(0, expiryMs - Date.now());
      setRemaining(left);
      if (left <= 0) {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiryMs]);

  if (remaining <= 0) {
    return <span style={{ color: "#ef4444", fontWeight: 600 }}>Expired</span>;
  }

  return (
    <span style={{ 
      fontFamily: '"Space Grotesk", monospace', 
      fontVariantNumeric: "tabular-nums",
      color: "#a5b4fc",
      fontWeight: 700
    }}>
      {formatTime(remaining)}
    </span>
  );
}
