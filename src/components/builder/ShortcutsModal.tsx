"use client";

import React from "react";
import { X, Keyboard } from "lucide-react";

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: "Ctrl + Z", action: "Undo last change" },
    { key: "Ctrl + Y", action: "Redo change" },
    { key: "Delete / Backspace", action: "Delete selected element" },
    { key: "Double Click", action: "Edit text inline on canvas" },
    { key: "Esc", action: "Deselect element / Cancel edit" },
    { key: "Ctrl + S", action: "Save project to Turso database" },
    { key: "Ctrl + P", action: "Toggle live preview mode" },
    { key: "↑ / ↓ Buttons", action: "Reorder element position" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="flex flex-col w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-2 text-white">
            <Keyboard className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-zinc-800/40 text-xs"
            >
              <span className="text-zinc-300">{s.action}</span>
              <kbd className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700/80 font-mono text-[11px] font-semibold text-indigo-300 shadow-sm">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
