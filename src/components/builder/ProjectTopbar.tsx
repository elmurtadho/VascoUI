"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useBuilderStore, Viewport } from "@/store/useBuilderStore";
import { UserButton } from "@clerk/nextjs";
import {
  Monitor,
  Tablet,
  Smartphone,
  Undo2,
  Redo2,
  Eye,
  EyeOff,
  Code2,
  RotateCcw,
  Sparkles,
  Database,
  CheckCircle2,
  Loader2,
  HelpCircle,
  ArrowLeft,
} from "lucide-react";
import { CodeExportModal } from "./CodeExportModal";
import { ShortcutsModal } from "./ShortcutsModal";
import { AiPromptModal } from "./AiPromptModal";

interface ProjectTopbarProps {
  onSave?: () => Promise<void>;
}

export const ProjectTopbar: React.FC<ProjectTopbarProps> = ({ onSave }) => {
  const {
    viewport,
    setViewport,
    history,
    future,
    undo,
    redo,
    previewMode,
    setPreviewMode,
    projectName,
    setProjectName,
    isSaving,
    resetCanvas,
  } = useBuilderStore();

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isAiPromptOpen, setIsAiPromptOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    if (onSave) {
      await onSave();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  const devices: { id: Viewport; label: string; width: string; icon: React.ReactNode }[] = [
    {
      id: "desktop",
      label: "Desktop",
      width: "1240px",
      icon: <Monitor className="w-4 h-4" />,
    },
    {
      id: "tablet",
      label: "Tablet",
      width: "768px",
      icon: <Tablet className="w-4 h-4" />,
    },
    {
      id: "mobile",
      label: "Mobile",
      width: "390px",
      icon: <Smartphone className="w-4 h-4" />,
    },
  ];

  return (
    <>
      <header className="h-14 bg-[#0a0a0a] border-b border-white/10 px-4 flex items-center justify-between select-none z-30">
        {/* Left Section: Back to Dashboard, Brand, and Editable Name */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            title="Back to Dashboard"
            className="flex items-center gap-1.5 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="h-4 w-px bg-white/10" />

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-indigo-500/20">
              <Sparkles className="w-3 h-3" />
            </div>
            <span className="text-xs font-bold tracking-tight text-white hidden sm:inline">
              VASCO
            </span>
          </div>

          <div className="h-4 w-px bg-white/10" />

          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="bg-transparent hover:bg-white/5 focus:bg-white/5 border border-transparent focus:border-white/10 rounded-lg px-2.5 py-1 text-xs font-medium text-zinc-200 focus:text-white transition outline-none w-44"
            title="Click to rename project"
          />
        </div>

        {/* Center Section: Responsive Viewports & Undo/Redo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#050505] border border-white/10 p-0.5 rounded-xl shadow-inner">
            {devices.map((d) => (
              <button
                key={d.id}
                onClick={() => setViewport(d.id)}
                title={`${d.label} Viewport (${d.width})`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewport === d.id
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                }`}
              >
                {d.icon}
                <span className="hidden md:inline">{d.label}</span>
                <span className="text-[10px] opacity-70 hidden lg:inline font-mono">
                  {d.width}
                </span>
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-white/10" />

          <div className="flex items-center gap-0.5 bg-[#050505] border border-white/10 p-0.5 rounded-xl">
            <button
              onClick={undo}
              disabled={history.length === 0}
              title="Undo (Ctrl+Z)"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={redo}
              disabled={future.length === 0}
              title="Redo (Ctrl+Y)"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Section: Shortcuts, Reset, Preview, Export, Save/Publish & UserButton */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsShortcutsOpen(true)}
            title="Keyboard Shortcuts (?)"
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (confirm("Are you sure you want to clear the canvas?")) {
                resetCanvas();
              }
            }}
            title="Clear Canvas"
            className="p-2 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-white/5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
              previewMode
                ? "bg-indigo-600/20 border-indigo-500/50 text-indigo-300"
                : "border-white/10 hover:bg-white/5 text-zinc-300 hover:text-white"
            }`}
          >
            {previewMode ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Exit Preview</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsAiPromptOpen(true)}
            title="Generate or Prompt with AI"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500/15 to-purple-500/15 border border-indigo-500/30 text-indigo-300 hover:text-white hover:border-indigo-500/60 transition shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">AI Prompt</span>
          </button>

          <button
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-white/10 hover:bg-white/5 text-zinc-200 hover:text-white transition"
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Save / Publish to Turso */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold transition shadow-md ${
              saveSuccess
                ? "bg-emerald-600 text-white shadow-emerald-500/20"
                : isSaving
                ? "bg-indigo-600/50 text-indigo-200 cursor-wait"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25 hover:shadow-indigo-600/40"
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving to Turso...</span>
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved & Synced</span>
              </>
            ) : (
              <>
                <Database className="w-3.5 h-3.5" />
                <span>Save to Turso</span>
              </>
            )}
          </button>

          {/* Clerk User Button */}
          <div className="pl-1 border-l border-white/10">
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

      <AiPromptModal
        isOpen={isAiPromptOpen}
        onClose={() => setIsAiPromptOpen(false)}
      />

      <CodeExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </>
  );
};
