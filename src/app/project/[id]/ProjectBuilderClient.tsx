"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Project } from "@/db/schema";
import { useBuilderStore } from "@/store/useBuilderStore";
import { saveProjectAction, updateProjectAiAction } from "@/app/actions/project";
import { BuilderLayout } from "@/components/builder/BuilderLayout";
import { UserButton } from "@clerk/nextjs";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Wand2,
  Layout,
  Code2,
  CheckCircle2,
  Bot,
  Zap,
} from "lucide-react";

interface ProjectBuilderClientProps {
  project: Project;
}

const PRESET_SUGGESTIONS = [
  {
    label: "SaaS Dashboard",
    prompt:
      "Modern dark-mode SaaS analytics dashboard with revenue charts, user retention metrics, active session stats, and quick-action cards.",
    icon: "📊",
  },
  {
    label: "Creative Portfolio",
    prompt:
      "Minimalist design studio and agency portfolio showcasing selected case studies, interactive project gallery, client list, and contact CTA.",
    icon: "🎨",
  },
  {
    label: "E-Commerce Product",
    prompt:
      "High-converting modern e-commerce product landing page with hero image showcase, feature highlights, customer testimonials, and pricing tiers.",
    icon: "🛍️",
  },
  {
    label: "B2B SaaS Landing Page",
    prompt:
      "Ultra-sleek B2B AI SaaS landing page with bold hero typography, interactive product preview, grid feature breakdown, and email waitlist form.",
    icon: "🚀",
  },
];

const GENERATION_STEPS = [
  "Analyzing prompt & visual architecture...",
  "Synthesizing responsive component tree...",
  "Applying dark mode design tokens & styling...",
  "Mounting canvas DOM nodes...",
];

export default function ProjectBuilderClient({ project }: ProjectBuilderClientProps) {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [promptInput, setPromptInput] = useState(project.prompt || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const {
    isGenerated,
    loadProject,
    setSaving,
    setProjectName,
    generateFromAiPrompt,
    setGeneratedStatus,
    setAiPrompt,
  } = useBuilderStore();

  const isSavingRef = useRef(false);

  // Initialize store state from DB on mount
  useEffect(() => {
    try {
      if (project.canvasData) {
        const parsed = JSON.parse(project.canvasData);
        loadProject(
          parsed,
          project.id,
          project.name,
          Boolean(project.isGenerated),
          project.prompt || undefined
        );
      } else {
        setProjectName(project.name);
        setGeneratedStatus(Boolean(project.isGenerated));
        if (project.prompt) setAiPrompt(project.prompt);
      }
    } catch (err) {
      console.error("Failed to parse canvas data:", err);
      setProjectName(project.name);
      setGeneratedStatus(Boolean(project.isGenerated));
    } finally {
      setHydrated(true);
    }
  }, [
    project.id,
    project.name,
    project.canvasData,
    project.isGenerated,
    project.prompt,
    loadProject,
    setProjectName,
    setGeneratedStatus,
    setAiPrompt,
  ]);

  // Handle saving in State B
  const handleSave = useCallback(async () => {
    if (isSavingRef.current) return;
    isSavingRef.current = true;
    setSaving(true);
    try {
      const currentNodes = useBuilderStore.getState().nodes;
      const currentName = useBuilderStore.getState().projectName || project.name;
      const currentPrompt =
        useBuilderStore.getState().aiPrompt || project.prompt || undefined;
      const currentIsGenerated = useBuilderStore.getState().isGenerated;
      const serialized = JSON.stringify(currentNodes);
      await saveProjectAction(
        project.id,
        currentName,
        serialized,
        currentIsGenerated,
        currentPrompt
      );
    } catch (error) {
      console.error("Failed to save project:", error);
    } finally {
      setSaving(false);
      isSavingRef.current = false;
    }
  }, [project.id, project.name, project.prompt, setSaving]);

  // Global Ctrl+S shortcut to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  // AI Generation handler for State A
  const handleGenerate = async (presetPrompt?: string) => {
    const finalPrompt = (presetPrompt ?? promptInput).trim();
    if (!finalPrompt) return;

    setIsGenerating(true);
    setCurrentStepIndex(0);

    // Step animation intervals
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < GENERATION_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    // Simulated generation delay for realistic, magical experience
    setTimeout(async () => {
      clearInterval(stepInterval);
      try {
        // Generate node tree via Zustand store
        generateFromAiPrompt(finalPrompt);

        // Get freshly generated nodes
        const generatedNodes = useBuilderStore.getState().nodes;
        const serialized = JSON.stringify(generatedNodes);

        // Save to Turso DB
        await updateProjectAiAction(project.id, finalPrompt, serialized);

        // Update local status
        setGeneratedStatus(true);
        setAiPrompt(finalPrompt);
      } catch (err) {
        console.error("Failed to generate UI:", err);
      } finally {
        setIsGenerating(false);
      }
    }, 1800);
  };

  // Skip AI prompt and start with blank/default canvas
  const handleStartBlank = async () => {
    setIsGenerating(true);
    try {
      const currentNodes = useBuilderStore.getState().nodes;
      const serialized = JSON.stringify(currentNodes);
      await saveProjectAction(project.id, project.name, serialized, true);
      setGeneratedStatus(true);
    } catch (err) {
      console.error("Failed to initialize blank canvas:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-[#000000] text-zinc-100 gap-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <span className="text-sm font-medium text-zinc-400">Loading Vasco Studio...</span>
      </div>
    );
  }

  // ==========================================
  // STATE A: The AI Prompt Setup Screen
  // ==========================================
  if (!isGenerated) {
    return (
      <div className="min-h-screen w-screen bg-[#000000] text-zinc-100 flex flex-col justify-between overflow-x-hidden relative selection:bg-indigo-500/30">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-transparent blur-[120px] pointer-events-none rounded-full" />
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Minimalist Topbar */}
        <header className="relative z-20 w-full border-b border-white/[0.08] bg-[#000000]/60 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/[0.08] transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-500/25">
                  <Sparkles className="w-3 h-3" />
                </div>
                <span className="font-extrabold text-sm tracking-tight text-white">
                  VASCO
                </span>
                <span className="text-zinc-600">/</span>
                <span className="text-xs text-zinc-400 font-mono truncate max-w-[140px] sm:max-w-none">
                  {project.name || "Untitled Project"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 rounded-xl ring-2 ring-white/10",
                  },
                }}
              />
            </div>
          </div>
        </header>

        {/* Center Prompt Stage */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 max-w-4xl mx-auto w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 backdrop-blur-md mb-6 shadow-sm">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>AI Design Engine</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl font-black text-center text-white tracking-tight leading-[1.15] mb-4">
            What do you want to{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-white bg-clip-text text-transparent">
              build today?
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 text-center max-w-xl mb-8 leading-relaxed">
            Describe your page or full application. Vasco AI synthesizes responsive layout
            structures, interactive components, and dark-mode styling instantly.
          </p>

          {/* Prompt Box with Glowing Focus Border */}
          <div className="w-full relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/40 via-purple-500/30 to-indigo-500/40 rounded-2xl blur-lg opacity-40 group-focus-within:opacity-100 transition duration-500" />

            <div className="relative rounded-2xl border border-white/[0.12] bg-[#0a0a0a]/90 backdrop-blur-xl p-4 sm:p-5 flex flex-col gap-4 shadow-2xl">
              <textarea
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
                disabled={isGenerating}
                placeholder="Describe the UI you want to build... (e.g., A modern dark-mode SaaS dashboard with revenue metrics, user charts, and quick-action cards)"
                rows={4}
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder-zinc-500 focus:outline-none resize-none leading-relaxed"
              />

              {/* Toolbar inside prompt box */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-white/[0.08]">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Zap className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Press</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 text-[11px] font-mono border border-white/10">
                    ⌘ + Enter
                  </kbd>
                  <span>to synthesize</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleStartBlank}
                    disabled={isGenerating}
                    type="button"
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition"
                  >
                    Start Blank
                  </button>

                  <button
                    onClick={() => handleGenerate()}
                    disabled={isGenerating || !promptInput.trim()}
                    type="button"
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Synthesizing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-white" />
                        <span>Generate UI</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Suggestion Chips */}
          <div className="w-full mt-6">
            <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2.5 px-1">
              Popular Presets
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRESET_SUGGESTIONS.map((preset) => (
                <button
                  key={preset.label}
                  disabled={isGenerating}
                  onClick={() => {
                    setPromptInput(preset.prompt);
                    handleGenerate(preset.prompt);
                  }}
                  className="flex items-start gap-3 p-3 rounded-xl border border-white/[0.08] bg-[#050505]/70 hover:bg-[#0a0a0a] hover:border-indigo-500/40 transition text-left group cursor-pointer"
                >
                  <span className="text-lg p-1.5 rounded-lg bg-white/5 border border-white/[0.08] flex-shrink-0 group-hover:scale-105 transition-transform">
                    {preset.icon}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-zinc-200 group-hover:text-indigo-300 transition flex items-center gap-1">
                      <span>{preset.label}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-indigo-400" />
                    </div>
                    <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5 leading-relaxed">
                      {preset.prompt}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Animated Generative Loading Overlay */}
          {isGenerating && (
            <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-3xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-[0_0_50px_rgba(99,102,241,0.35)] animate-pulse">
                  <Sparkles className="w-10 h-10 animate-spin" style={{ animationDuration: "4s" }} />
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                Synthesizing Visual Layout
              </h3>

              <p className="text-xs text-indigo-300 font-mono mb-6 transition-all duration-300">
                {GENERATION_STEPS[currentStepIndex]}
              </p>

              {/* Progress Bar */}
              <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${((currentStepIndex + 1) / GENERATION_STEPS.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </main>

        {/* Footer info */}
        <footer className="relative z-10 w-full py-4 px-6 border-t border-white/[0.06] text-center text-[11px] text-zinc-600">
          Powered by Vasco AI Visual Engine &bull; Turso Edge DB &bull; Live Breakpoints
        </footer>
      </div>
    );
  }

  // ==========================================
  // STATE B: The Canvas Workspace
  // ==========================================
  return <BuilderLayout onSave={handleSave} />;
}
