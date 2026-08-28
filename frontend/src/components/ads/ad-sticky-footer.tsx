"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AdsterraBanner } from "./adsterra-banner";

export function AdStickyFooter() {
  const pathname = usePathname();
  const [closed, setClosed] = useState(false);

  if (closed || pathname?.startsWith("/admin")) return null;

  return (
    <aside
      aria-label="Floating Advertisement Bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#090d16]/95 backdrop-blur-lg border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.6)] py-1.5 flex flex-col items-center justify-center transition-all duration-300"
    >
      <div className="relative flex items-center justify-center w-full max-w-6xl px-2">
        <button
          onClick={() => setClosed(true)}
          aria-label="Close advertisement banner"
          className="absolute -top-3.5 right-2 sm:right-4 bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full px-2.5 py-0.5 border border-white/15 shadow-lg text-[10px] font-semibold tracking-wider uppercase flex items-center gap-1 cursor-pointer transition-colors duration-150"
        >
          <span>Close</span>
          <span className="text-xs font-bold leading-none">✕</span>
        </button>

        {/* Desktop 728x90 */}
        <div className="hidden md:block w-full max-w-[728px]">
          <AdsterraBanner type="728x90" className="my-0 py-0.5 border-none bg-transparent" label={false} />
        </div>

        {/* Mobile / Tablet 300x250 */}
        <div className="block md:hidden">
          <AdsterraBanner type="300x250" className="my-0 py-0.5 border-none bg-transparent" label={false} />
        </div>
      </div>
    </aside>
  );
}
