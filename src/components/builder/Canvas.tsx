"use client";

import React from "react";
import { useBuilderStore } from "@/lib/store/useBuilderStore";
import { RecursiveRenderer } from "./RecursiveRenderer";
import { useDroppable } from "@dnd-kit/core";
import {
  PlusCircle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid as GridIcon,
  Smartphone,
  Tablet,
  Monitor,
  Frame,
} from "lucide-react";

export const Canvas: React.FC = () => {
  const {
    nodes,
    currentDevice,
    previewMode,
    selectNode,
    zoomLevel,
    setZoomLevel,
    showGrid,
    toggleGrid,
    showDeviceFrame,
    toggleDeviceFrame,
  } = useBuilderStore();

  const { setNodeRef, isOver } = useDroppable({
    id: "droppable-canvas-root",
    data: {
      type: "canvas-root",
    },
  });

  // Calculate viewport frame widths based on breakpoint
  const getDeviceConfig = () => {
    switch (currentDevice) {
      case "mobile":
        return {
          width: "w-[390px]",
          label: "Mobile View",
          specs: "390px × 844px (iPhone 14/15/16)",
          icon: <Smartphone className="w-3.5 h-3.5" />,
          bezelRadius: "rounded-[48px]",
          bezelBorder: "border-[10px] border-zinc-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]",
        };
      case "tablet":
        return {
          width: "w-[768px]",
          label: "Tablet View",
          specs: "768px × 1024px (iPad)",
          icon: <Tablet className="w-3.5 h-3.5" />,
          bezelRadius: "rounded-[32px]",
          bezelBorder: "border-[8px] border-zinc-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]",
        };
      case "desktop":
      default:
        return {
          width: "w-full max-w-[1240px]",
          label: "Desktop View",
          specs: "1240px fluid layout",
          icon: <Monitor className="w-3.5 h-3.5" />,
          bezelRadius: "rounded-xl",
          bezelBorder: "border border-zinc-800 shadow-2xl",
        };
    }
  };

  const device = getDeviceConfig();

  const zoomIn = () => {
    if (zoomLevel < 1.5) setZoomLevel(Math.min(1.5, Number((zoomLevel + 0.1).toFixed(2))));
  };

  const zoomOut = () => {
    if (zoomLevel > 0.4) setZoomLevel(Math.max(0.4, Number((zoomLevel - 0.1).toFixed(2))));
  };

  const resetZoom = () => setZoomLevel(1);

  return (
    <div
      onClick={() => selectNode(null)}
      className="flex-1 h-full overflow-auto bg-zinc-950 p-6 flex flex-col items-center select-none relative custom-canvas-bg transition-all"
      style={{
        backgroundImage: showGrid
          ? "radial-gradient(circle, rgba(255, 255, 255, 0.07) 1px, transparent 1px)"
          : "none",
        backgroundSize: "24px 24px",
      }}
    >
      {/* Top Floating Viewport Info Bar */}
      {!previewMode && (
        <div className="mb-4 flex items-center gap-3 z-10">
          <div className="px-3.5 py-1.5 rounded-full bg-zinc-900/90 backdrop-blur-md border border-zinc-800/90 text-[11px] font-medium text-zinc-300 flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="flex items-center gap-1.5 font-semibold text-white">
              {device.icon}
              {device.label}
            </span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-400 font-mono text-[10px]">{device.specs}</span>
          </div>
        </div>
      )}

      {/* Main Canvas Viewport Scaled Container */}
      <div
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: "top center",
          transition: "transform 0.15s ease-out",
        }}
        className="w-full flex justify-center pb-24"
      >
        <div
          ref={setNodeRef}
          onClick={(e) => {
            // Prevent deselect if clicked within canvas frame
            e.stopPropagation();
          }}
          className={`transition-all duration-300 min-h-[85vh] bg-[#09090b] overflow-hidden ${device.width} ${
            previewMode
              ? "border-0 shadow-none rounded-none"
              : showDeviceFrame
              ? `${device.bezelRadius} ${device.bezelBorder} ${
                  isOver ? "ring-2 ring-indigo-500" : ""
                }`
              : `rounded-lg border ${
                  isOver ? "border-indigo-500 ring-2 ring-indigo-500/20" : "border-zinc-800"
                } shadow-2xl`
          }`}
        >
          {nodes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[520px] text-zinc-500 p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center mb-4 text-zinc-400">
                <PlusCircle className="w-7 h-7 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-200 mb-1">
                Your canvas is blank
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mb-4 leading-relaxed">
                Choose a pre-built block from the Blocks tab or drag individual components to start crafting.
              </p>
            </div>
          ) : (
            <RecursiveRenderer nodes={nodes} device={currentDevice} />
          )}
        </div>
      </div>

      {/* Bottom Floating Canvas Toolbar (Zoom, Grid, Frame) */}
      {!previewMode && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-zinc-900/95 backdrop-blur-md border border-zinc-800/90 shadow-2xl text-zinc-300">
          <button
            onClick={zoomOut}
            title="Zoom Out (-10%)"
            className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={resetZoom}
            title="Reset Zoom to 100%"
            className="px-2 py-1 hover:bg-zinc-800 rounded-lg text-xs font-mono text-zinc-200 hover:text-white transition"
          >
            {Math.round(zoomLevel * 100)}%
          </button>

          <button
            onClick={zoomIn}
            title="Zoom In (+10%)"
            className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-zinc-800 mx-1" />

          <button
            onClick={resetZoom}
            title="Fit to Screen"
            className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={toggleGrid}
            title={showGrid ? "Hide Grid Texture" : "Show Grid Texture"}
            className={`p-1.5 rounded-lg transition ${
              showGrid
                ? "bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            <GridIcon className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={toggleDeviceFrame}
            title={showDeviceFrame ? "Hide Realistic Device Frame" : "Show Realistic Device Frame"}
            className={`p-1.5 rounded-lg transition ${
              showDeviceFrame
                ? "bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            <Frame className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
