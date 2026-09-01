"use client";

import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full text-center py-3.5 sm:py-4 text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest relative z-30 border-t border-slate-800/80 bg-slate-950/70 backdrop-blur-xl px-4">
      <span className="text-slate-400">QuickSend © {currentYear}</span>
      <span className="mx-1.5 text-slate-700">·</span>
      <span className="text-amber-500/90">Open Source</span>
    </footer>
  );
}
