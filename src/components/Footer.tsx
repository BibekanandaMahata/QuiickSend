"use client";

import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (<footer className="w-full text-center py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest relative z-30 border-t border-slate-800/60 bg-slate-900/70 backdrop-blur-md">
    QuickSend © {currentYear} · Developed by Bibekananda Mahata </footer>
  );
}

