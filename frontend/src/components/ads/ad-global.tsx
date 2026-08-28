"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AD_CONFIG } from "./ad-config";
import { AdStickyFooter } from "./ad-sticky-footer";
import { SideBanners } from "./side-banners";

export function AdGlobal() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pathname?.startsWith("/admin")) return;

    // 1. Re-arm Popunder on every route change (SPA support)
    const popScript = document.createElement("script");
    popScript.type = "text/javascript";
    popScript.async = true;
    popScript.src = `${AD_CONFIG.popunderUrl}?_r=${Date.now()}`;
    popScript.setAttribute("data-adsterra-zone", "popunder");
    document.body.appendChild(popScript);

    // 2. Re-arm Social Bar on every route change (SPA support)
    const sbScript = document.createElement("script");
    sbScript.type = "text/javascript";
    sbScript.async = true;
    sbScript.src = `${AD_CONFIG.socialBarUrl}?_r=${Date.now()}`;
    sbScript.setAttribute("data-adsterra-zone", "social-bar");
    document.body.appendChild(sbScript);

    // 3. User-Interaction Smartlink Trigger (Throttled frequency)
    let triggeredInSession = false;
    const handleInteraction = (e: MouseEvent) => {
      if (triggeredInSession) return;
      if (window.location.pathname.startsWith("/admin")) return;

      const target = e.target as HTMLElement | null;
      const clickable = target?.closest("a, button, [role='button'], audio, video, input[type='submit']");
      if (clickable) {
        try {
          const lastFire = sessionStorage.getItem("singify_sl_time");
          const now = Date.now();
          // Fire at most once every 45 seconds per session
          if (!lastFire || now - parseInt(lastFire, 10) > 45000) {
            sessionStorage.setItem("singify_sl_time", now.toString());
            triggeredInSession = true;
            window.open(AD_CONFIG.smartlinkUrl, "_blank", "noopener,noreferrer");
          }
        } catch (_) {}
      }
    };

    window.addEventListener("click", handleInteraction, { capture: true });

    return () => {
      window.removeEventListener("click", handleInteraction, { capture: true });
      try {
        if (popScript.parentNode) popScript.parentNode.removeChild(popScript);
        if (sbScript.parentNode) sbScript.parentNode.removeChild(sbScript);
      } catch (_) {}
    };
  }, [pathname]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <SideBanners />
      <AdStickyFooter />
    </>
  );
}
