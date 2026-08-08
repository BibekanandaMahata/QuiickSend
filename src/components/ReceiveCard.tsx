"use client";

import React, { useState, useRef, useEffect } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShieldIcon from "@mui/icons-material/Shield";
import confetti from "canvas-confetti";
import { formatBytes } from "@/utils/format";
import { supabase } from "@/utils/supabase";

interface MockFile {
  name: string;
  size: number;
  type: string;
  storage_path: string;
}

interface MockTransfer {
  id: string;
  files: MockFile[];
  expiresInMinutes: number;
}

const getFileClass = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (!ext) return "file-default";
  if (["pdf"].includes(ext)) return "file-pdf";
  if (["zip", "rar", "tar", "gz", "7z"].includes(ext)) return "file-zip";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(ext)) return "file-image";
  if (["mp3", "wav", "ogg", "flac", "m4a"].includes(ext)) return "file-audio";
  if (["mp4", "mkv", "mov", "avi", "webm"].includes(ext)) return "file-video";
  if (["js", "jsx", "ts", "tsx", "html", "css", "json", "py", "sh", "go", "cpp", "c", "cs", "java"].includes(ext)) return "file-code";
  return "file-default";
};

const getBorderClass = (fileClass: string) => {
  switch (fileClass) {
    case "file-pdf": return "border-l-red-500/40 hover:border-l-red-500";
    case "file-zip": return "border-l-purple-500/40 hover:border-l-purple-500";
    case "file-image": return "border-l-indigo-500/40 hover:border-l-indigo-500";
    case "file-audio": return "border-l-sky-500/40 hover:border-l-sky-500";
    case "file-video": return "border-l-pink-500/40 hover:border-l-pink-500";
    case "file-code": return "border-l-teal-500/40 hover:border-l-teal-500";
    default: return "border-l-slate-700 hover:border-l-slate-500";
  }
};

export default function ReceiveCard() {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [transfer, setTransfer] = useState<MockTransfer | null>(null);
  const [activeCode, setActiveCode] = useState<string>("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDeleted, setIsDeleted] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first input box on load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value.replace(/[^0-9a-zA-Z]/g, "").toUpperCase(); // Allow alphanumeric only
    if (!value) return;

    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1); // Get last typed char
    setCode(newCode);

    setError(null);

    // Shift focus to the next input box
    if (index < 5 && element.value !== "") {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      setError(null);
      if (code[index] === "") {
        // If empty, focus and clear the previous input box
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
          const newCode = [...code];
          newCode[index - 1] = "";
          setCode(newCode);
        }
      } else {
        // Clear current box
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/[^0-9a-zA-Z]/g, "").toUpperCase().substring(0, 6);
    if (pasteData.length === 6) {
      const newCode = pasteData.split("");
      setCode(newCode);
      inputRefs.current[5]?.focus();
      setError(null);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const enteredCode = code.join("");
    if (enteredCode.length < 6) {
      setError("Please enter the complete 6-character code.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: dbError } = await supabase
        .from("transfers")
        .select("*, transfer_files(*)")
        .eq("code", enteredCode)
        .gt("expires_at", new Date().toISOString())
        .maybeSingle();

      if (dbError) throw dbError;

      if (data) {
        setTransfer({
          id: data.id,
          files: data.transfer_files,
          expiresInMinutes: Math.max(0, Math.round((new Date(data.expires_at).getTime() - Date.now()) / 60000))
        });
        setActiveCode(enteredCode);
        setIsDeleted(false);
      } else {
        setError("Invalid transfer code. It may have expired or does not exist.");
      }
    } catch (err: any) {
      console.error("Fetch code error:", err);
      if (err.message && (err.message.includes("fetch") || err.message.includes("placeholder-url"))) {
        setError("Network error. Verify your Supabase environment keys are set in .env.local.");
      } else {
        setError("Failed to fetch transfer credentials from database.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Check if all fields are filled, auto-trigger check
  useEffect(() => {
    if (code.every((val) => val !== "") && code.length === 6 && !transfer) {
      handleSubmit();
    }
  }, [code, transfer]);

  // Real Supabase download and self-destruction
  const handleDownload = async () => {
    if (!transfer) return;
    setIsDownloading(true);
    setDownloadProgress(0);
    setError(null);

    try {
      let count = 0;
      for (const file of transfer.files) {
        // Download blob from bucket
        const { data, error: storageError } = await supabase.storage
          .from("quicksend-files")
          .download(file.storage_path);

        if (storageError) throw storageError;

        // Save locally
        const url = URL.createObjectURL(data);
        const link = document.createElement("a");
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        count++;
        setDownloadProgress(Math.round((count / transfer.files.length) * 100));
      }

      // --- IMMEDIATE SELF DESTRUCT TRIGGER ---
      // 1. Delete database rows (Cascades and deletes child file records automatically)
      const { error: dbDeleteError } = await supabase
        .from("transfers")
        .delete()
        .eq("id", transfer.id);

      if (dbDeleteError) console.error("Database self-destruct row cleanup failed:", dbDeleteError);

      // 2. Remove files from storage bucket
      const paths = transfer.files.map((f) => f.storage_path);
      const { error: storageDeleteError } = await supabase.storage
        .from("quicksend-files")
        .remove(paths);

      if (storageDeleteError) console.error("Storage self-destruct file cleanup failed:", storageDeleteError);

      setTimeout(() => {
        setIsDownloading(false);
        setIsDeleted(true);
        
        // Celebrate with confetti
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#6366f1", "#a855f7", "#0ea5e9"],
        });
      }, 500);

    } catch (err: any) {
      console.error("Download / deletion error details:", err);
      setError("Download failed. The file session may have expired or been deleted.");
      setIsDownloading(false);
    }
  };

  const resetReceive = () => {
    setCode(Array(6).fill(""));
    setTransfer(null);
    setActiveCode("");
    setError(null);
    setDownloadProgress(0);
    setIsDownloading(false);
    setIsDeleted(false);
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  };

  const totalFilesSize = transfer ? transfer.files.reduce((acc, f) => acc + f.size, 0) : 0;

  return (
    <div className="w-full flex flex-col items-center">
      {isDeleted ? (
        <div className="w-full flex flex-col items-center py-6 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-indigo-955 bg-indigo-950/40 border border-indigo-900/40 flex items-center justify-center mb-6 shadow-inner animate-pulse">
            <ShieldIcon className="text-3xl text-indigo-400" />
          </div>
          <h3 className="text-base font-bold text-slate-100 mb-1.5">
            Self-Destruct Triggered
          </h3>
          <p className="text-xs text-slate-400 max-w-[280px] font-semibold leading-relaxed mb-8">
            Your files were downloaded successfully, and the transfer package has been permanently deleted from our server database.
          </p>
          <button
            onClick={resetReceive}
            className="w-full max-w-xs h-12 rounded-2xl border border-slate-800 hover:border-slate-700 bg-slate-900/50 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            Enter Another Code
          </button>
        </div>
      ) : !transfer ? (
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center animate-fade-in">
          <p className="text-xs text-slate-400 text-center mb-6 max-w-xs font-semibold leading-relaxed">
            Enter the 6-digit key to retrieve the shared files.
          </p>

          {/* 6 Digit Inputs */}
          <div className="flex gap-2 justify-center mb-6 w-full max-w-xs">
            {code.map((char, index) => (
              <input
                key={index}
                type="text"
                inputMode="text"
                maxLength={1}
                value={char}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={index === 0 ? handlePaste : undefined}
                disabled={isLoading}
                className="w-11 h-13.5 md:w-13 md:h-15.5 text-center text-2xl font-black font-mono bg-slate-900 rounded-2xl border border-slate-800 focus:bg-slate-950 focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/50 focus:shadow-[0_0_15px_rgba(99,102,241,0.25)] outline-none text-white transition-all disabled:opacity-50 shadow-inner"
              />
            ))}
          </div>

          {/* Help Info with Mock Codes */}
          <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-2xl mb-6 text-center max-w-xs w-full shadow-inner">
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1.5">
              Try Demo Codes
            </p>
            <div className="flex justify-center gap-3 text-xs font-mono">
              <button
                type="button"
                onClick={() => setCode("A1B2C3".split(""))}
                className="px-3.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-[#6366f1] hover:border-[#6366f1]/35 transition-all cursor-pointer font-bold shadow-sm"
              >
                A1B2C3
              </button>
              <button
                type="button"
                onClick={() => setCode("X9Y8Z7".split(""))}
                className="px-3.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-[#6366f1] hover:border-[#6366f1]/35 transition-all cursor-pointer font-bold shadow-sm"
              >
                X9Y8Z7
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-[11px] font-bold text-rose-400 bg-rose-950/20 border border-rose-900/40 p-3.5 rounded-2xl w-full max-w-xs mb-4 text-center justify-center animate-shake">
              <ErrorOutlineIcon className="text-sm text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || code.some((val) => val === "")}
            className="w-full max-w-xs h-13.5 btn-premium rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <RefreshIcon className="animate-spin text-sm text-[#6366f1]" />
                <span>Locating package...</span>
              </div>
            ) : (
              <>
                <span>Retrieve Files</span>
                <ArrowForwardIcon className="text-sm" />
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="w-full flex flex-col animate-fade-in">
          {/* Back Button */}
          <button
            onClick={resetReceive}
            className="self-start text-[10px] text-slate-400 hover:text-[#6366f1] font-bold uppercase tracking-wider transition-colors flex items-center gap-1 mb-4"
          >
            <ArrowBackIcon className="text-sm" />
            <span>Enter another code</span>
          </button>

          {/* Details header */}
          <div className="flex justify-between items-end mb-4 border-b border-slate-800/80 pb-3">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Code: {activeCode.slice(0, 3)} {activeCode.slice(3)}
              </span>
              <h4 className="text-base font-black text-slate-100 mt-0.5">
                Ready to download
              </h4>
            </div>
            <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950/40 border border-indigo-900/40 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Expires in {transfer.expiresInMinutes}m
            </span>
          </div>

          {/* Self-Destruct Banner */}
          <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-300 bg-indigo-950/20 border border-indigo-900/30 p-3 rounded-2xl w-full mb-4 justify-center">
            <ShieldIcon className="text-sm text-indigo-400" />
            <span>Files will delete from the server immediately after download.</span>
          </div>

          {/* List of files */}
          <div className="max-h-60 overflow-y-auto pr-1 mb-6 custom-scrollbar space-y-2">
            {transfer.files.map((file, idx) => {
              const fileClass = getFileClass(file.name);
              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-2xl glass-card text-sm border-l-3 ${getBorderClass(fileClass)}`}
                >
                  <div className="flex items-center gap-3 overflow-hidden mr-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${fileClass}`}>
                      <InsertDriveFileIcon className="text-sm" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-slate-200 font-bold truncate text-xs">{file.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{formatBytes(file.size)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400 px-1 mb-6 font-bold">
            <span>{transfer.files.length} files</span>
            <span className="text-slate-200 font-mono font-bold">{formatBytes(totalFilesSize)}</span>
          </div>

          {isDownloading ? (
            <div className="w-full flex flex-col items-center">
              <div className="w-full bg-slate-800 h-1.5 rounded-full border border-slate-800/50 overflow-hidden mb-2">
                <div
                  style={{ width: `${downloadProgress}%` }}
                  className="h-full bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] rounded-full transition-all duration-150"
                />
              </div>
              <div className="flex justify-between w-full text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <span>Downloading bundle...</span>
                <span className="font-mono">{downloadProgress}%</span>
              </div>
            </div>
          ) : (
            <button
              onClick={handleDownload}
              className="w-full h-13.5 btn-premium rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 animate-fade-in"
            >
              <DownloadIcon className="text-sm animate-pulse" />
              <span>Download All Files</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
