"use client";

import { AD_CONFIG } from "./ad-config";

interface SmartlinkBannerCTAProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  badgeText?: string;
  className?: string;
}

export function SmartlinkBannerCTA({
  title = "⚡ Unlock 320kbps Lossless Studio Master Audio",
  subtitle = "Boost generation speed, bypass download queues, and export high-fidelity stems with VIP Studio Access.",
  buttonText = "Unlock Free VIP Access",
  badgeText = "SPONSORED OFFER",
  className = "",
}: SmartlinkBannerCTAProps) {
  const handleClick = () => {
    try {
      window.open(AD_CONFIG.smartlinkUrl, "_blank", "noopener,noreferrer");
    } catch (_) {}
  };

  return (
    <div
      onClick={handleClick}
      className={`relative my-8 overflow-hidden rounded-2xl p-6 sm:p-8 cursor-pointer transition-all duration-300 hover:scale-[1.01] ${className}`}
      style={{
        background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.12) 50%, rgba(45, 212, 191, 0.08) 100%)",
        border: "1px solid rgba(168, 85, 247, 0.3)",
        boxShadow: "0 10px 40px -10px rgba(99, 102, 241, 0.25)",
      }}
    >
      {/* Subtle Background Glow */}
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full blur-3xl"
        style={{ background: "rgba(168, 85, 247, 0.25)" }}
      />
      <div
        className="pointer-events-none absolute -left-12 -bottom-12 h-48 w-48 rounded-full blur-3xl"
        style={{ background: "rgba(99, 102, 241, 0.25)" }}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[11px] font-bold tracking-wider uppercase mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            {badgeText}
          </div>
          <h3
            className="text-xl sm:text-2xl font-bold text-white tracking-tight"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
          >
            {title}
          </h3>
          <p className="text-sm text-slate-300 mt-1.5 max-w-xl leading-relaxed">
            {subtitle}
          </p>
        </div>

        <button
          type="button"
          className="shrink-0 px-6 py-3.5 rounded-xl font-bold text-sm text-white shadow-xl flex items-center gap-2 cursor-pointer transition-all duration-200 hover:brightness-110"
          style={{
            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
            boxShadow: "0 4px 20px rgba(99, 102, 241, 0.4)",
          }}
        >
          <span>{buttonText}</span>
          <span className="text-base">→</span>
        </button>
      </div>
    </div>
  );
}
