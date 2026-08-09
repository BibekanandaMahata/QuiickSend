"use client";

import React from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import LanguageIcon from "@mui/icons-material/Language";

export default function Header() {
  return (
    <header className="w-full relative z-30 border-b border-slate-800/60 bg-slate-900/70 backdrop-blur-md shadow-sm">
      <div className="w-full mx-auto px-10 py-3.5 flex items-center justify-between">
        {/* Left Side: Brand and Status Badge */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shadow-md shadow-amber-700/10 group-hover:scale-105 transition-transform duration-300">
              <img src="/send.svg" alt="Logo" className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-100 leading-none">
                QuiickSend
              </h1>
              <p className="text-[9px] text-slate-100 font-bold tracking-widest uppercase leading-none mt-1">
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
            className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 backdrop-blur-sm transition-all text-slate-400 hover:text-amber-600 shadow-sm"
          >
            <LanguageIcon className="text-base" />
          </a>
          <a
            href="https://github.com/BibekanandaMahata/QuickSend"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 backdrop-blur-sm transition-all text-slate-400 hover:text-amber-600 shadow-sm"
          >
            <GitHubIcon className="text-base" />
          </a>
        </div>
      </div>
    </header>
  );
}
