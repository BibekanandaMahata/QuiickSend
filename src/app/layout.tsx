import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuickSend - Secure File Sharing",
  description: "Instant peer-to-peer file transfer",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-screen overflow-hidden flex flex-col bg-[#0b0f19] relative text-slate-100">
        {/* Global 5% Dark Tint Overlay Layer */}
        <div className="fixed inset-0 bg-black/5 pointer-events-none z-40" />
        <Header />
        <main className="flex-1 overflow-hidden relative w-full z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
