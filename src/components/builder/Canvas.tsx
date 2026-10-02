"use client";

import React from "react";
import { useBuilderStore } from "@/lib/store/useBuilderStore";
import { RecursiveRenderer } from "./RecursiveRenderer";
import { useDroppable } from "@dnd-kit/core";
import { PlusCircle } from "lucide-react";

export const Canvas: React.FC = () => {
  const { nodes, currentDevice, previewMode, selectNode } = useBuilderStore();

  const { setNodeRef, isOver } = useDroppable({
    id: "droppable-canvas-root",
    data: {
      type: "canvas-root",
    },
  });

  // Calculate viewport frame widths based on breakpoint
  const getDeviceWidthClass = () => {
    switch (currentDevice) {
      case "mobile":
        return "w-[375px]";
      case "tablet":
        return "w-[768px]";
      case "desktop":
      default:
        return "w-full max-w-[1240px]";
    }
  };

  return (
    <div
      onClick={() => selectNode(null)}
      className="flex-1 h-full overflow-y-auto bg-zinc-950 p-6 flex flex-col items-center select-none relative custom-canvas-bg"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* Device Indicator Pill */}
      {!previewMode && (
        <div className="mb-4 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-zinc-400 flex items-center gap-2 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          <span>Canvas Viewport: <strong className="text-zinc-200 capitalize">{currentDevice}</strong></span>
          <span className="text-zinc-500">
            {currentDevice === "desktop" ? "1240px" : currentDevice === "tablet" ? "768px" : "375px"}
          </span>
        </div>
      )}

      {/* Main Canvas Viewport Frame */}
      <div
        ref={setNodeRef}
        onClick={(e) => {
          // Prevent deselect if clicked within canvas frame
          e.stopPropagation();
        }}
        className={`transition-all duration-300 min-h-[85vh] bg-[#09090b] shadow-2xl overflow-hidden ${getDeviceWidthClass()} ${
          previewMode
            ? "border-0 shadow-none"
            : `border rounded-xl ${
                isOver ? "border-indigo-500 ring-2 ring-indigo-500/20" : "border-zinc-800"
              }`
        }`}
      >
        {nodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[500px] text-zinc-500 p-8 text-center">
            <PlusCircle className="w-10 h-10 mb-3 text-zinc-600 stroke-[1.5]" />
            <h3 className="text-sm font-semibold text-zinc-300 mb-1">
              Canvas is empty
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mb-4">
              Drag elements from the left panel or click on any component to start building.
            </p>
          </div>
        ) : (
          <RecursiveRenderer nodes={nodes} device={currentDevice} />
        )}
      </div>
    </div>
  );
};
