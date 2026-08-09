"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SendIcon from "@mui/icons-material/Send";
import GetAppIcon from "@mui/icons-material/GetApp";
import ShieldIcon from "@mui/icons-material/Shield";
import SpeedIcon from "@mui/icons-material/Speed";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import ImageIcon from "@mui/icons-material/Image";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import CodeIcon from "@mui/icons-material/Code";
import SendCard from "@/components/SendCard";
import ReceiveCard from "@/components/ReceiveCard";

function QuickSendApp() {
  const [activeTab, setActiveTab] = useState<"send" | "receive">("send");
  const searchParams = useSearchParams();

  // If a code parameter is provided in the URL, automatically switch to Receive tab and autofill
  useEffect(() => {
    const code = searchParams.get("code");
    if (code && code.length === 6) {
      setActiveTab("receive");
    }
  }, [searchParams]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative select-none overflow-hidden py-4 md:py-8">
      {/* Soft Glowing Space Aurora Orbs (Static, Softer Dark Mode Optimized) */}
      <div className="absolute -top-40 -right-20 w-[450px] h-[450px] md:w-[850px] md:h-[850px] rounded-full bg-yellow-950/8 blur-[110px] md:blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-[35%] left-[10%] w-[350px] h-[350px] md:w-[750px] md:h-[750px] rounded-full bg-amber-950/5 blur-[90px] md:blur-[140px] pointer-events-none z-0" />
      <div className="absolute -bottom-60 -left-20 w-[550px] h-[550px] md:w-[950px] md:h-[950px] rounded-full bg-yellow-950/8 blur-[110px] md:blur-[170px] pointer-events-none z-0" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(202,138,4,0.01),rgba(0,0,0,0))] pointer-events-none z-0" />

      {/* Main Content Layout */}
      <div className="flex-1 w-full mx-auto px-4 sm:px-6 md:px-10 flex items-center justify-center relative z-10 overflow-hidden">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center max-h-full overflow-y-auto lg:overflow-visible custom-scrollbar py-4">
          {/* LEFT COLUMN: Feature Presentation — hidden on mobile, visible on lg+ */}
          <div className="hidden lg:flex lg:col-span-5 flex-col items-start space-y-6 md:space-y-8">
            <div className="space-y-3 md:space-y-4">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none text-slate-100">
                Simple & Easy <br />
                <span className="text-amber-600">
                  File Sharing
                </span>
              </h2>
              <p className="text-xs md:text-sm text-slate-300 max-w-md font-semibold leading-relaxed">
                Direct and easy file transfers through the web. Max 10MB limit,
                no logins, and simple sharing without the hassle.
              </p>
            </div>

            {/* Micro Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-1">
              <div className="p-4 rounded-2xl glass-card flex items-start gap-3">
                <SpeedIcon className="text-amber-600/90 mt-0.5 text-xl" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">
                    10MB Limit
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                    Send packages up to 10MB instantly.
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-2xl glass-card flex items-start gap-3">
                <ShieldIcon className="text-amber-600/90 mt-0.5 text-xl" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">
                    Secure Storage
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                    Self-destructing server references.
                  </p>
                </div>
              </div>
            </div>

            {/* Supported File Types Display */}
            <div className="w-full p-5 md:p-6 rounded-3xl glass-panel border border-slate-900/80 space-y-4 relative overflow-hidden">

              <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Supported File Types
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
                  <DescriptionIcon className="text-red-400 text-lg" />
                  <div>
                    <h5 className="text-[10px] font-bold text-slate-200">
                      Documents
                    </h5>
                    <p className="text-[9px] text-slate-400 mt-0.5">
                      PDF, DOCX, TXT
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
                  <FolderZipIcon className="text-amber-600/90 text-lg" />
                  <div>
                    <h5 className="text-[10px] font-bold text-slate-200">
                      Archives
                    </h5>
                    <p className="text-[9px] text-slate-400 mt-0.5">
                      ZIP, RAR, 7Z
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
                  <ImageIcon className="text-amber-600/90 text-lg" />
                  <div>
                    <h5 className="text-[10px] font-bold text-slate-200">
                      Images
                    </h5>
                    <p className="text-[9px] text-slate-400 mt-0.5">
                      PNG, JPG, SVG
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
                  <AudioFileIcon className="text-amber-600/90 text-lg" />
                  <div>
                    <h5 className="text-[10px] font-bold text-slate-200">
                      Audio/Video
                    </h5>
                    <p className="text-[9px] text-slate-400 mt-0.5">
                      MP4, MP3, WAV
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
                  <CodeIcon className="text-amber-700/90 text-lg" />
                  <div>
                    <h5 className="text-[10px] font-bold text-slate-200">
                      Developer
                    </h5>
                    <p className="text-[9px] text-slate-400 mt-0.5">
                      JS, TS, PY, GO
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
                  <span className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center text-slate-400 text-[9px] font-black">
                    All
                  </span>
                  <div>
                    <h5 className="text-[10px] font-bold text-slate-200">
                      Other Files
                    </h5>
                    <p className="text-[9px] text-slate-400 mt-0.5">
                      Custom Formats
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Send & Receive Card */}
          <div className="lg:col-span-7 w-full flex justify-center">
            {/* Main Interactive Glass Card with dynamic glows based on tab selection */}
            <div
              className={`w-full max-w-lg glass-panel rounded-3xl p-4 sm:p-5 md:p-8 border transition-all duration-500 ${
                activeTab === "send"
                  ? "border-amber-950/60 shadow-[0_15px_40px_-5px_rgba(180,83,9,0.015)]"
                  : "border-yellow-950/60 shadow-[0_15px_40px_-5px_rgba(202,138,4,0.015)]"
              }`}
            >
              {/* Tab Switcher */}
              <div className="grid grid-cols-2 p-1.5 bg-stone-950/80 border border-stone-800/50 rounded-2xl mb-5 md:mb-8 relative z-10">
                <button
                  onClick={() => setActiveTab("send")}
                  className={`py-2.5 md:py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeTab === "send"
                      ? "bg-stone-900/60 text-amber-600 border border-stone-800 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <SendIcon
                    className={`text-xs ${activeTab === "send" ? "text-amber-600" : ""}`}
                  />
                  <span>Send Files</span>
                </button>
                <button
                  onClick={() => setActiveTab("receive")}
                  className={`py-2.5 md:py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeTab === "receive"
                      ? "bg-stone-900/60 text-yellow-600 border border-stone-800 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <GetAppIcon
                    className={`text-xs ${activeTab === "receive" ? "text-yellow-600" : ""}`}
                  />
                  <span>Receive Files</span>
                </button>
              </div>

              {/* Active Tab Component */}
              <div className="min-h-[280px] sm:min-h-[295px] flex items-center justify-center relative z-10">
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
        <div className="flex min-h-screen bg-[#181614] text-slate-500 items-center justify-center text-sm font-mono tracking-widest">
          LOADING QUICKSEND ENGINE...
        </div>
      }
    >
      <QuickSendApp />
    </Suspense>
  );
}
