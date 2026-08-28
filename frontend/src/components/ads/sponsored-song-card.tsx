"use client";

import { AdsterraBanner } from "./adsterra-banner";
import { AD_CONFIG } from "./ad-config";

interface SponsoredSongCardProps {
  variant?: "banner" | "promo";
}

export function SponsoredSongCard({ variant = "banner" }: SponsoredSongCardProps) {
  if (variant === "banner") {
    return (
      <div
        className="w-full flex flex-col items-center justify-center rounded-2xl overflow-hidden p-3 transition-all duration-300 hover:border-indigo-500/30"
        style={{
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          minHeight: "280px",
        }}
      >
        <div className="w-full flex justify-between items-center px-2 mb-1">
          <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase">
            Sponsored Partner
          </span>
          <span className="text-[9px] text-slate-500 uppercase">Ad</span>
        </div>
        <div className="w-full flex items-center justify-center overflow-hidden">
          <AdsterraBanner type="300x250" label={false} className="my-0 py-0 border-none bg-transparent" />
        </div>
      </div>
    );
  }

  const handleOpenSmartlink = () => {
    try {
      window.open(AD_CONFIG.smartlinkUrl, "_blank", "noopener,noreferrer");
    } catch (_) {}
  };

  return (
    <div
      onClick={handleOpenSmartlink}
      className="w-full flex flex-col justify-between rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-indigo-500/40 group"
      style={{
        background: "linear-gradient(145deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        minHeight: "280px",
      }}
    >
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-extrabold tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 uppercase">
            Featured Sponsor
          </span>
          <span className="text-[10px] text-emerald-400 font-bold">● High Speed</span>
        </div>

        <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
          Unlock Unlimited 4K Audio Stems & Studio Master Export
        </h4>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          Convert full songs to FLAC/WAV, isolate vocal tracks, and remove watermarks instantly.
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-300">Free Instant Access</span>
        <span className="text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
          Explore Now →
        </span>
      </div>
    </div>
  );
}
