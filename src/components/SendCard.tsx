"use client";

import React, { useState, useRef, useEffect } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import QrCodeIcon from "@mui/icons-material/QrCode";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined";
import QRCode from "qrcode";
import confetti from "canvas-confetti";
import { formatBytes } from "@/utils/format";
import { supabase } from "@/utils/supabase";

type ExpiryOption = "10m" | "1h" | "24h";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

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

export default function SendCard() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "listing" | "uploading" | "success">("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Initializing connection...");
  const [expiry, setExpiry] = useState<ExpiryOption>("10m");
  const [generatedCode, setGeneratedCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Handle countdown timer
  useEffect(() => {
    if (status === "success" && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setStatus("idle");
            setFiles([]);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, timeLeft]);

  // Generate QR Code when code changes or QR is shown
  useEffect(() => {
    if (status === "success" && generatedCode && qrCanvasRef.current) {
      const shareUrl = `${window.location.origin}?code=${generatedCode}`;
      QRCode.toCanvas(
        qrCanvasRef.current,
        shareUrl,
        {
          width: 130,
          margin: 1,
          color: {
            dark: "#030014", // space violet background modules
            light: "#ffffff",
          },
        },
        (error) => {
          if (error) console.error("QR Code generation error:", error);
        }
      );
    }
  }, [status, generatedCode, showQr]);

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      
      // Enforce 10MB limit per file
      const largeFile = newFiles.find((f) => f.size > MAX_FILE_SIZE);
      if (largeFile) {
        setError(`File "${largeFile.name}" exceeds the 10MB size limit.`);
        return;
      }
      
      setError(null);
      setFiles((prev) => [...prev, ...newFiles]);
      setStatus("listing");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Enforce 10MB limit per file
      const largeFile = newFiles.find((f) => f.size > MAX_FILE_SIZE);
      if (largeFile) {
        setError(`File "${largeFile.name}" exceeds the 10MB size limit.`);
        return;
      }
      
      setError(null);
      setFiles((prev) => [...prev, ...newFiles]);
      setStatus("listing");
    }
  };

  const removeFile = (index: number) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
    if (updated.length === 0) {
      setStatus("idle");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);

  // Real Supabase upload process
  const startUpload = async () => {
    setStatus("uploading");
    setUploadProgress(0);
    setError(null);
    setStatusMessage("Connecting to secure server...");

    try {
      // 1. Generate unique 6-character alphanumeric code
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let code = "";
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      // 2. Setup expiry duration
      const seconds = expiry === "10m" ? 600 : expiry === "1h" ? 3600 : 86400;
      const expiresAt = new Date(Date.now() + seconds * 1000).toISOString();

      setStatusMessage("Creating secure package session...");
      setUploadProgress(15);

      // 3. Insert metadata record in transfers table
      const { data: transfer, error: dbError } = await supabase
        .from("transfers")
        .insert({ code, expires_at: expiresAt })
        .select()
        .single();

      if (dbError) throw dbError;

      // 4. Loop upload files
      let uploadedCount = 0;
      for (const file of files) {
        setStatusMessage(`Uploading ${file.name}...`);
        
        const storagePath = `${code}/${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("quicksend-files")
          .upload(storagePath, file);

        if (uploadError) throw uploadError;

        // Save file record reference
        const { error: fileError } = await supabase
          .from("transfer_files")
          .insert({
            transfer_id: transfer.id,
            name: file.name,
            size: file.size,
            type: file.type,
            storage_path: storagePath
          });

        if (fileError) throw fileError;

        uploadedCount++;
        // Scale progress from 15% to 90% based on how many files uploaded
        setUploadProgress(15 + Math.round((uploadedCount / files.length) * 75));
      }

      setUploadProgress(95);
      setStatusMessage("Finalizing package credentials...");

      setTimeout(() => {
        setGeneratedCode(code);
        setTimeLeft(seconds);
        setUploadProgress(100);
        setStatus("success");

        // Celebrate with confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#6366f1", "#a855f7", "#0ea5e9"],
        });
      }, 800);

    } catch (err: any) {
      console.error("Upload error details:", err);
      // Determine user friendly messages if they didn't fill credentials
      if (err.message && (err.message.includes("fetch") || err.message.includes("placeholder-url"))) {
        setError("Network error. Please confirm your Supabase project keys are configured in .env.local.");
      } else {
        setError(err.message || "Failed to upload files. Check your bucket RLS settings and try again.");
      }
      setStatus("idle");
      setFiles([]);
    }
  };

  // Format time remaining
  const formatTimeLeft = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    
    if (h > 0) {
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const getShareLink = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}?code=${generatedCode}`;
    }
    return "";
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(getShareLink());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {error && (
        <div className="flex items-center gap-2 text-[11px] font-bold text-rose-400 bg-rose-955 bg-rose-955 bg-rose-950/20 border border-rose-900/40 p-3.5 rounded-2xl w-full max-w-xs mb-4 text-center justify-center animate-shake">
          <ErrorOutlineIcon className="text-sm text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {status === "idle" && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`w-full border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 group relative overflow-hidden ${
            dragActive
              ? "border-[#6366f1] bg-[#6366f1]/5 shadow-[0_0_40px_rgba(99,102,241,0.06)] scale-[0.99]"
              : "border-slate-800 hover:border-[#6366f1] hover:bg-slate-800/10 shadow-sm"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            className="hidden"
          />
          <div className="w-18 h-18 rounded-2xl bg-slate-900 flex items-center justify-center mb-6 border border-slate-800 shadow-sm group-hover:scale-105 transition-all duration-300">
            <CloudUploadIcon 
              className={`text-3xl transition-all duration-300 ${
                dragActive 
                  ? "text-[#6366f1] scale-110 animate-bounce" 
                  : "text-slate-550 text-slate-500 group-hover:text-[#6366f1]"
              }`} 
            />
          </div>
          <h3 className="text-base font-bold mb-1.5 text-slate-100">
            Drag & drop files here
          </h3>
          <p className="text-xs text-slate-400 text-center max-w-[260px] font-semibold leading-relaxed">
            or click to browse your files. Packages up to 10MB are supported.
          </p>
        </div>
      )}

      {status === "listing" && (
        <div className="w-full flex flex-col animate-fade-in">
          <div className="flex justify-between items-center mb-4 px-1">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Selected files ({files.length})
            </h4>
            <button
              onClick={() => {
                setFiles([]);
                setStatus("idle");
                setError(null);
              }}
              className="text-xs font-bold text-slate-400 hover:text-[#6366f1] transition-colors cursor-pointer"
            >
              Clear all
            </button>
          </div>

          {/* Files container */}
          <div className="max-h-60 overflow-y-auto pr-1 mb-6 custom-scrollbar space-y-2">
            {files.map((file, idx) => {
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
                  <button
                    onClick={() => removeFile(idx)}
                    className="p-1 rounded-full text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-all flex-shrink-0 cursor-pointer"
                  >
                    <CloseIcon className="text-sm" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Expiry Selector and Submit */}
          <div className="flex flex-col gap-4 border-t border-slate-800/60 pt-5">
            <div className="flex justify-between items-center bg-slate-950 p-3 rounded-2xl border border-slate-800/80 shadow-inner">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider pl-1">Expiration</span>
              <div className="flex gap-1">
                {(["10m", "1h", "24h"] as ExpiryOption[]).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setExpiry(opt)}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-xl transition-all cursor-pointer ${
                      expiry === opt
                        ? "bg-slate-900 text-[#6366f1] border border-slate-800 shadow-sm"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                    }`}
                  >
                    {opt === "10m" ? "10 Mins" : opt === "1h" ? "1 Hour" : "24 Hours"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400 px-1 font-bold">
              <span>Total payload</span>
              <span className="text-slate-200 font-mono font-bold">{formatBytes(totalSize)}</span>
            </div>

            <button
              onClick={startUpload}
              className="w-full h-13.5 btn-premium rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 group"
            >
              <span>Send Securely</span>
              <ArrowForwardIcon className="text-sm group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {status === "uploading" && (
        <div className="w-full flex flex-col py-6 items-center text-center animate-fade-in">
          <div className="relative w-28 h-28 flex items-center justify-center mb-6">
            {/* Progress Circular visual */}
            <svg className="w-full h-full transform -rotate-90">
              <defs>
                <linearGradient id="uploadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--accent)" />
                  <stop offset="100%" stopColor="var(--accent-secondary)" />
                </linearGradient>
              </defs>
              <circle
                cx="56"
                cy="56"
                r="48"
                className="stroke-slate-800 fill-none"
                strokeWidth="5"
              />
              <circle
                cx="56"
                cy="56"
                r="48"
                stroke="url(#uploadGrad)"
                className="fill-none transition-all duration-300 drop-shadow-[0_2px_4px_rgba(99,102,241,0.15)]"
                strokeWidth="5"
                strokeDasharray={2 * Math.PI * 48}
                strokeDashoffset={2 * Math.PI * 48 * (1 - uploadProgress / 100)}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-2xl font-black text-slate-100 font-mono">
              {uploadProgress}%
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-200 mb-1.5">
            Uploading Transfer Package
          </h3>
          <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase animate-pulse">
            {statusMessage}
          </p>

          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-8 border border-slate-800/50 overflow-hidden shadow-inner">
            <div
              style={{ width: `${uploadProgress}%` }}
              className="h-full bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] rounded-full transition-all duration-300"
            />
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="w-full flex flex-col items-center py-2 animate-fade-in">
          {/* Main Key Display inside a glowing glass bubble */}
          <div className="bg-slate-950 w-full rounded-3xl p-6 border border-slate-800/80 shadow-inner flex flex-col items-center justify-center relative overflow-hidden mb-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(99,102,241,0.06),transparent_70%)] pointer-events-none" />
            
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2">
              Share 6-Digit Code
            </span>
            
            <div className="flex items-center gap-3 relative z-10">
              <span className="text-4xl md:text-5xl font-black font-mono tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] drop-shadow-[0_2px_4px_rgba(99,102,241,0.1)]">
                {generatedCode.slice(0, 3)} {generatedCode.slice(3)}
              </span>
              <button
                onClick={copyCodeToClipboard}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-[#6366f1] active:scale-95 transition-all text-slate-400 cursor-pointer shadow-sm"
              >
                {copiedCode ? <CheckIcon className="text-emerald-500 text-sm" /> : <ContentCopyIcon className="text-sm" />}
              </button>
            </div>
            
            <p className="text-[10px] text-slate-400 mt-4 flex items-center gap-1.5 font-bold uppercase tracking-wider">
              <AccessTimeIcon className="text-xs text-[#6366f1]" />
              Expires in <span className="font-mono text-slate-200 font-black">{formatTimeLeft(timeLeft)}</span>
            </p>
          </div>

          {/* Sharing Tools */}
          <div className="w-full flex flex-col gap-3">


            {/* QR Toggle Button */}
            <div className="w-full flex flex-col items-center">
              <button
                onClick={() => setShowQr(!showQr)}
                className="text-[11px] text-slate-400 hover:text-slate-250 hover:text-slate-200 font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 py-2 cursor-pointer"
              >
                <QrCodeIcon className="text-sm text-[#6366f1]" />
                <span>{showQr ? "Hide QR Code" : "Show QR Code"}</span>
              </button>

              {showQr && (
                <div className="mt-2.5 p-3 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col items-center shadow-md animate-scale-up">
                  <div className="p-2.5 bg-white rounded-2xl border border-slate-900/85 shadow-sm">
                    <canvas ref={qrCanvasRef} className="w-[130px] h-[130px] block" />
                  </div>
                  <p className="text-[9px] text-slate-400 mt-2.5 font-bold uppercase tracking-wider">
                    Scan on mobile to download
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setFiles([]);
                setStatus("idle");
                setError(null);
              }}
              className="mt-3 w-full h-12 rounded-2xl border border-slate-800 hover:border-slate-700 bg-slate-900/50 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              Send Another File
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
