"use client";

import React, { useState } from "react";
import { useBuilderStore } from "@/lib/store/useBuilderStore";
import { Device } from "@/types/builder";
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
} from "lucide-react";
import { CodeExportModal } from "./CodeExportModal";
import { ShortcutsModal } from "./ShortcutsModal";

interface TopBarProps {
  onSave?: () => Promise<void>;
}

export const TopBar: React.FC<TopBarProps> = ({ onSave }) => {
  const {
    currentDevice,
    setDevice,
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
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    if (onSave) {
      await onSave();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  const devices: { id: Device; label: string; width: string; icon: React.ReactNode }[] = [
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
      <header className="h-14 bg-zinc-950 border-b border-zinc-800/80 px-4 flex items-center justify-between select-none z-30">
        {/* Left Section: Logo & Project Name */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-extrabold tracking-tight text-white">
                VASCO
              </span>
              <span className="text-[10px] px-1.5 py-0.5 bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 rounded font-semibold uppercase tracking-wider">
                STUDIO
              </span>
            </div>
          </div>

          <div className="h-4 w-px bg-zinc-800" />

          {/* Project Title Input */}
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="bg-transparent hover:bg-zinc-900 focus:bg-zinc-900 border border-transparent focus:border-zinc-700 rounded-lg px-2.5 py-1 text-xs font-medium text-zinc-300 focus:text-white transition outline-none w-44"
            title="Click to rename project"
          />
        </div>

        {/* Center Section: Responsive Breakpoints & Undo/Redo */}
        <div className="flex items-center gap-3">
          {/* Breakpoint Viewport Switcher */}
          <div className="flex items-center bg-zinc-900/90 border border-zinc-800/90 p-0.5 rounded-xl shadow-inner">
            {devices.map((d) => (
              <button
                key={d.id}
                onClick={() => setDevice(d.id)}
                title={`${d.label} Viewport (${d.width})`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentDevice === d.id
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
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

          <div className="h-4 w-px bg-zinc-800" />

          {/* Undo / Redo */}
          <div className="flex items-center gap-0.5 bg-zinc-900/60 border border-zinc-800/80 p-0.5 rounded-xl">
            <button
              onClick={undo}
              disabled={history.length === 0}
              title="Undo (Ctrl+Z)"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={redo}
              disabled={future.length === 0}
              title="Redo (Ctrl+Y)"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Section: Shortcuts, Reset, Preview, Export & Turso Save */}
        <div className="flex items-center gap-2">
          {/* Shortcuts Modal Trigger */}
          <button
            onClick={() => setIsShortcutsOpen(true)}
            title="Keyboard Shortcuts (?)"
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Reset Canvas */}
          <button
            onClick={() => {
              if (confirm("Are you sure you want to clear the canvas?")) {
                resetCanvas();
              }
            }}
            title="Clear Canvas"
            className="p-2 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-zinc-800/80 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Preview Mode */}
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
              previewMode
                ? "bg-indigo-600/20 border-indigo-500/50 text-indigo-300"
                : "border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-white"
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

          {/* Export Code Modal Trigger */}
          <button
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-zinc-800 hover:bg-zinc-800 text-zinc-200 hover:text-white transition"
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Export Code</span>
          </button>

          {/* Save to Turso Edge */}
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
                <span>Saving to Edge...</span>
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved to Edge</span>
              </>
            ) : (
              <>
                <Database className="w-3.5 h-3.5" />
                <span>Save to Turso</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Code Export & Import Modal */}
      <CodeExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      {/* Shortcuts Cheat Sheet Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </>
  );
};
