"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  Sparkles,
  Share2,
  Play,
  ArrowUp,
  Image as ImageIcon,
  AlertCircle,
  Minus,
  Plus,
  Maximize2,
  Moon,
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
  MousePointer,
  Hand,
  Check,
  Copy,
  X,
  Code2,
  ExternalLink,
  ShieldCheck,
  Zap,
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  BarChart3,
  Search,
  Bell,
  CheckCircle2,
} from "lucide-react";
import { getProjectByIdAction, saveProjectAction } from "@/app/actions/project";

interface ChatMessage {
  id: string;
  sender: "user" | "ai" | "system";
  content: string;
  timestamp: string;
  upgradePrompt?: boolean;
}

export default function SleekProjectBuilderPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = (params?.id as string) || "project";

  const [projectName, setProjectName] = useState("EDUCORE");
  const [activeTab, setActiveTab] = useState<"chat" | "theme">("chat");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [toolMode, setToolMode] = useState<"select" | "pan">("select");
  const [promptText, setPromptText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);

  // Initial chat history mimicking the reference screenshot
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg_1",
      sender: "user",
      content:
        "FINAL DELIVERABLE: A complete, cohesive, high-fidelity EDUCORE School Management System design in Sleek.design, including the public school website, authentication, Admin portal, Teacher portal, Student portal, Parent portal, reusable components, and all essential academic management screens and workflows.\n\nBuild the whole application now.",
      timestamp: "Just now",
    },
    {
      id: "msg_2",
      sender: "system",
      content: "Your screens are being designed. Upgrade to get access.",
      timestamp: "Just now",
      upgradePrompt: true,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  // Load project name from DB if available
  useEffect(() => {
    if (projectId && projectId !== "project") {
      getProjectByIdAction(projectId)
        .then((res) => {
          if (res?.success && res.data?.name) {
            setProjectName(res.data.name.toUpperCase());
          }
        })
        .catch(() => {});
    }
  }, [projectId]);

  // Handle Zoom controls
  const handleZoomIn = () => setZoom((prev) => Math.min(200, prev + 10));
  const handleZoomOut = () => setZoom((prev) => Math.max(50, prev - 10));
  const handleResetZoom = () => setZoom(100);

  // Send Prompt Handler
  const handleSendMessage = () => {
    const text = promptText.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: "user",
      content: text,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setPromptText("");
    setIsGenerating(true);

    setTimeout(() => {
      const aiReply: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        sender: "system",
        content: `Your new screens for "${text.slice(0, 45)}..." are synthesized. Upgrade to export high-resolution assets and live Next.js code.`,
        timestamp: "Just now",
        upgradePrompt: true,
      };
      setMessages((prev) => [...prev, aiReply]);
      setIsGenerating(false);
    }, 1400);
  };

  // Copy share URL
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0e0e0e] text-zinc-100 flex flex-col font-sans select-none selection:bg-[#f97316]/30">
      {/* ========================================================= */}
      {/* 1. TOP NAVBAR (HEADER)                                     */}
      {/* ========================================================= */}
      <header className="h-14 border-b border-white/[0.06] bg-[#121212] px-4 flex items-center justify-between z-30 shrink-0">
        {/* Left Side: Sleek Ribbon Logo & Brand Name */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            {/* Sleek Logo Icon: Stylized Orange S Ribbon */}
            <svg
              className="w-5 h-5 text-[#f97316] group-hover:scale-105 transition-transform"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8.5 4a4.5 4.5 0 0 0-4.5 4.5c0 2.5 2 4.5 4.5 4.5h7a2.5 2.5 0 1 1 0 5H6a1 1 0 1 0 0 2h9.5a4.5 4.5 0 0 0 4.5-4.5c0-2.5-2-4.5-4.5-4.5h-7a2.5 2.5 0 1 1 0-5H18a1 1 0 1 0 0-2H8.5z" />
            </svg>
            <span className="font-bold text-sm tracking-tight text-white">
              sleek.design
            </span>
          </Link>
        </div>

        {/* Center: Breadcrumb Navigation (Dashboard > EDUCORE) */}
        <div className="flex items-center gap-2 text-xs font-medium">
          <Link
            href="/dashboard"
            className="text-zinc-500 hover:text-zinc-300 transition"
          >
            Dashboard
          </Link>
          <span className="text-zinc-600 font-normal">&gt;</span>
          <span className="text-white font-semibold tracking-wide">
            {projectName}
          </span>
        </div>

        {/* Right Side: Tools, Actions & Avatar */}
        <div className="flex items-center gap-2.5">
          {/* Theme & Utility Icons */}
          <button
            title="Toggle theme"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
          <button
            title="Help & Shortcuts"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition"
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="w-3.5 h-3.5" />
            ) : (
              <PanelLeftOpen className="w-3.5 h-3.5" />
            )}
          </button>

          <div className="h-4 w-px bg-white/[0.08] mx-0.5" />

          {/* 1. Preview Button (Ghost button with icon) */}
          <button
            onClick={() => setActiveScreenIndex((prev) => (prev + 1) % 4)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#202020] hover:bg-[#282828] border border-white/[0.08] text-xs font-medium text-zinc-200 hover:text-white transition shadow-sm"
          >
            <Play className="w-3 h-3 text-zinc-400" />
            <span>Preview</span>
          </button>

          {/* 2. Share Button (Ghost button with icon) */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#202020] hover:bg-[#282828] border border-white/[0.08] text-xs font-medium text-zinc-200 hover:text-white transition shadow-sm"
          >
            <Share2 className="w-3 h-3 text-zinc-400" />
            <span>Share</span>
          </button>

          {/* 3. Export Button (Solid Orange background, white text) */}
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#f97316] hover:bg-[#ea580c] text-xs font-bold text-white shadow-md shadow-orange-600/25 transition"
          >
            <span>Export</span>
          </button>

          {/* 4. Upgrade Button (Solid White background, black text, spark icon) */}
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-zinc-200 text-xs font-bold text-black shadow-md transition"
          >
            <Sparkles className="w-3 h-3 text-black fill-black" />
            <span>Upgrade</span>
          </button>

          {/* User Avatar */}
          <div className="ml-1 flex items-center">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-7 h-7 rounded-full ring-2 ring-white/10",
                },
              }}
            />
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* WORKSPACE: LEFT SIDEBAR + CENTER CANVAS                   */}
      {/* ========================================================= */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ======================================================= */}
        {/* 2. LEFT SIDEBAR (THE AI CHAT INTERFACE)                 */}
        {/* ======================================================= */}
        {isSidebarOpen && (
          <aside className="w-[370px] bg-[#141414] border-r border-white/[0.06] flex flex-col justify-between h-full relative z-20 shrink-0">
            {/* Top Tabs: Chat and Theme */}
            <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`px-3.5 py-1 rounded-full text-xs font-semibold transition ${
                    activeTab === "chat"
                      ? "bg-[#262626] text-white shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Chat
                </button>
                <button
                  onClick={() => setActiveTab("theme")}
                  className={`px-3.5 py-1 rounded-full text-xs font-semibold transition ${
                    activeTab === "theme"
                      ? "bg-[#262626] text-white shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Theme
                </button>
              </div>

              {/* Sidebar toggle icon on tab row */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 rounded text-zinc-500 hover:text-zinc-300 transition"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>

            {/* Message Area (Scrollable flex-col) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
              {activeTab === "chat" ? (
                <>
                  {messages.map((msg) => (
                    <div key={msg.id} className="space-y-2">
                      {msg.sender === "user" ? (
                        /* User Message Bubble */
                        <div className="bg-[#202020] border border-white/[0.06] rounded-2xl p-4 text-zinc-200 leading-relaxed shadow-sm">
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      ) : (
                        /* AI System Message Card */
                        <div className="bg-[#181818] border border-white/[0.06] rounded-2xl p-4 flex flex-col gap-2.5 shadow-md">
                          <div className="flex items-center gap-2 text-white font-semibold text-xs">
                            <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0" />
                            <span>Upgrade required</span>
                          </div>
                          <p className="text-zinc-400 text-xs leading-relaxed">
                            {msg.content}
                          </p>
                          {msg.upgradePrompt && (
                            <button
                              onClick={() => setShowUpgradeModal(true)}
                              className="mt-1 px-4 py-1.5 rounded-lg bg-[#f97316] hover:bg-[#ea580c] text-white font-bold text-xs w-fit transition shadow-sm"
                            >
                              Upgrade
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Typing / Generating Indicator */}
                  {isGenerating && (
                    <div className="bg-[#181818] border border-white/[0.06] rounded-2xl p-4 flex items-center gap-2.5 text-zinc-400">
                      <div className="w-2 h-2 rounded-full bg-[#f97316] animate-ping" />
                      <span>Synthesizing high-fidelity screens...</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </>
              ) : (
                /* Theme Tab View */
                <div className="space-y-4 text-zinc-400">
                  <div className="p-3 rounded-xl bg-[#1a1a1a] border border-white/[0.06]">
                    <span className="text-white font-semibold block mb-2">
                      Color Palette
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="h-8 rounded-lg bg-[#f97316] border border-white/20" />
                      <div className="h-8 rounded-lg bg-[#121212] border border-white/20" />
                      <div className="h-8 rounded-lg bg-[#262626] border border-white/20" />
                      <div className="h-8 rounded-lg bg-[#ffffff] border border-white/20" />
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#1a1a1a] border border-white/[0.06]">
                    <span className="text-white font-semibold block mb-1">
                      Typography
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">
                      Geist Sans &bull; Inter &bull; JetBrains Mono
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Fixed Input (Prompt Area) */}
            <div className="p-3 bg-[#141414] border-t border-white/[0.06]">
              <div className="bg-[#1c1c1c] border border-white/[0.08] rounded-2xl p-3 flex flex-col gap-2.5 shadow-xl focus-within:border-white/20 transition-colors">
                <textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  rows={2}
                  placeholder="What do you want to design?"
                  className="w-full bg-transparent text-xs sm:text-[13px] text-white placeholder-zinc-500 focus:outline-none resize-none leading-relaxed"
                />

                <div className="flex items-center justify-between pt-1">
                  {/* Left: Media / Image attachment button */}
                  <button
                    type="button"
                    title="Upload image reference"
                    className="p-1 rounded text-zinc-500 hover:text-zinc-300 transition"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>

                  {/* Right: Circular Orange submit button with Upward Arrow */}
                  <button
                    onClick={handleSendMessage}
                    disabled={!promptText.trim() || isGenerating}
                    type="button"
                    title="Send message"
                    className="w-7 h-7 rounded-full bg-[#f97316] hover:bg-[#ea580c] disabled:opacity-40 disabled:hover:bg-[#f97316] flex items-center justify-center text-white transition shadow-md shadow-orange-600/30"
                  >
                    <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* ======================================================= */}
        {/* 3. CENTER CANVAS (THE MAIN WORKSPACE)                   */}
        {/* ======================================================= */}
        <main
          className="flex-1 h-full relative overflow-hidden bg-[#0a0a0a] flex items-center justify-center select-none cursor-default"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255, 255, 255, 0.10) 1.2px, transparent 1.2px)",
            backgroundSize: "24px 24px",
          }}
        >
          {/* Zoomable & Pannable Viewport */}
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-150 ease-out p-12 overflow-auto"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: "center center",
            }}
          >
            {/* High-Fidelity Sleek Design Artboard Presentation */}
            <div className="flex items-start gap-10">
              {/* Screen 1: Public Portal / Landing */}
              <div
                onClick={() => setActiveScreenIndex(0)}
                className={`w-[480px] rounded-2xl bg-[#121212] border transition-all duration-300 shadow-2xl overflow-hidden cursor-pointer ${
                  activeScreenIndex === 0
                    ? "border-[#f97316] ring-1 ring-[#f97316]/50 shadow-orange-950/20"
                    : "border-white/[0.08] hover:border-white/20"
                }`}
              >
                {/* Artboard Header */}
                <div className="px-4 py-3 bg-[#181818] border-b border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#f97316]" />
                    <span className="text-xs font-bold text-white tracking-wide">
                      EDUCORE &bull; Public School Portal
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Ready
                  </span>
                </div>

                {/* Artboard Screen Content */}
                <div className="p-6 space-y-5 bg-[#0e0e0e]">
                  {/* Hero Nav */}
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-[#f97316] flex items-center justify-center text-white text-[10px] font-black">
                        E
                      </div>
                      <span className="text-xs font-black text-white">EDUCORE ACADEMY</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                      <span>Admissions</span>
                      <span>Academics</span>
                      <button className="px-2.5 py-1 rounded bg-[#f97316] text-white font-bold">
                        Enroll
                      </button>
                    </div>
                  </div>

                  {/* Hero Headline */}
                  <div className="text-center py-4 space-y-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 border border-white/10 text-orange-300">
                      ✨ 2026-2027 Academic Registration Open
                    </span>
                    <h2 className="text-xl font-black text-white tracking-tight leading-snug">
                      Empowering Future Leaders with Excellence.
                    </h2>
                    <p className="text-[11px] text-zinc-400 max-w-xs mx-auto leading-relaxed">
                      World-class STEM curriculum, accredited faculty, and innovative digital classrooms.
                    </p>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="p-2.5 rounded-xl bg-[#161616] border border-white/[0.06] text-center">
                      <span className="text-sm font-black text-white block">99.4%</span>
                      <span className="text-[9px] text-zinc-500">Graduation</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#161616] border border-white/[0.06] text-center">
                      <span className="text-sm font-black text-orange-400 block">1:12</span>
                      <span className="text-[9px] text-zinc-500">Teacher Ratio</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#161616] border border-white/[0.06] text-center">
                      <span className="text-sm font-black text-white block">48+</span>
                      <span className="text-[9px] text-zinc-500">AP Courses</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Screen 2: Admin Portal / Dashboard */}
              <div
                onClick={() => setActiveScreenIndex(1)}
                className={`w-[480px] rounded-2xl bg-[#121212] border transition-all duration-300 shadow-2xl overflow-hidden cursor-pointer ${
                  activeScreenIndex === 1
                    ? "border-[#f97316] ring-1 ring-[#f97316]/50 shadow-orange-950/20"
                    : "border-white/[0.08] hover:border-white/20"
                }`}
              >
                {/* Artboard Header */}
                <div className="px-4 py-3 bg-[#181818] border-b border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-orange-400" />
                    <span className="text-xs font-bold text-white tracking-wide">
                      EDUCORE &bull; Admin Operations
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#f97316]/10 text-orange-400 border border-[#f97316]/20">
                    Live Sync
                  </span>
                </div>

                {/* Artboard Content */}
                <div className="p-6 space-y-4 bg-[#0e0e0e]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Campus Overview</h3>
                      <p className="text-[10px] text-zinc-500">Daily attendance & tuition metrics</p>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400 px-2 py-1 rounded bg-white/5 border border-white/10">
                      Term 1 &bull; Fall
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-[#161616] border border-white/[0.06]">
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                        <span>Total Students</span>
                        <Users className="w-3.5 h-3.5 text-indigo-400" />
                      </div>
                      <span className="text-lg font-black text-white">2,840</span>
                      <span className="text-[9px] text-emerald-400 block mt-0.5">
                        &uarr; 12% vs last semester
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#161616] border border-white/[0.06]">
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                        <span>Tuition Collected</span>
                        <Zap className="w-3.5 h-3.5 text-orange-400" />
                      </div>
                      <span className="text-lg font-black text-white">$1.48M</span>
                      <span className="text-[9px] text-emerald-400 block mt-0.5">
                        98.2% on-time rate
                      </span>
                    </div>
                  </div>

                  {/* Attendance Bar */}
                  <div className="p-3 rounded-xl bg-[#161616] border border-white/[0.06] space-y-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-zinc-400">Faculty & Student Attendance</span>
                      <span className="text-white font-bold">96.8%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full w-[96.8%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Screen 3: Student Portal */}
              <div
                onClick={() => setActiveScreenIndex(2)}
                className={`w-[480px] rounded-2xl bg-[#121212] border transition-all duration-300 shadow-2xl overflow-hidden cursor-pointer ${
                  activeScreenIndex === 2
                    ? "border-[#f97316] ring-1 ring-[#f97316]/50 shadow-orange-950/20"
                    : "border-white/[0.08] hover:border-white/20"
                }`}
              >
                {/* Artboard Header */}
                <div className="px-4 py-3 bg-[#181818] border-b border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white tracking-wide">
                      EDUCORE &bull; Student Dashboard
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Active
                  </span>
                </div>

                {/* Artboard Content */}
                <div className="p-6 space-y-4 bg-[#0e0e0e]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Alex Morgan</h4>
                      <p className="text-[10px] text-zinc-500">Grade 11 &bull; AP Honors Track</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-orange-400">3.94 GPA</span>
                      <span className="text-[9px] text-zinc-500 block">Class Rank: 4 / 280</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-[#161616] border border-white/[0.06] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-zinc-200">AP Computer Science A</span>
                      </div>
                      <span className="font-mono text-zinc-400 font-bold">98% (A+)</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#161616] border border-white/[0.06] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                        <span className="text-zinc-200">AP Physics C: Mechanics</span>
                      </div>
                      <span className="font-mono text-zinc-400 font-bold">94% (A)</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#161616] border border-white/[0.06] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-400" />
                        <span className="text-zinc-200">Calculus BC</span>
                      </div>
                      <span className="font-mono text-zinc-400 font-bold">92% (A-)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================= */}
          {/* FLOATING BOTTOM TOOLBAR                                 */}
          {/* ======================================================= */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
            <div className="bg-[#181818]/90 backdrop-blur-xl border border-white/[0.1] rounded-full px-3.5 py-1.5 flex items-center gap-3 text-xs text-zinc-300 shadow-2xl">
              {/* Tool Selection Icons */}
              <button
                onClick={() => setToolMode("select")}
                title="Select tool"
                className={`p-1.5 rounded-full transition ${
                  toolMode === "select"
                    ? "bg-white/10 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <MousePointer className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setToolMode("pan")}
                title="Pan hand tool"
                className={`p-1.5 rounded-full transition ${
                  toolMode === "pan"
                    ? "bg-white/10 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Hand className="w-3.5 h-3.5" />
              </button>

              <div className="w-px h-3.5 bg-white/10" />

              {/* Zoom Controls */}
              <button
                onClick={handleZoomOut}
                title="Zoom Out (-)"
                className="p-1 rounded text-zinc-400 hover:text-white transition"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleResetZoom}
                title="Reset to 100%"
                className="font-mono text-[11px] font-semibold text-zinc-200 hover:text-white px-1"
              >
                {zoom}%
              </button>

              <button
                onClick={handleZoomIn}
                title="Zoom In (+)"
                className="p-1 rounded text-zinc-400 hover:text-white transition"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>

              <div className="w-px h-3.5 bg-white/10" />

              {/* Fit / Layout Icon */}
              <button
                onClick={handleResetZoom}
                title="Fit to Screen"
                className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* ========================================================= */}
      {/* UPGRADE MODAL                                             */}
      {/* ========================================================= */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="flex flex-col w-full max-w-md bg-[#161616] border border-white/[0.12] rounded-3xl p-6 shadow-2xl relative text-left">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-10 h-10 rounded-2xl bg-[#f97316]/20 border border-[#f97316]/30 flex items-center justify-center text-[#f97316] mb-4 shadow-lg shadow-orange-600/20">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>

            <h3 className="text-xl font-black text-white tracking-tight mb-1">
              Unlock Full Sleek Access
            </h3>
            <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
              Export production-ready Next.js code, customize component tokens, and collaborate with unlimited screens.
            </p>

            <div className="p-4 rounded-2xl bg-[#1f1f1f] border border-white/[0.08] mb-6 space-y-2.5">
              <div className="flex items-center gap-2 text-xs text-zinc-200">
                <CheckCircle2 className="w-4 h-4 text-[#f97316] shrink-0" />
                <span>Unlimited High-Fidelity UI Screens</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-200">
                <CheckCircle2 className="w-4 h-4 text-[#f97316] shrink-0" />
                <span>Tailwind CSS &amp; React Code Exports</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-200">
                <CheckCircle2 className="w-4 h-4 text-[#f97316] shrink-0" />
                <span>Live Interactive Prototype Previews</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-2xl font-black text-white">$29</span>
                <span className="text-xs text-zinc-500 font-medium"> / month</span>
              </div>
              <button
                onClick={() => {
                  alert("Upgrade successful! All screens are now unlocked.");
                  setShowUpgradeModal(false);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#f97316] hover:bg-[#ea580c] text-white text-xs font-bold shadow-lg shadow-orange-600/30 transition"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* EXPORT MODAL                                              */}
      {/* ========================================================= */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="flex flex-col w-full max-w-xl bg-[#161616] border border-white/[0.12] rounded-3xl p-6 shadow-2xl relative text-left">
            <button
              onClick={() => setShowExportModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-[#f97316] flex items-center justify-center">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Export Application Code</h3>
                <p className="text-[11px] text-zinc-400">Next.js 16 &bull; Tailwind CSS &bull; TypeScript</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/[0.08] font-mono text-[11px] text-zinc-300 overflow-x-auto max-h-64 leading-relaxed mb-6">
              <pre>{`// EDUCORE School Management System
// Generated by Sleek.design AI Engine

import React from "react";

export default function EducoreApp() {
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white">
      {/* Public School Website, Admin Portal, Student Portal */}
      <header className="h-16 border-b border-white/10 px-6 flex items-center">
        <h1 className="font-black text-lg text-[#f97316]">EDUCORE</h1>
      </header>
    </div>
  );
}`}</pre>
            </div>

            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`// EDUCORE School Management System`);
                  alert("Code copied to clipboard!");
                  setShowExportModal(false);
                }}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-[#f97316] hover:bg-[#ea580c] text-white shadow-lg transition"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Toast */}
      {showShareToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-black text-xs font-bold shadow-2xl animate-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Project share link copied to clipboard!</span>
        </div>
      )}
    </div>
  );
}
