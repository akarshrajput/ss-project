"use client";

import { useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function Tracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    // Generate session ID if it doesn't exist (lasts until browser tab closes)
    let sessionId = sessionStorage.getItem("pageview_session_id");
    if (!sessionId) {
      sessionId = "pv-sess-" + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem("pageview_session_id", sessionId);
    }

    const currentUrl = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    
    // Avoid double logging the exact same path/query on initial loads
    if (prevPath.current === currentUrl) return;
    prevPath.current = currentUrl;

    // Post pageview data to the API route
    fetch("/api/analytics/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pathname: pathname || "/",
        referrer: typeof document !== "undefined" ? document.referrer : "direct",
        sessionId,
      }),
    }).catch((err) => console.error("Failed to track pageview", err));
  }, [pathname, searchParams]);

  return null;
}

export function PageviewTracker() {
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  );
}
