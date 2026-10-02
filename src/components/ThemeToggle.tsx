"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = "",
  showLabel = false,
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={`relative inline-flex items-center gap-2 p-2 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer ${
        isDark
          ? "bg-[#18181b] border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 hover:border-white/20 shadow-sm"
          : "bg-white border-zinc-200 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 hover:border-zinc-300 shadow-sm"
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-90 duration-200" />
        ) : (
          <Moon className="w-4 h-4 text-indigo-600 animate-in spin-in-90 duration-200" />
        )}
      </div>

      {showLabel && (
        <span className="text-xs font-medium">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
};
