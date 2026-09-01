"use client";

import React from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import LanguageIcon from "@mui/icons-material/Language";

export default function Header() {
  return (
    <header className="w-full relative z-30 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl shadow-md">
      <div className="w-full mx-auto px-6 sm:px-10 py-3.5 flex items-center justify-between">
        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-all duration-300">
              <img src="/send.svg" alt="Logo" className="w-5 h-5 invert brightness-200" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white leading-none bg-gradient-to-r from-white via-slate-100 to-amber-200 bg-clip-text text-transparent">
                QuickSend
              </h1>
              <p className="text-[9px] text-amber-400/90 font-bold tracking-widest uppercase leading-none mt-1">
                P2P Web File Transfer
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Links */}
        <div className="flex items-center gap-2.5">
          <a
            href="https://bibekmahata.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            title="Developer Portfolio"
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 backdrop-blur-sm transition-all text-slate-400 hover:text-amber-400 shadow-sm"
          >
            <LanguageIcon className="text-base" />
          </a>
          <a
            href="https://github.com/BibekanandaMahata/QuickSend"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 backdrop-blur-sm transition-all text-slate-400 hover:text-amber-400 shadow-sm"
          >
            <GitHubIcon className="text-base" />
          </a>
        </div>
      </div>
    </header>
  );
}
