"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
import {
  Sparkles,
  ArrowRight,
  Monitor,
  Tablet,
  Smartphone,
  Layers,
  Database,
  Code2,
  Sliders,
  CheckCircle2,
  Zap,
  MousePointer2,
  Menu,
  X,
  Compass,
  CornerDownLeft,
  Cpu,
  ShieldCheck,
  Flame,
  Layout,
  Globe,
} from "lucide-react";

export default function MarketingLandingPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [promptText, setPromptText] = useState(
    "A sleek, dark-mode SaaS dashboard with real-time edge telemetry, revenue KPI cards, and responsive charts"
  );
  const [activeDevice, setActiveDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const suggestionChips = [
    {
      label: "SaaS Analytics Dashboard",
      prompt: "A futuristic dark SaaS dashboard with KPI metrics, global edge latency cards, and telemetry charts",
    },
    {
      label: "Minimalist Executive Portfolio",
      prompt: "A high-end personal design portfolio with featured artifacts grid, services list, and intro call CTA",
    },
    {
      label: "Hardware Storefront",
      prompt: "A modern e-commerce storefront for precision titanium accessories with product cards and bag checkout",
    },
    {
      label: "AI Developer Platform",
      prompt: "An AI-native developer tooling landing page with prompt synthesis showcase and clean JSX export",
    },
  ];

  const handleChipClick = (prompt: string) => {
    setPromptText(prompt);
  };

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-100 selection:bg-indigo-500 selection:text-white flex flex-col font-sans relative overflow-x-hidden">
      {/* Background Subtle Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-12%] left-1/2 -translate-x-1/2 w-[1100px] h-[580px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-[140px] rounded-full" />
        <div className="absolute top-[38%] -right-[15%] w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] rounded-full" />
        <div className="absolute top-[65%] -left-[15%] w-[550px] h-[550px] bg-purple-500/10 blur-[150px] rounded-full" />
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#000000]/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">
                VASCO
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-white/[0.05] border border-white/[0.08] text-indigo-300">
                AI STUDIO
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-400">
            <a href="#prompt-mockup" className="hover:text-white transition">
              AI Generator
            </a>
            <a href="#mockup" className="hover:text-white transition">
              Studio Workspace
            </a>
            <a href="#features" className="hover:text-white transition">
              Architecture
            </a>
            <a
              href="https://github.com/elmurtadho/VascoUI"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition"
            >
              GitHub
            </a>
          </nav>

          {/* Desktop Auth Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.05] border border-transparent hover:border-white/[0.08] transition">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/40 transition">
                  Start Building Free
                </button>
              </SignUpButton>
            </Show>

            <Show when="signed-in">
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 transition"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 rounded-xl ring-2 ring-white/[0.08]",
                  },
                }}
              />
            </Show>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center gap-2">
            <Show when="signed-in">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-7 h-7 rounded-lg ring-1 ring-white/[0.08]",
                  },
                }}
              />
            </Show>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] border border-white/[0.08]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-b border-white/[0.08] bg-[#050505] px-6 py-5 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-3 text-sm font-medium text-zinc-300">
              <a
                href="#prompt-mockup"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white py-1"
              >
                AI Generator
              </a>
              <a
                href="#mockup"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white py-1"
              >
                Studio Workspace
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white py-1"
              >
                Architecture & Edge
              </a>
              <a
                href="https://github.com/elmurtadho/VascoUI"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white py-1"
              >
                GitHub Repository
              </a>
            </nav>

            <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="w-full text-center py-2.5 rounded-xl text-xs font-semibold text-zinc-200 bg-white/[0.05] border border-white/[0.08]">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="w-full text-center py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white">
                    Start Building Free
                  </button>
                </SignUpButton>
              </Show>

              <Show when="signed-in">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white"
                >
                  <span>Open Workspace Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Show>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 z-10 flex flex-col items-center">
        {/* HERO SECTION */}
        <section className="relative pt-20 pb-12 md:pt-28 md:pb-16 px-4 sm:px-6 max-w-6xl mx-auto flex flex-col items-center text-center">
          {/* Pulsing Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-medium text-indigo-300 mb-8 backdrop-blur-md shadow-inner">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span>Google Stitch & v0.dev Aesthetic Visual Engine</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.08] max-w-4xl mb-6">
            Design with AI. <br />
            <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              Edit with Precision.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed mb-10 font-normal">
            Transform natural language prompts into production-grade Next.js interfaces.
            Inspect visual properties, adapt responsive breakpoints, and persist instantly to Turso edge replicas.
          </p>

          {/* MASSIVE PROMPT UI MOCKUP (v0.dev style) */}
          <div id="prompt-mockup" className="w-full max-w-3xl mx-auto mb-14 text-left">
            <div className="relative p-0.5 rounded-2xl bg-gradient-to-b from-indigo-500/40 via-purple-500/20 to-white/[0.05] shadow-2xl shadow-indigo-950/50">
              <form
                onSubmit={handlePromptSubmit}
                className="bg-[#050505] rounded-[15px] p-4 sm:p-5 flex flex-col gap-3 relative overflow-hidden"
              >
                {/* Textarea */}
                <div className="relative">
                  <textarea
                    rows={3}
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="Describe the UI you want to build (e.g. Modern SaaS dashboard with dark glassmorphic cards)..."
                    className="w-full bg-transparent text-sm sm:text-base text-zinc-100 placeholder-zinc-500 outline-none resize-none leading-relaxed font-sans"
                  />
                </div>

                {/* Bottom Bar inside Prompt Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/[0.06]">
                  {/* Badges / Tech tags */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] font-medium text-zinc-400">
                      <Cpu className="w-3 h-3 text-indigo-400" />
                      <span>Vasco AI Engine</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] font-medium text-zinc-400">
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>Next.js 16</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] font-medium text-zinc-400">
                      <Database className="w-3 h-3 text-emerald-400" />
                      <span>Turso libSQL</span>
                    </span>
                  </div>

                  {/* Generate Button */}
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 hover:scale-[1.02] transition-all self-end sm:self-auto"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate UI</span>
                    <CornerDownLeft className="w-3 h-3 opacity-70" />
                  </button>
                </div>
              </form>
            </div>

            {/* Suggestion Chips */}
            <div className="mt-4 flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <span className="text-[11px] text-zinc-500 font-medium mr-1">Suggestions:</span>
              {suggestionChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChipClick(chip.prompt)}
                  className="px-3 py-1 rounded-lg bg-[#050505] hover:bg-white/[0.06] border border-white/[0.08] text-[11px] text-zinc-400 hover:text-white transition"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Trust Metrics */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Full Breakpoint Cascades</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Sub-10ms Turso Edge DB</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Raw Next.js JSX Export</span>
            </div>
          </div>
        </section>

        {/* INTERACTIVE WORKSPACE MOCKUP SECTION */}
        <section id="mockup" className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 pb-28">
          <div className="relative rounded-2xl border border-white/[0.08] bg-[#050505] p-2 sm:p-3 shadow-2xl shadow-indigo-950/40 overflow-hidden">
            {/* Mockup Window Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-2.5 border-b border-white/[0.08] bg-[#000000] rounded-t-xl mb-2 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 text-[11px] font-mono text-zinc-500 hidden sm:inline">
                  vasco-studio://canvas/ai-generated-saas
                </span>
              </div>

              {/* Breakpoint Switcher */}
              <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] p-0.5 rounded-lg self-center">
                <button
                  type="button"
                  onClick={() => setActiveDevice("desktop")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-medium transition ${
                    activeDevice === "desktop"
                      ? "bg-indigo-600 text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Monitor className="w-3 h-3" />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDevice("tablet")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-medium transition ${
                    activeDevice === "tablet"
                      ? "bg-indigo-600 text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Tablet className="w-3 h-3" />
                  <span>Tablet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDevice("mobile")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-medium transition ${
                    activeDevice === "mobile"
                      ? "bg-indigo-600 text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Mobile</span>
                </button>
              </div>

              {/* Status pill */}
              <div className="hidden md:flex items-center gap-2">
                <div className="px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Turso Edge Live</span>
                </div>
              </div>
            </div>

            {/* Mockup 3-Pane Work Area */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 h-[480px] rounded-b-xl overflow-hidden font-mono text-xs">
              {/* Left Pane: Component Palette */}
              <div className="hidden md:flex col-span-3 bg-[#000000] border border-white/[0.08] rounded-xl p-3 flex-col gap-2">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Component Palette</span>
                </div>
                {[
                  { name: "Section Container", tag: "section" },
                  { name: "Flexbox Wrapper", tag: "div" },
                  { name: "Responsive Grid", tag: "grid" },
                  { name: "Display Heading", tag: "h1" },
                  { name: "Action Button", tag: "button" },
                  { name: "Media Graphic", tag: "image" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#050505] border border-white/[0.04] text-[11px] text-zinc-300 hover:border-indigo-500/50 hover:text-white transition cursor-grab"
                  >
                    <span className="font-sans font-medium">{item.name}</span>
                    <span className="text-[10px] text-zinc-600 font-mono">drag</span>
                  </div>
                ))}
              </div>

              {/* Center Canvas */}
              <div
                className="col-span-12 md:col-span-6 bg-[#000000] border border-white/[0.08] rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
                  backgroundSize: "18px 18px",
                }}
              >
                {/* Active Node Element Mock */}
                <div
                  className={`rounded-xl border-2 border-indigo-500 bg-[#050505] p-5 shadow-2xl relative transition-all duration-300 ${
                    activeDevice === "mobile"
                      ? "w-[280px]"
                      : activeDevice === "tablet"
                      ? "w-[400px]"
                      : "w-full max-w-md"
                  }`}
                >
                  <div className="absolute -top-6 left-3 px-2 py-0.5 rounded-t text-[10px] font-bold bg-indigo-600 text-white flex items-center gap-1">
                    <span>Active Selection</span>
                    <span className="opacity-70 text-[9px]">desktop: flex</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 font-sans tracking-tight">
                    Next-Gen AI Canvas
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-4">
                    Visual style overrides cascade gracefully from desktop base down to tablet and mobile viewports.
                  </p>
                  <div className="flex gap-2">
                    <div className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-[11px] font-sans font-semibold">
                      Primary Action
                    </div>
                    <div className="px-3.5 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-zinc-300 text-[11px] font-sans">
                      Inspect CSS
                    </div>
                  </div>
                </div>

                {/* Simulated Floating Pointer */}
                <div className="absolute top-[40%] right-[22%] hidden sm:flex items-center gap-1 pointer-events-none">
                  <MousePointer2 className="w-5 h-5 text-indigo-400 fill-indigo-400 drop-shadow-lg" />
                  <span className="text-[9px] px-2 py-0.5 rounded bg-indigo-600 text-white font-sans font-semibold shadow">
                    AI Auto-Saved
                  </span>
                </div>
              </div>

              {/* Right Pane: Visual Inspector */}
              <div className="hidden md:flex col-span-3 bg-[#000000] border border-white/[0.08] rounded-xl p-3 flex-col gap-2.5 overflow-hidden">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Visual Inspector</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#050505] border border-white/[0.04] text-[11px] space-y-2">
                  <div className="flex justify-between text-zinc-400">
                    <span>Display Mode</span>
                    <span className="text-indigo-400 font-bold">flex (col)</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Typography</span>
                    <span className="text-zinc-200">52px / Inter</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Box Padding</span>
                    <span className="text-zinc-200">80px 24px</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Fill Color</span>
                    <span className="text-zinc-200">#000000</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Border Radius</span>
                    <span className="text-zinc-200">14px</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-[10px] text-indigo-300 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Real-time sync to Turso database</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID SECTION */}
        <section id="features" className="w-full py-24 border-t border-white/[0.08] bg-[#050505]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                Engineered for Modern Web Builders
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                Everything required to transform ideas into live, edge-deployed web applications.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-7 rounded-2xl bg-[#000000] border border-white/[0.08] hover:border-indigo-500/40 transition flex flex-col gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Natural Language UI Synthesis</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Describe what you need in plain text. The AI engine writes the nested node tree, fills typography, and applies responsive rules in seconds.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-7 rounded-2xl bg-[#000000] border border-white/[0.08] hover:border-indigo-500/40 transition flex flex-col gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Turso Global Edge Database</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Every change is automatically persisted to Turso libSQL edge replicas with Drizzle ORM. Sub-10ms response times worldwide.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-7 rounded-2xl bg-[#000000] border border-white/[0.08] hover:border-indigo-500/40 transition flex flex-col gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-emerald-600/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
                  <Code2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Zero Lock-in Code Export</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Export ready-to-ship Next.js React JSX or clean semantic HTML+CSS with a single click. No runtime dependencies or proprietary bundles.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WORKFLOW / CTA BANNER SECTION */}
        <section id="workflow" className="w-full py-24 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/40 via-[#050505] to-[#000000] p-10 sm:p-16 text-center overflow-hidden shadow-2xl">
            <div className="max-w-2xl mx-auto flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-600/40">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
                Start Crafting Your Next Website
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed mb-8 max-w-xl">
                Create unlimited responsive pages, generate layouts with AI prompts, inspect visual properties, and deploy directly to production.
              </p>

              <Show when="signed-out">
                <SignUpButton mode="modal">
                  <button className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition-all">
                    <span>Create Your Free Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </SignUpButton>
              </Show>

              <Show when="signed-in">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition-all"
                >
                  <span>Go to Your Projects Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Show>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#000000] py-10 px-4 sm:px-6 z-10 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white tracking-tight">VASCO STUDIO AI</span>
            <span>— Visual Web Builder</span>
          </div>
          <div>© {new Date().getFullYear()} Vasco Studio. Built with Next.js, Clerk & Turso.</div>
        </div>
      </footer>
    </div>
  );
}
