"use client";

import React from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import LanguageIcon from "@mui/icons-material/Language";

export default function Header() {
  return (
    <header className="w-full relative z-30 border-b border-slate-800/60 bg-slate-900/70 backdrop-blur-md shadow-sm">
      {/* Decorative gradient top bar (Electric Indigo - Purple Sunset - Sky Blue) */}
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500" />

      <div className="w-full mx-auto px-10 py-3.5 flex items-center justify-between">
        {/* Left Side: Brand and Status Badge */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-sky-500 flex items-center justify-center shadow-md shadow-indigo-500/10 group-hover:scale-105 transition-transform duration-300">
              <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 2l4 4-4 4" />
                <path d="M3 18v-6a6 6 0 0 1 6-6h12" />
                <path d="M7 22l-4-4 4-4" />
                <path d="M21 6v6a6 6 0 0 1-6 6H3" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-slate-100 leading-none">
                QuickSend
              </h1>
              <p className="text-[9px] text-indigo-400 font-bold tracking-widest uppercase leading-none mt-1">
                P2P Web File Transfer
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: GitHub Button */}
        <div className="flex items-center gap-3">
          <a
            href="https://bibekmahata.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            title="Developer Portfolio"
            className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 backdrop-blur-sm transition-all text-slate-400 hover:text-indigo-400 shadow-sm"
          >
            <LanguageIcon className="text-base" />
          </a>
          <a
            href="https://github.com/BibekanandaMahata/QuickSend"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 backdrop-blur-sm transition-all text-slate-400 hover:text-indigo-400 shadow-sm"
          >
            <GitHubIcon className="text-base" />
          </a>
        </div>
      </div>
    </header>
  );
}
