"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
  Sun,
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
  MousePointer,
  Hand,
  Check,
  Copy,
  X,
  Code2,
  Zap,
  GraduationCap,
  Users,
  BookOpen,
  BarChart3,
  CheckCircle2,
  Palette,
  Grid,
} from "lucide-react";
import { getProjectByIdAction } from "@/app/actions/project";
import { useTheme } from "@/context/ThemeContext";

interface ChatMessage {
  id: string;
  sender: "user" | "ai" | "system";
  content: string;
  timestamp: string;
  upgradePrompt?: boolean;
}

type ThemeMode = "dark" | "light";
type AccentKey = "orange" | "indigo" | "emerald" | "violet";

interface AccentConfig {
  name: string;
  primary: string;
  hover: string;
  shadow: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

const ACCENT_PALETTES: Record<AccentKey, AccentConfig> = {
  orange: {
    name: "Sleek Orange",
    primary: "#f97316",
    hover: "#ea580c",
    shadow: "rgba(249, 115, 22, 0.3)",
    badgeBg: "rgba(249, 115, 22, 0.12)",
    badgeText: "#fb923c",
    badgeBorder: "rgba(249, 115, 22, 0.25)",
  },
  indigo: {
    name: "Modern Indigo",
    primary: "#6366f1",
    hover: "#4f46e5",
    shadow: "rgba(99, 102, 241, 0.3)",
    badgeBg: "rgba(99, 102, 241, 0.12)",
    badgeText: "#818cf8",
    badgeBorder: "rgba(99, 102, 241, 0.25)",
  },
  emerald: {
    name: "Emerald Green",
    primary: "#10b981",
    hover: "#059669",
    shadow: "rgba(16, 185, 129, 0.3)",
    badgeBg: "rgba(16, 185, 129, 0.12)",
    badgeText: "#34d399",
    badgeBorder: "rgba(16, 185, 129, 0.25)",
  },
  violet: {
    name: "Neon Violet",
    primary: "#8b5cf6",
    hover: "#7c3aed",
    shadow: "rgba(139, 92, 246, 0.3)",
    badgeBg: "rgba(139, 92, 246, 0.12)",
    badgeText: "#a78bfa",
    badgeBorder: "rgba(139, 92, 246, 0.25)",
  },
};

export default function SleekProjectBuilderPage() {
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

  const { theme, isDark, toggleTheme, setTheme } = useTheme();
  const [accent, setAccent] = useState<AccentKey>("orange");
  const [showDotGrid, setShowDotGrid] = useState(true);

  const currentAccent = ACCENT_PALETTES[accent];

  // Sync accent with localStorage
  useEffect(() => {
    try {
      const savedAccent = localStorage.getItem("vasco_accent") as AccentKey | null;
      if (savedAccent && ACCENT_PALETTES[savedAccent]) {
        setAccent(savedAccent);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleSelectAccent = (key: AccentKey) => {
    setAccent(key);
    try {
      localStorage.setItem("vasco_accent", key);
    } catch {
      // Ignore
    }
  };

  // Initial chat history mimicking the reference screenshot
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg_1",
      sender: "user",
      content:
        "FINAL DELIVERABLE: A complete, cohesive, high-fidelity EDUCORE School Management System design in Vasco Studio, including the public school website, authentication, Admin portal, Teacher portal, Student portal, Parent portal, reusable components, and all essential academic management screens and workflows.\n\nBuild the whole application now.",
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  // Load project name from DB
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

  // Zoom controls
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
        content: `Your new screens for "${text.slice(0, 42)}..." are synthesized. Upgrade to export high-resolution assets and live Next.js code.`,
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
    <div
      className={`h-screen w-screen overflow-hidden flex flex-col font-sans select-none transition-colors duration-200 ${
        isDark ? "bg-[#0a0a0a] text-zinc-100" : "bg-[#f8fafc] text-zinc-900"
      }`}
      style={
        {
          "--selection-color": currentAccent.badgeBg,
        } as React.CSSProperties
      }
    >
      {/* ========================================================= */}
      {/* 1. TOP NAVBAR (HEADER)                                     */}
      {/* ========================================================= */}
      <header
        className={`h-14 px-4 flex items-center justify-between z-30 shrink-0 border-b transition-colors duration-200 ${
          isDark
            ? "bg-[#121212] border-white/[0.08]"
            : "bg-[#ffffff] border-zinc-200 shadow-sm"
        }`}
      >
        {/* Left Side: VASCO Studio Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition">
              <Sparkles className="w-4 h-4" />
            </div>
            <span
              className={`font-extrabold text-base tracking-tight ${
                isDark ? "text-white" : "text-zinc-900"
              }`}
            >
              VASCO
            </span>
          </Link>
        </div>

        {/* Center: Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-medium">
          <Link
            href="/dashboard"
            className={`transition ${
              isDark
                ? "text-zinc-500 hover:text-zinc-300"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            Dashboard
          </Link>
          <span
            className={`font-normal ${
              isDark ? "text-zinc-600" : "text-zinc-300"
            }`}
          >
            &gt;
          </span>
          <span
            className={`font-semibold tracking-wide ${
              isDark ? "text-white" : "text-zinc-900"
            }`}
          >
            {projectName}
          </span>
        </div>

        {/* Right Side: Tools, Actions & Avatar */}
        <div className="flex items-center gap-2.5">
          {/* THEME TOGGLE BUTTON (Dark / Light) */}
          <button
            onClick={toggleTheme}
            title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
            className={`p-1.5 rounded-lg transition ${
              isDark
                ? "text-zinc-400 hover:text-white hover:bg-white/10"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            {isDark ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-indigo-600" />
            )}
          </button>

          {/* Help Button */}
          <button
            title="Help & Shortcuts"
            className={`p-1.5 rounded-lg transition ${
              isDark
                ? "text-zinc-400 hover:text-white hover:bg-white/10"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            className={`p-1.5 rounded-lg transition ${
              isDark
                ? "text-zinc-400 hover:text-white hover:bg-white/10"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="w-3.5 h-3.5" />
            ) : (
              <PanelLeftOpen className="w-3.5 h-3.5" />
            )}
          </button>

          <div
            className={`h-4 w-px mx-0.5 ${
              isDark ? "bg-white/[0.08]" : "bg-zinc-200"
            }`}
          />

          {/* 1. Preview Button */}
          <button
            onClick={() => setActiveScreenIndex((prev) => (prev + 1) % 3)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition shadow-sm ${
              isDark
                ? "bg-[#202020] hover:bg-[#282828] border-white/[0.08] text-zinc-200 hover:text-white"
                : "bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700 hover:text-zinc-900"
            }`}
          >
            <Play className="w-3 h-3 text-zinc-400" />
            <span>Preview</span>
          </button>

          {/* 2. Share Button */}
          <button
            onClick={handleShare}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition shadow-sm ${
              isDark
                ? "bg-[#202020] hover:bg-[#282828] border-white/[0.08] text-zinc-200 hover:text-white"
                : "bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700 hover:text-zinc-900"
            }`}
          >
            <Share2 className="w-3 h-3 text-zinc-400" />
            <span>Share</span>
          </button>

          {/* 3. Export Button (Solid Accent Color) */}
          <button
            onClick={() => setShowExportModal(true)}
            style={{
              backgroundColor: currentAccent.primary,
              boxShadow: `0 4px 14px ${currentAccent.shadow}`,
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white transition hover:opacity-90"
          >
            <span>Export</span>
          </button>

          {/* 4. Upgrade Button (Solid Pill) */}
          <button
            onClick={() => setShowUpgradeModal(true)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md transition ${
              isDark
                ? "bg-white hover:bg-zinc-200 text-black"
                : "bg-zinc-900 hover:bg-zinc-800 text-white"
            }`}
          >
            <Sparkles className="w-3 h-3 fill-current" />
            <span>Upgrade</span>
          </button>

          {/* User Avatar */}
          <div className="ml-1 flex items-center">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: `w-7 h-7 rounded-full ring-2 ${
                    isDark ? "ring-white/10" : "ring-zinc-200"
                  }`,
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
        {/* 2. LEFT SIDEBAR (THE AI CHAT & THEME INTERFACE)         */}
        {/* ======================================================= */}
        {isSidebarOpen && (
          <aside
            className={`w-[370px] border-r flex flex-col justify-between h-full relative z-20 shrink-0 transition-colors duration-200 ${
              isDark
                ? "bg-[#141414] border-white/[0.08]"
                : "bg-[#ffffff] border-zinc-200 shadow-sm"
            }`}
          >
            {/* Top Tabs: Chat and Theme */}
            <div
              className={`px-4 py-3 border-b flex items-center justify-between ${
                isDark ? "border-white/[0.08]" : "border-zinc-200"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`px-3.5 py-1 rounded-full text-xs font-semibold transition ${
                    activeTab === "chat"
                      ? isDark
                        ? "bg-[#262626] text-white shadow-sm"
                        : "bg-zinc-900 text-white shadow-sm"
                      : isDark
                      ? "text-zinc-500 hover:text-zinc-300"
                      : "text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  Chat
                </button>
                <button
                  onClick={() => setActiveTab("theme")}
                  className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold transition ${
                    activeTab === "theme"
                      ? isDark
                        ? "bg-[#262626] text-white shadow-sm"
                        : "bg-zinc-900 text-white shadow-sm"
                      : isDark
                      ? "text-zinc-500 hover:text-zinc-300"
                      : "text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  <Palette className="w-3 h-3" />
                  <span>Theme</span>
                </button>
              </div>

              {/* Sidebar toggle icon */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className={`p-1 rounded transition ${
                  isDark
                    ? "text-zinc-500 hover:text-zinc-300"
                    : "text-zinc-400 hover:text-zinc-700"
                }`}
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>

            {/* TAB CONTENT: Chat View OR Theme Settings View */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
              {activeTab === "chat" ? (
                <>
                  {messages.map((msg) => (
                    <div key={msg.id} className="space-y-2">
                      {msg.sender === "user" ? (
                        /* User Message Bubble */
                        <div
                          className={`rounded-2xl p-4 leading-relaxed border transition shadow-sm ${
                            isDark
                              ? "bg-[#202020] border-white/[0.08] text-zinc-200"
                              : "bg-zinc-100 border-zinc-200 text-zinc-800"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      ) : (
                        /* AI System Message Card */
                        <div
                          className={`rounded-2xl p-4 flex flex-col gap-2.5 border transition shadow-md ${
                            isDark
                              ? "bg-[#181818] border-white/[0.08]"
                              : "bg-zinc-50 border-zinc-200"
                          }`}
                        >
                          <div
                            className={`flex items-center gap-2 font-semibold text-xs ${
                              isDark ? "text-white" : "text-zinc-900"
                            }`}
                          >
                            <AlertCircle
                              className="w-4 h-4 shrink-0"
                              style={{ color: currentAccent.primary }}
                            />
                            <span>Upgrade required</span>
                          </div>
                          <p
                            className={`text-xs leading-relaxed ${
                              isDark ? "text-zinc-400" : "text-zinc-600"
                            }`}
                          >
                            {msg.content}
                          </p>
                          {msg.upgradePrompt && (
                            <button
                              onClick={() => setShowUpgradeModal(true)}
                              style={{
                                backgroundColor: currentAccent.primary,
                                boxShadow: `0 2px 10px ${currentAccent.shadow}`,
                              }}
                              className="mt-1 px-4 py-1.5 rounded-lg text-white font-bold text-xs w-fit transition hover:opacity-90"
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
                    <div
                      className={`rounded-2xl p-4 flex items-center gap-2.5 border ${
                        isDark
                          ? "bg-[#181818] border-white/[0.08] text-zinc-400"
                          : "bg-zinc-50 border-zinc-200 text-zinc-600"
                      }`}
                    >
                      <div
                        className="w-2 h-2 rounded-full animate-ping"
                        style={{ backgroundColor: currentAccent.primary }}
                      />
                      <span>Synthesizing high-fidelity screens...</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </>
              ) : (
                /* ============================================== */
                /* THEME CUSTOMIZER TAB                            */
                /* ============================================== */
                <div className="space-y-5">
                  {/* Mode Selector: Dark vs Light */}
                  <div>
                    <label
                      className={`block text-[11px] font-bold uppercase tracking-wider mb-2.5 ${
                        isDark ? "text-zinc-400" : "text-zinc-600"
                      }`}
                    >
                      Appearance Mode
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Dark Mode Card */}
                      <button
                        onClick={() => {
                          setTheme("dark");
                          localStorage.setItem("sleek_theme", "dark");
                        }}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition cursor-pointer ${
                          isDark
                            ? "bg-[#202020] border-white/20 ring-1 ring-white/20"
                            : "bg-zinc-100 border-zinc-200 hover:bg-zinc-200/60"
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#0e0e0e] border border-white/10 flex items-center justify-center text-amber-400">
                          <Moon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div
                            className={`text-xs font-bold ${
                              isDark ? "text-white" : "text-zinc-700"
                            }`}
                          >
                            Dark Mode
                          </div>
                          <span className="text-[10px] text-zinc-500">
                            Deep sleek gray
                          </span>
                        </div>
                        {isDark && (
                          <Check className="w-3.5 h-3.5 ml-auto text-emerald-400" />
                        )}
                      </button>

                      {/* Light Mode Card */}
                      <button
                        onClick={() => {
                          setTheme("light");
                          localStorage.setItem("sleek_theme", "light");
                        }}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition cursor-pointer ${
                          !isDark
                            ? "bg-white border-zinc-400 ring-1 ring-zinc-400 shadow-sm"
                            : "bg-[#181818] border-white/[0.08] hover:bg-white/5"
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-zinc-100 border border-zinc-300 flex items-center justify-center text-indigo-600">
                          <Sun className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div
                            className={`text-xs font-bold ${
                              !isDark ? "text-zinc-900" : "text-zinc-400"
                            }`}
                          >
                            Light Mode
                          </div>
                          <span className="text-[10px] text-zinc-500">
                            Clean crisp white
                          </span>
                        </div>
                        {!isDark && (
                          <Check className="w-3.5 h-3.5 ml-auto text-emerald-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Brand Accent Selector */}
                  <div>
                    <label
                      className={`block text-[11px] font-bold uppercase tracking-wider mb-2.5 ${
                        isDark ? "text-zinc-400" : "text-zinc-600"
                      }`}
                    >
                      Brand Accent Color
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(Object.keys(ACCENT_PALETTES) as AccentKey[]).map((key) => {
                        const pal = ACCENT_PALETTES[key];
                        const isSelected = accent === key;
                        return (
                          <button
                            key={key}
                            onClick={() => handleSelectAccent(key)}
                            className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition cursor-pointer ${
                              isSelected
                                ? isDark
                                  ? "bg-[#202020] border-white/20"
                                  : "bg-white border-zinc-400 shadow-sm"
                                : isDark
                                ? "bg-[#181818] border-white/[0.08] hover:bg-white/5"
                                : "bg-zinc-50 border-zinc-200 hover:bg-zinc-100"
                            }`}
                          >
                            <div
                              className="w-5 h-5 rounded-full shadow-inner flex items-center justify-center text-white"
                              style={{ backgroundColor: pal.primary }}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span
                              className={`text-xs font-semibold ${
                                isDark ? "text-zinc-200" : "text-zinc-800"
                              }`}
                            >
                              {pal.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Canvas Grid Options */}
                  <div
                    className={`p-3.5 rounded-2xl border space-y-3 ${
                      isDark
                        ? "bg-[#181818] border-white/[0.08]"
                        : "bg-zinc-50 border-zinc-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Grid
                          className="w-4 h-4"
                          style={{ color: currentAccent.primary }}
                        />
                        <span
                          className={`text-xs font-bold ${
                            isDark ? "text-white" : "text-zinc-900"
                          }`}
                        >
                          Canvas Dot-Grid
                        </span>
                      </div>
                      <button
                        onClick={() => setShowDotGrid(!showDotGrid)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition ${
                          showDotGrid
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-zinc-500/10 text-zinc-500 border-zinc-500/30"
                        }`}
                      >
                        {showDotGrid ? "Active" : "Hidden"}
                      </button>
                    </div>
                    <p
                      className={`text-[11px] leading-relaxed ${
                        isDark ? "text-zinc-400" : "text-zinc-500"
                      }`}
                    >
                      Subtle background grid coordinates for precise spatial layout alignment.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Fixed Input (Prompt Area) */}
            <div
              className={`p-3 border-t transition-colors ${
                isDark
                  ? "bg-[#141414] border-white/[0.08]"
                  : "bg-[#ffffff] border-zinc-200"
              }`}
            >
              <div
                className={`border rounded-2xl p-3 flex flex-col gap-2.5 shadow-xl transition-colors ${
                  isDark
                    ? "bg-[#1c1c1c] border-white/[0.08] focus-within:border-white/20"
                    : "bg-zinc-50 border-zinc-300 focus-within:border-zinc-400"
                }`}
              >
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
                  className={`w-full bg-transparent text-xs sm:text-[13px] placeholder-zinc-500 focus:outline-none resize-none leading-relaxed ${
                    isDark ? "text-white" : "text-zinc-900"
                  }`}
                />

                <div className="flex items-center justify-between pt-1">
                  {/* Left: Media / Image attachment button */}
                  <button
                    type="button"
                    title="Upload image reference"
                    className={`p-1 rounded transition ${
                      isDark
                        ? "text-zinc-500 hover:text-zinc-300"
                        : "text-zinc-400 hover:text-zinc-700"
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>

                  {/* Right: Circular Accent submit button with Upward Arrow */}
                  <button
                    onClick={handleSendMessage}
                    disabled={!promptText.trim() || isGenerating}
                    type="button"
                    title="Send message"
                    style={{
                      backgroundColor: currentAccent.primary,
                      boxShadow: `0 2px 10px ${currentAccent.shadow}`,
                    }}
                    className="w-7 h-7 rounded-full disabled:opacity-40 flex items-center justify-center text-white transition hover:opacity-90"
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
          className={`flex-1 h-full relative overflow-hidden flex items-center justify-center select-none cursor-default transition-colors duration-200 ${
            isDark ? "bg-[#0e0e0e]" : "bg-[#f1f3f5]"
          }`}
          style={{
            backgroundImage: showDotGrid
              ? `radial-gradient(circle, ${
                  isDark ? "rgba(255, 255, 255, 0.09)" : "rgba(0, 0, 0, 0.11)"
                } 1.2px, transparent 1.2px)`
              : "none",
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
            {/* High-Fidelity Sleek Design Artboards (Harmonized with Dark/Light Mode) */}
            <div className="flex items-start gap-10">
              {/* Screen 1: Public Portal / Landing */}
              <div
                onClick={() => setActiveScreenIndex(0)}
                className={`w-[480px] rounded-2xl border transition-all duration-300 shadow-2xl overflow-hidden cursor-pointer ${
                  isDark
                    ? "bg-[#141414] border-white/[0.08]"
                    : "bg-white border-zinc-200"
                } ${
                  activeScreenIndex === 0
                    ? `ring-2`
                    : "hover:border-zinc-400"
                }`}
                style={{
                  borderColor:
                    activeScreenIndex === 0 ? currentAccent.primary : undefined,
                  boxShadow:
                    activeScreenIndex === 0
                      ? `0 0 0 2px ${currentAccent.primary}, 0 20px 40px -15px ${currentAccent.shadow}`
                      : undefined,
                }}
              >
                {/* Artboard Header */}
                <div
                  className={`px-4 py-3 border-b flex items-center justify-between ${
                    isDark
                      ? "bg-[#1a1a1a] border-white/[0.08]"
                      : "bg-zinc-50 border-zinc-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap
                      className="w-4 h-4"
                      style={{ color: currentAccent.primary }}
                    />
                    <span
                      className={`text-xs font-bold tracking-wide ${
                        isDark ? "text-white" : "text-zinc-900"
                      }`}
                    >
                      EDUCORE &bull; Public School Portal
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Ready
                  </span>
                </div>

                {/* Artboard Screen Content */}
                <div
                  className={`p-6 space-y-5 ${
                    isDark ? "bg-[#0e0e0e]" : "bg-white"
                  }`}
                >
                  {/* Hero Nav */}
                  <div
                    className={`flex items-center justify-between border-b pb-3 ${
                      isDark ? "border-white/[0.08]" : "border-zinc-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded flex items-center justify-center text-white text-[10px] font-black"
                        style={{ backgroundColor: currentAccent.primary }}
                      >
                        E
                      </div>
                      <span
                        className={`text-xs font-black ${
                          isDark ? "text-white" : "text-zinc-900"
                        }`}
                      >
                        EDUCORE ACADEMY
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                      <span>Admissions</span>
                      <span>Academics</span>
                      <button
                        style={{ backgroundColor: currentAccent.primary }}
                        className="px-2.5 py-1 rounded text-white font-bold"
                      >
                        Enroll
                      </button>
                    </div>
                  </div>

                  {/* Hero Headline */}
                  <div className="text-center py-4 space-y-2">
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{
                        backgroundColor: currentAccent.badgeBg,
                        color: currentAccent.badgeText,
                        borderColor: currentAccent.badgeBorder,
                      }}
                    >
                      ✨ 2026-2027 Academic Registration Open
                    </span>
                    <h2
                      className={`text-xl font-black tracking-tight leading-snug ${
                        isDark ? "text-white" : "text-zinc-900"
                      }`}
                    >
                      Empowering Future Leaders with Excellence.
                    </h2>
                    <p
                      className={`text-[11px] max-w-xs mx-auto leading-relaxed ${
                        isDark ? "text-zinc-400" : "text-zinc-600"
                      }`}
                    >
                      World-class STEM curriculum, accredited faculty, and innovative digital classrooms.
                    </p>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div
                      className={`p-2.5 rounded-xl border text-center ${
                        isDark
                          ? "bg-[#181818] border-white/[0.06]"
                          : "bg-zinc-50 border-zinc-200"
                      }`}
                    >
                      <span
                        className={`text-sm font-black block ${
                          isDark ? "text-white" : "text-zinc-900"
                        }`}
                      >
                        99.4%
                      </span>
                      <span className="text-[9px] text-zinc-500">Graduation</span>
                    </div>
                    <div
                      className={`p-2.5 rounded-xl border text-center ${
                        isDark
                          ? "bg-[#181818] border-white/[0.06]"
                          : "bg-zinc-50 border-zinc-200"
                      }`}
                    >
                      <span
                        className="text-sm font-black block"
                        style={{ color: currentAccent.primary }}
                      >
                        1:12
                      </span>
                      <span className="text-[9px] text-zinc-500">Ratio</span>
                    </div>
                    <div
                      className={`p-2.5 rounded-xl border text-center ${
                        isDark
                          ? "bg-[#181818] border-white/[0.06]"
                          : "bg-zinc-50 border-zinc-200"
                      }`}
                    >
                      <span
                        className={`text-sm font-black block ${
                          isDark ? "text-white" : "text-zinc-900"
                        }`}
                      >
                        48+
                      </span>
                      <span className="text-[9px] text-zinc-500">AP Courses</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Screen 2: Admin Portal / Dashboard */}
              <div
                onClick={() => setActiveScreenIndex(1)}
                className={`w-[480px] rounded-2xl border transition-all duration-300 shadow-2xl overflow-hidden cursor-pointer ${
                  isDark
                    ? "bg-[#141414] border-white/[0.08]"
                    : "bg-white border-zinc-200"
                } ${
                  activeScreenIndex === 1
                    ? `ring-2`
                    : "hover:border-zinc-400"
                }`}
                style={{
                  borderColor:
                    activeScreenIndex === 1 ? currentAccent.primary : undefined,
                  boxShadow:
                    activeScreenIndex === 1
                      ? `0 0 0 2px ${currentAccent.primary}, 0 20px 40px -15px ${currentAccent.shadow}`
                      : undefined,
                }}
              >
                {/* Artboard Header */}
                <div
                  className={`px-4 py-3 border-b flex items-center justify-between ${
                    isDark
                      ? "bg-[#1a1a1a] border-white/[0.08]"
                      : "bg-zinc-50 border-zinc-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BarChart3
                      className="w-4 h-4"
                      style={{ color: currentAccent.primary }}
                    />
                    <span
                      className={`text-xs font-bold tracking-wide ${
                        isDark ? "text-white" : "text-zinc-900"
                      }`}
                    >
                      EDUCORE &bull; Admin Operations
                    </span>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-semibold border"
                    style={{
                      backgroundColor: currentAccent.badgeBg,
                      color: currentAccent.badgeText,
                      borderColor: currentAccent.badgeBorder,
                    }}
                  >
                    Live Sync
                  </span>
                </div>

                {/* Artboard Content */}
                <div
                  className={`p-6 space-y-4 ${
                    isDark ? "bg-[#0e0e0e]" : "bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3
                        className={`text-sm font-bold ${
                          isDark ? "text-white" : "text-zinc-900"
                        }`}
                      >
                        Campus Overview
                      </h3>
                      <p className="text-[10px] text-zinc-500">
                        Daily attendance &amp; tuition metrics
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-1 rounded border ${
                        isDark
                          ? "bg-white/5 border-white/10 text-zinc-400"
                          : "bg-zinc-100 border-zinc-200 text-zinc-600"
                      }`}
                    >
                      Fall Term
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className={`p-3 rounded-xl border ${
                        isDark
                          ? "bg-[#181818] border-white/[0.06]"
                          : "bg-zinc-50 border-zinc-200"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1">
                        <span>Total Students</span>
                        <Users className="w-3.5 h-3.5 text-indigo-400" />
                      </div>
                      <span
                        className={`text-lg font-black ${
                          isDark ? "text-white" : "text-zinc-900"
                        }`}
                      >
                        2,840
                      </span>
                      <span className="text-[9px] text-emerald-500 block mt-0.5">
                        &uarr; 12% vs last semester
                      </span>
                    </div>

                    <div
                      className={`p-3 rounded-xl border ${
                        isDark
                          ? "bg-[#181818] border-white/[0.06]"
                          : "bg-zinc-50 border-zinc-200"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1">
                        <span>Tuition Collected</span>
                        <Zap
                          className="w-3.5 h-3.5"
                          style={{ color: currentAccent.primary }}
                        />
                      </div>
                      <span
                        className={`text-lg font-black ${
                          isDark ? "text-white" : "text-zinc-900"
                        }`}
                      >
                        $1.48M
                      </span>
                      <span className="text-[9px] text-emerald-500 block mt-0.5">
                        98.2% on-time
                      </span>
                    </div>
                  </div>

                  {/* Attendance Bar */}
                  <div
                    className={`p-3 rounded-xl border space-y-2 ${
                      isDark
                        ? "bg-[#181818] border-white/[0.06]"
                        : "bg-zinc-50 border-zinc-200"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span
                        className={isDark ? "text-zinc-400" : "text-zinc-600"}
                      >
                        Faculty &amp; Student Attendance
                      </span>
                      <span
                        className={`font-bold ${
                          isDark ? "text-white" : "text-zinc-900"
                        }`}
                      >
                        96.8%
                      </span>
                    </div>
                    <div
                      className={`w-full h-2 rounded-full overflow-hidden ${
                        isDark ? "bg-white/10" : "bg-zinc-200"
                      }`}
                    >
                      <div
                        className="h-full rounded-full w-[96.8%]"
                        style={{ backgroundColor: currentAccent.primary }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Screen 3: Student Learning Portal */}
              <div
                onClick={() => setActiveScreenIndex(2)}
                className={`w-[480px] rounded-2xl border transition-all duration-300 shadow-2xl overflow-hidden cursor-pointer ${
                  isDark
                    ? "bg-[#141414] border-white/[0.08]"
                    : "bg-white border-zinc-200"
                } ${
                  activeScreenIndex === 2
                    ? `ring-2`
                    : "hover:border-zinc-400"
                }`}
                style={{
                  borderColor:
                    activeScreenIndex === 2 ? currentAccent.primary : undefined,
                  boxShadow:
                    activeScreenIndex === 2
                      ? `0 0 0 2px ${currentAccent.primary}, 0 20px 40px -15px ${currentAccent.shadow}`
                      : undefined,
                }}
              >
                {/* Artboard Header */}
                <div
                  className={`px-4 py-3 border-b flex items-center justify-between ${
                    isDark
                      ? "bg-[#1a1a1a] border-white/[0.08]"
                      : "bg-zinc-50 border-zinc-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-500" />
                    <span
                      className={`text-xs font-bold tracking-wide ${
                        isDark ? "text-white" : "text-zinc-900"
                      }`}
                    >
                      EDUCORE &bull; Student Dashboard
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Active
                  </span>
                </div>

                {/* Artboard Content */}
                <div
                  className={`p-6 space-y-4 ${
                    isDark ? "bg-[#0e0e0e]" : "bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4
                        className={`text-sm font-bold ${
                          isDark ? "text-white" : "text-zinc-900"
                        }`}
                      >
                        Alex Morgan
                      </h4>
                      <p className="text-[10px] text-zinc-500">
                        Grade 11 &bull; AP Honors Track
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className="text-sm font-black"
                        style={{ color: currentAccent.primary }}
                      >
                        3.94 GPA
                      </span>
                      <span className="text-[9px] text-zinc-500 block">
                        Rank: 4 / 280
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                        isDark
                          ? "bg-[#181818] border-white/[0.06]"
                          : "bg-zinc-50 border-zinc-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className={isDark ? "text-zinc-200" : "text-zinc-800"}>
                          AP Computer Science A
                        </span>
                      </div>
                      <span className="font-mono text-zinc-500 font-bold">
                        98% (A+)
                      </span>
                    </div>

                    <div
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                        isDark
                          ? "bg-[#181818] border-white/[0.06]"
                          : "bg-zinc-50 border-zinc-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                        <span className={isDark ? "text-zinc-200" : "text-zinc-800"}>
                          AP Physics C: Mechanics
                        </span>
                      </div>
                      <span className="font-mono text-zinc-500 font-bold">
                        94% (A)
                      </span>
                    </div>

                    <div
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                        isDark
                          ? "bg-[#181818] border-white/[0.06]"
                          : "bg-zinc-50 border-zinc-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-400" />
                        <span className={isDark ? "text-zinc-200" : "text-zinc-800"}>
                          Calculus BC
                        </span>
                      </div>
                      <span className="font-mono text-zinc-500 font-bold">
                        92% (A-)
                      </span>
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
            <div
              className={`backdrop-blur-xl border rounded-full px-3.5 py-1.5 flex items-center gap-3 text-xs shadow-2xl transition-colors ${
                isDark
                  ? "bg-[#181818]/90 border-white/[0.1] text-zinc-300"
                  : "bg-white/95 border-zinc-200 text-zinc-700 shadow-xl"
              }`}
            >
              {/* Tool Selection Icons */}
              <button
                onClick={() => setToolMode("select")}
                title="Select tool"
                className={`p-1.5 rounded-full transition ${
                  toolMode === "select"
                    ? isDark
                      ? "bg-white/10 text-white"
                      : "bg-zinc-200 text-zinc-900"
                    : isDark
                    ? "text-zinc-500 hover:text-zinc-300"
                    : "text-zinc-400 hover:text-zinc-700"
                }`}
              >
                <MousePointer className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setToolMode("pan")}
                title="Pan hand tool"
                className={`p-1.5 rounded-full transition ${
                  toolMode === "pan"
                    ? isDark
                      ? "bg-white/10 text-white"
                      : "bg-zinc-200 text-zinc-900"
                    : isDark
                    ? "text-zinc-500 hover:text-zinc-300"
                    : "text-zinc-400 hover:text-zinc-700"
                }`}
              >
                <Hand className="w-3.5 h-3.5" />
              </button>

              <div
                className={`w-px h-3.5 ${
                  isDark ? "bg-white/10" : "bg-zinc-300"
                }`}
              />

              {/* Zoom Controls */}
              <button
                onClick={handleZoomOut}
                title="Zoom Out (-)"
                className={`p-1 rounded transition ${
                  isDark
                    ? "text-zinc-400 hover:text-white"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleResetZoom}
                title="Reset to 100%"
                className={`font-mono text-[11px] font-semibold px-1 ${
                  isDark ? "text-zinc-200" : "text-zinc-800"
                }`}
              >
                {zoom}%
              </button>

              <button
                onClick={handleZoomIn}
                title="Zoom In (+)"
                className={`p-1 rounded transition ${
                  isDark
                    ? "text-zinc-400 hover:text-white"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>

              <div
                className={`w-px h-3.5 ${
                  isDark ? "bg-white/10" : "bg-zinc-300"
                }`}
              />

              {/* Fit / Layout Icon */}
              <button
                onClick={handleResetZoom}
                title="Fit to Screen"
                className={`p-1.5 rounded-full transition ${
                  isDark
                    ? "text-zinc-400 hover:text-white hover:bg-white/5"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                }`}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div
            className={`flex flex-col w-full max-w-md border rounded-3xl p-6 shadow-2xl relative text-left transition-colors ${
              isDark
                ? "bg-[#161616] border-white/[0.12] text-white"
                : "bg-white border-zinc-200 text-zinc-900"
            }`}
          >
            <button
              onClick={() => setShowUpgradeModal(false)}
              className={`absolute top-5 right-5 p-1.5 rounded-xl transition ${
                isDark
                  ? "text-zinc-400 hover:text-white hover:bg-white/5"
                  : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100"
              }`}
            >
              <X className="w-4 h-4" />
            </button>

            <div
              className="w-10 h-10 rounded-2xl border flex items-center justify-center mb-4 shadow-lg"
              style={{
                backgroundColor: currentAccent.badgeBg,
                borderColor: currentAccent.badgeBorder,
                color: currentAccent.primary,
              }}
            >
              <Sparkles className="w-5 h-5 fill-current" />
            </div>

            <h3 className="text-xl font-black tracking-tight mb-1">
              Unlock Full Sleek Access
            </h3>
            <p
              className={`text-xs mb-6 leading-relaxed ${
                isDark ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              Export production-ready Next.js code, customize component tokens, and collaborate with unlimited screens.
            </p>

            <div
              className={`p-4 rounded-2xl border mb-6 space-y-2.5 ${
                isDark
                  ? "bg-[#202020] border-white/[0.08]"
                  : "bg-zinc-50 border-zinc-200"
              }`}
            >
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2
                  className="w-4 h-4 shrink-0"
                  style={{ color: currentAccent.primary }}
                />
                <span>Unlimited High-Fidelity UI Screens</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2
                  className="w-4 h-4 shrink-0"
                  style={{ color: currentAccent.primary }}
                />
                <span>Tailwind CSS &amp; React Code Exports</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2
                  className="w-4 h-4 shrink-0"
                  style={{ color: currentAccent.primary }}
                />
                <span>Dark &amp; Light Theme Syncing</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-2xl font-black">$29</span>
                <span className="text-xs text-zinc-500 font-medium"> / month</span>
              </div>
              <button
                onClick={() => {
                  alert("Upgrade successful! All screens are now unlocked.");
                  setShowUpgradeModal(false);
                }}
                style={{
                  backgroundColor: currentAccent.primary,
                  boxShadow: `0 4px 14px ${currentAccent.shadow}`,
                }}
                className="px-6 py-2.5 rounded-xl text-white text-xs font-bold transition hover:opacity-90"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div
            className={`flex flex-col w-full max-w-xl border rounded-3xl p-6 shadow-2xl relative text-left transition-colors ${
              isDark
                ? "bg-[#161616] border-white/[0.12] text-white"
                : "bg-white border-zinc-200 text-zinc-900"
            }`}
          >
            <button
              onClick={() => setShowExportModal(false)}
              className={`absolute top-5 right-5 p-1.5 rounded-xl transition ${
                isDark
                  ? "text-zinc-400 hover:text-white hover:bg-white/5"
                  : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100"
              }`}
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: currentAccent.badgeBg,
                  color: currentAccent.primary,
                }}
              >
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Export Application Code</h3>
                <p className="text-[11px] text-zinc-500">
                  Next.js 16 &bull; Tailwind CSS &bull; {currentAccent.name}
                </p>
              </div>
            </div>

            <div
              className={`p-4 rounded-xl border font-mono text-[11px] overflow-x-auto max-h-64 leading-relaxed mb-6 ${
                isDark
                  ? "bg-[#0a0a0a] border-white/[0.08] text-zinc-300"
                  : "bg-zinc-100 border-zinc-200 text-zinc-800"
              }`}
            >
              <pre>{`// EDUCORE School Management System
// Theme: ${theme.toUpperCase()} | Accent: ${currentAccent.name}
// Generated by Sleek.design AI Engine

import React from "react";

export default function EducoreApp() {
  return (
    <div className="min-h-screen ${isDark ? "bg-[#0e0e0e] text-white" : "bg-white text-zinc-900"}">
      {/* Public School Website, Admin Portal, Student Portal */}
      <header className="h-16 border-b px-6 flex items-center justify-between">
        <h1 className="font-black text-lg" style={{ color: "${currentAccent.primary}" }}>EDUCORE</h1>
      </header>
    </div>
  );
}`}</pre>
            </div>

            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setShowExportModal(false)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  isDark
                    ? "text-zinc-400 hover:text-white hover:bg-white/5"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                }`}
              >
                Close
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`// EDUCORE School Management System`);
                  alert("Code copied to clipboard!");
                  setShowExportModal(false);
                }}
                style={{
                  backgroundColor: currentAccent.primary,
                  boxShadow: `0 2px 10px ${currentAccent.shadow}`,
                }}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white transition hover:opacity-90"
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
