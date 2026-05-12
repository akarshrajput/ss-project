"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { House, MagnifyingGlass } from "@phosphor-icons/react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-card max-w-lg p-8 flex flex-col items-center gap-6 border border-white/10 shadow-2xl backdrop-blur-xl bg-[#0d1117]/80"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative w-full aspect-square max-w-[320px] overflow-hidden rounded-xl border border-white/5"
        >
          <Image
            src="/404.png"
            alt="404 Page Not Found"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold font-display gradient-text tracking-tighter">We've Lost the Beat</h1>
          <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
            The track you are looking for doesn't exist or has been moved to another playlist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
          <Link href="/" className="btn-primary justify-center flex-1 py-2.5">
            <House size={18} weight="bold" className="mr-2" />
            Go Home
          </Link>
          <Link href="/explore" className="btn-secondary justify-center flex-1 py-2.5">
            <MagnifyingGlass size={18} weight="bold" className="mr-2" />
            Explore
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
