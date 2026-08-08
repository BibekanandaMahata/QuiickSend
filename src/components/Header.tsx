"use client";

import React from "react";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function Header() {
  return (
    <header className="w-full relative z-30 border-b border-slate-800/60 bg-slate-900/70 backdrop-blur-md shadow-sm">
      {/* Decorative gradient top bar (Electric Indigo - Purple Sunset - Sky Blue) */}
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500" />
      
      <div className="w-full max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
        {/* Left Side: Brand and Status Badge */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-sky-500 flex items-center justify-center shadow-md shadow-indigo-500/10 group-hover:scale-105 transition-transform duration-300">
              <FlashOnIcon className="text-white text-base" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-slate-100 leading-none">
                QuickSend
              </h1>
              <p className="text-[9px] text-indigo-400 font-bold tracking-widest uppercase leading-none mt-1">
                Secure P2P Web
              </p>
            </div>
          </div>
          
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/40 border border-indigo-900/40 text-[9px] font-bold text-[#818cf8] tracking-wider uppercase shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shadow-sm shadow-indigo-500/50" />
            Engine Online
          </div>
        </div>

        {/* Right Side: GitHub Button */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com"
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
