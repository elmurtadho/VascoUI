"use client";

import React, { useState } from "react";
import { useBuilderStore } from "@/store/useBuilderStore";
import { updateProjectAiAction } from "@/app/actions/project";
import { Sparkles, X, Loader2, ArrowRight, Bot, Zap } from "lucide-react";

interface AiPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export const AiPromptModal: React.FC<AiPromptModalProps> = ({ isOpen, onClose }) => {
  const { projectId, aiPrompt, generateFromAiPrompt, setAiPrompt } = useBuilderStore();
  const [prompt, setPrompt] = useState(aiPrompt || "");
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (overridePrompt?: string) => {
    const finalPrompt = (overridePrompt ?? prompt).trim();
    if (!finalPrompt) return;

    setIsGenerating(true);
    setTimeout(async () => {
      try {
        generateFromAiPrompt(finalPrompt);
        setAiPrompt(finalPrompt);

        if (projectId) {
          const currentNodes = useBuilderStore.getState().nodes;
          await updateProjectAiAction(projectId, finalPrompt, JSON.stringify(currentNodes));
        }
        onClose();
      } catch (err) {
        console.error("AI Generation error:", err);
      } finally {
        setIsGenerating(false);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="flex flex-col w-full max-w-xl bg-[#0a0a0a] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#050505]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Synthesize with Vasco AI</h3>
              <p className="text-[11px] text-zinc-400">
                Generate or replace canvas with responsive visual components
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-xl blur opacity-30 group-focus-within:opacity-100 transition duration-300" />
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              rows={4}
              placeholder="Describe the UI you want to generate... (e.g. Modern dark analytics dashboard with active user metrics and graphs)"
              className="relative w-full bg-[#050505] border border-white/[0.1] rounded-xl p-4 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/60 resize-none leading-relaxed"
            />
          </div>

          {/* Quick Presets */}
          <div>
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Preset Templates
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_SUGGESTIONS.map((item) => (
                <button
                  key={item.label}
                  disabled={isGenerating}
                  onClick={() => {
                    setPrompt(item.prompt);
                    handleGenerate(item.prompt);
                  }}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl border border-white/[0.08] bg-[#050505] hover:bg-white/5 hover:border-indigo-500/40 text-left transition group cursor-pointer"
                >
                  <span className="text-base">{item.icon}</span>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-zinc-200 group-hover:text-indigo-300 transition truncate">
                      {item.label}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/[0.08] bg-[#050505]/60 flex items-center justify-between">
          <div className="text-[11px] text-zinc-500 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-zinc-400" />
            <span>Overwrites current canvas</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => handleGenerate()}
              disabled={isGenerating || !prompt.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-600/25 transition disabled:opacity-40"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Canvas</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
