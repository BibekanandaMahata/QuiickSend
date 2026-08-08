"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SendIcon from "@mui/icons-material/Send";
import GetAppIcon from "@mui/icons-material/GetApp";
import ShieldIcon from "@mui/icons-material/Shield";
import SpeedIcon from "@mui/icons-material/Speed";
import HubIcon from "@mui/icons-material/Hub";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SendCard from "@/components/SendCard";
import ReceiveCard from "@/components/ReceiveCard";

function QuickSendApp() {
  const [activeTab, setActiveTab] = useState<"send" | "receive">("send");
  const [activePeers, setActivePeers] = useState(1492);
  const [totalTransferred, setTotalTransferred] = useState(24.52);
  const searchParams = useSearchParams();

  // If a code parameter is provided in the URL, automatically switch to Receive tab and autofill
  useEffect(() => {
    const code = searchParams.get("code");
    if (code && code.length === 6) {
      setActiveTab("receive");
    }
  }, [searchParams]);

  // Simulate active peers and total data fluctuation to make the dashboard feel alive
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePeers((prev) => prev + Math.floor(Math.random() * 7) - 3);
      setTotalTransferred((prev) => prev + parseFloat((Math.random() * 0.05).toFixed(3)));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative select-none overflow-hidden py-4 md:py-8">
      {/* Soft Glowing Space Aurora Orbs (Static, Softer Dark Mode Optimized) */}
      <div className="absolute -top-40 -right-20 w-[450px] h-[450px] md:w-[850px] md:h-[850px] rounded-full bg-indigo-500/18 blur-[110px] md:blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-[35%] left-[10%] w-[350px] h-[350px] md:w-[750px] md:h-[750px] rounded-full bg-purple-500/12 blur-[90px] md:blur-[140px] pointer-events-none z-0" />
      <div className="absolute -bottom-60 -left-20 w-[550px] h-[550px] md:w-[950px] md:h-[950px] rounded-full bg-sky-500/18 blur-[110px] md:blur-[170px] pointer-events-none z-0" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.03),rgba(0,0,0,0))] pointer-events-none z-0" />

      {/* Main Content Layout */}
      <div className="flex-1 w-full max-w-6xl mx-auto px-6 flex items-center justify-center relative z-10 overflow-hidden">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center max-h-full overflow-y-auto lg:overflow-visible custom-scrollbar py-4">
          
          {/* LEFT COLUMN: Feature Presentation and Interactive Dashboard */}
          <div className="lg:col-span-5 flex flex-col items-start space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 shadow-sm text-[10px] md:text-[11px] font-bold text-indigo-400 tracking-wide uppercase">
              <span className="glow-pulse-dot" style={{ backgroundColor: "var(--accent)" }} />
              P2P Engine Active
            </div>
            
            <div className="space-y-3 md:space-y-4">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none text-slate-100">
                Lightning Fast <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-sky-400">
                  File Sharing
                </span>
              </h2>
              <p className="text-xs md:text-sm text-slate-300 max-w-md font-semibold leading-relaxed">
                Direct, secure, and fully encrypted web transfers. No limits, no logins, and zero logs. Designed for speed.
              </p>
            </div>

            {/* Micro Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-1">
              <div className="p-4 rounded-2xl glass-card flex items-start gap-3">
                <SpeedIcon className="text-sky-400 mt-0.5 text-xl" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Zero Limits</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">Send packages up to 2GB instantly.</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl glass-card flex items-start gap-3">
                <ShieldIcon className="text-purple-400 mt-0.5 text-xl" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">End-to-End</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">Mock-encrypted storage payload.</p>
                </div>
              </div>
            </div>

            {/* Simulated Live Analytics Dashboard */}
            <div className="w-full p-5 md:p-6 rounded-3xl glass-panel border border-slate-900/80 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/5 to-transparent pointer-events-none" />
              
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Network Ticker</span>
                <span className="text-[10px] text-slate-500 font-mono font-semibold">Channel SEC-930</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">
                <div>
                  <span className="text-[9px] md:text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Speed</span>
                  <span className="text-sm md:text-lg font-black text-indigo-400 font-mono tracking-tight">842.1 MB/s</span>
                </div>
                <div>
                  <span className="text-[9px] md:text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Peers Online</span>
                  <span className="text-sm md:text-lg font-black text-purple-400 font-mono tracking-tight">{activePeers}</span>
                </div>
                <div>
                  <span className="text-[9px] md:text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Sent Today</span>
                  <span className="text-sm md:text-lg font-black text-sky-400 font-mono tracking-tight">{totalTransferred.toFixed(2)} TB</span>
                </div>
              </div>

              {/* Graphical simulation nodes */}
              <div className="flex items-center justify-between p-3.5 bg-slate-900/50 rounded-2xl border border-slate-800/60 text-[10px] text-slate-400 font-semibold">
                <div className="flex items-center gap-2">
                  <HubIcon className="text-xs text-indigo-400 animate-pulse" />
                  <span>Matching Node Node-West-3</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircleIcon className="text-xs text-emerald-400" />
                  <span>100% Secure</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Send & Receive Card */}
          <div className="lg:col-span-7 w-full flex justify-center">
            {/* Main Interactive Glass Card with dynamic glows based on tab selection */}
            <div 
              className={`w-full max-w-lg glass-panel rounded-3xl p-5 md:p-8 border transition-all duration-500 ${
                activeTab === "send" 
                  ? "border-indigo-900/40 shadow-[0_15px_40px_-5px_rgba(99,102,241,0.02)] animate-glow-pulse" 
                  : "border-purple-900/40 shadow-[0_15px_40px_-5px_rgba(168,85,247,0.02)] animate-glow-pulse"
              }`}
            >
              {/* Tab Switcher */}
              <div className="grid grid-cols-2 p-1.5 bg-slate-950 border border-slate-800/50 rounded-2xl mb-6 md:mb-8 relative z-10">
                <button
                  onClick={() => setActiveTab("send")}
                  className={`py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeTab === "send"
                      ? "bg-slate-900 text-indigo-400 border border-slate-800 shadow-sm"
                      : "text-slate-400 hover:text-slate-205 hover:text-slate-200"
                  }`}
                >
                  <SendIcon className={`text-xs ${activeTab === "send" ? "text-indigo-400" : ""}`} />
                  <span>Send Files</span>
                </button>
                <button
                  onClick={() => setActiveTab("receive")}
                  className={`py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeTab === "receive"
                      ? "bg-slate-900 text-purple-400 border border-slate-800 shadow-sm"
                      : "text-slate-400 hover:text-slate-205 hover:text-slate-200"
                  }`}
                >
                  <GetAppIcon className={`text-xs ${activeTab === "receive" ? "text-purple-400" : ""}`} />
                  <span>Receive Files</span>
                </button>
              </div>

              {/* Active Tab Component */}
              <div className="min-h-[295px] flex items-center justify-center relative z-10">
                {activeTab === "send" ? <SendCard /> : <ReceiveCard />}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen bg-[#131924] text-slate-500 items-center justify-center text-sm font-mono tracking-widest">
          LOADING QUICKSEND ENGINE...
        </div>
      }
    >
      <QuickSendApp />
    </Suspense>
  );
}
