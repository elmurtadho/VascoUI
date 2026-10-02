"use client";

import React, { useState } from "react";
import { useBuilderStore } from "@/lib/store/useBuilderStore";
import { findNodeById, computeEffectiveStyles } from "@/lib/builder/utils";
import {
  SlidersHorizontal,
  Layout,
  Type,
  Palette,
  Box,
  Trash2,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Tablet,
  Monitor,
} from "lucide-react";

export const Inspector: React.FC = () => {
  const {
    nodes,
    selectedNodeId,
    currentDevice,
    updateNodeProps,
    updateNodeStyles,
    deleteNode,
    duplicateNode,
  } = useBuilderStore();

  // Accordion state
  const [openSections, setOpenSections] = useState({
    props: true,
    layout: true,
    spacing: true,
    typography: true,
    appearance: true,
    borders: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const selectedNode = selectedNodeId ? findNodeById(nodes, selectedNodeId) : null;

  if (!selectedNode) {
    return (
      <aside className="w-80 bg-zinc-950 border-l border-zinc-800/80 flex flex-col items-center justify-center p-6 text-center select-none z-20">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-600 mb-4">
          <SlidersHorizontal className="w-6 h-6 stroke-[1.5]" />
        </div>
        <h3 className="text-xs font-semibold text-zinc-300 mb-1">
          No Element Selected
        </h3>
        <p className="text-[11px] text-zinc-500 max-w-[200px]">
          Click on any element on the canvas to inspect and edit its styles for the{" "}
          <strong className="text-zinc-400 capitalize">{currentDevice}</strong>{" "}
          breakpoint.
        </p>
      </aside>
    );
  }

  const effectiveStyles = computeEffectiveStyles(selectedNode, currentDevice);
  const currentDeviceStyles = selectedNode.styles[currentDevice] || {};

  const handleStyleChange = (key: keyof React.CSSProperties, value: unknown) => {
    updateNodeStyles(selectedNode.id, { [key]: value }, currentDevice);
  };

  const getDeviceIcon = () => {
    switch (currentDevice) {
      case "mobile":
        return <Smartphone className="w-3.5 h-3.5 text-indigo-400" />;
      case "tablet":
        return <Tablet className="w-3.5 h-3.5 text-indigo-400" />;
      case "desktop":
      default:
        return <Monitor className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  return (
    <aside className="w-80 bg-zinc-950 border-l border-zinc-800/80 flex flex-col h-full select-none z-20 overflow-y-auto">
      {/* Node Header & Actions */}
      <div className="p-4 border-b border-zinc-800/80 bg-zinc-900/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {selectedNode.type}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              #{selectedNode.id.substring(0, 8)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => duplicateNode(selectedNode.id)}
              title="Duplicate Element"
              className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => deleteNode(selectedNode.id)}
              title="Delete Element"
              className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-red-400 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Breakpoint Notice Banner */}
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-[11px] text-indigo-300">
          {getDeviceIcon()}
          <span>
            Editing <strong className="capitalize">{currentDevice}</strong> styles
          </span>
        </div>
      </div>

      <div className="divide-y divide-zinc-800/60 text-xs">
        {/* SECTION 1: Content & Element Props */}
        <div className="p-4">
          <button
            onClick={() => toggleSection("props")}
            className="flex items-center justify-between w-full text-zinc-300 font-semibold mb-3 hover:text-white"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              <span>Element Properties</span>
            </div>
            {openSections.props ? (
              <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            )}
          </button>

          {openSections.props && (
            <div className="space-y-3">
              {/* Content / Text / Button Text */}
              {["heading", "text", "button"].includes(selectedNode.type) && (
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">
                    Text Content
                  </label>
                  <textarea
                    rows={2}
                    value={selectedNode.props.content || ""}
                    onChange={(e) =>
                      updateNodeProps(selectedNode.id, { content: e.target.value })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white placeholder-zinc-500 focus:border-indigo-500 outline-none resize-none"
                  />
                </div>
              )}

              {/* Tag selector for headings */}
              {selectedNode.type === "heading" && (
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">
                    HTML Heading Tag
                  </label>
                  <select
                    value={selectedNode.props.tag || "h2"}
                    onChange={(e) =>
                      updateNodeProps(selectedNode.id, {
                        tag: e.target.value as "h1" | "h2" | "h3" | "h4",
                      })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:border-indigo-500 outline-none"
                  >
                    <option value="h1">H1 (Hero Heading)</option>
                    <option value="h2">H2 (Section Heading)</option>
                    <option value="h3">H3 (Sub-heading)</option>
                    <option value="h4">H4 (Small Heading)</option>
                  </select>
                </div>
              )}

              {/* Button Link */}
              {selectedNode.type === "button" && (
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">
                    Link Destination (href)
                  </label>
                  <input
                    type="text"
                    value={selectedNode.props.href || "#"}
                    onChange={(e) =>
                      updateNodeProps(selectedNode.id, { href: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:border-indigo-500 outline-none"
                  />
                </div>
              )}

              {/* Image URL & Alt */}
              {selectedNode.type === "image" && (
                <>
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={selectedNode.props.src || ""}
                      onChange={(e) =>
                        updateNodeProps(selectedNode.id, { src: e.target.value })
                      }
                      placeholder="https://..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">
                      Alt Description
                    </label>
                    <input
                      type="text"
                      value={selectedNode.props.alt || ""}
                      onChange={(e) =>
                        updateNodeProps(selectedNode.id, { alt: e.target.value })
                      }
                      placeholder="Image description..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* SECTION 2: Layout (Display, Flex, Grid) */}
        <div className="p-4">
          <button
            onClick={() => toggleSection("layout")}
            className="flex items-center justify-between w-full text-zinc-300 font-semibold mb-3 hover:text-white"
          >
            <div className="flex items-center gap-2">
              <Layout className="w-3.5 h-3.5 text-zinc-400" />
              <span>Layout & Flexbox</span>
            </div>
            {openSections.layout ? (
              <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            )}
          </button>

          {openSections.layout && (
            <div className="space-y-3">
              {/* Display */}
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Display</label>
                <div className="grid grid-cols-4 gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                  {["block", "flex", "grid", "inline-flex"].map((d) => (
                    <button
                      key={d}
                      onClick={() => handleStyleChange("display", d)}
                      className={`py-1 text-[11px] rounded transition ${
                        (effectiveStyles.display || "block") === d
                          ? "bg-indigo-600 text-white font-medium"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flex Direction */}
              {(effectiveStyles.display === "flex" ||
                effectiveStyles.display === "inline-flex") && (
                <>
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">
                      Direction
                    </label>
                    <div className="grid grid-cols-2 gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                      {[
                        { label: "Row", val: "row" },
                        { label: "Column", val: "column" },
                      ].map((item) => (
                        <button
                          key={item.val}
                          onClick={() => handleStyleChange("flexDirection", item.val)}
                          className={`py-1 text-[11px] rounded transition ${
                            effectiveStyles.flexDirection === item.val
                              ? "bg-indigo-600 text-white font-medium"
                              : "text-zinc-400 hover:text-white"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Justify Content */}
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">
                      Justify Content
                    </label>
                    <select
                      value={effectiveStyles.justifyContent || "flex-start"}
                      onChange={(e) =>
                        handleStyleChange("justifyContent", e.target.value)
                      }
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:border-indigo-500 outline-none"
                    >
                      <option value="flex-start">Start</option>
                      <option value="center">Center</option>
                      <option value="flex-end">End</option>
                      <option value="space-between">Space Between</option>
                      <option value="space-around">Space Around</option>
                    </select>
                  </div>

                  {/* Align Items */}
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">
                      Align Items
                    </label>
                    <select
                      value={effectiveStyles.alignItems || "stretch"}
                      onChange={(e) =>
                        handleStyleChange("alignItems", e.target.value)
                      }
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:border-indigo-500 outline-none"
                    >
                      <option value="stretch">Stretch</option>
                      <option value="flex-start">Start</option>
                      <option value="center">Center</option>
                      <option value="flex-end">End</option>
                    </select>
                  </div>

                  {/* Gap */}
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">
                      Gap ({effectiveStyles.gap || "0px"})
                    </label>
                    <input
                      type="text"
                      value={effectiveStyles.gap || ""}
                      onChange={(e) => handleStyleChange("gap", e.target.value)}
                      placeholder="16px"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                </>
              )}

              {/* Grid Columns */}
              {effectiveStyles.display === "grid" && (
                <>
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">
                      Grid Template Columns
                    </label>
                    <input
                      type="text"
                      value={effectiveStyles.gridTemplateColumns || ""}
                      onChange={(e) =>
                        handleStyleChange("gridTemplateColumns", e.target.value)
                      }
                      placeholder="repeat(2, minmax(0, 1fr))"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">
                      Grid Gap
                    </label>
                    <input
                      type="text"
                      value={effectiveStyles.gap || ""}
                      onChange={(e) => handleStyleChange("gap", e.target.value)}
                      placeholder="20px"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* SECTION 3: Spacing (Padding & Margin) */}
        <div className="p-4">
          <button
            onClick={() => toggleSection("spacing")}
            className="flex items-center justify-between w-full text-zinc-300 font-semibold mb-3 hover:text-white"
          >
            <div className="flex items-center gap-2">
              <Box className="w-3.5 h-3.5 text-zinc-400" />
              <span>Spacing & Dimensions</span>
            </div>
            {openSections.spacing ? (
              <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            )}
          </button>

          {openSections.spacing && (
            <div className="space-y-3">
              {/* Padding */}
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">
                  Padding (e.g. 24px or 20px 16px)
                </label>
                <input
                  type="text"
                  value={effectiveStyles.padding || ""}
                  onChange={(e) => handleStyleChange("padding", e.target.value)}
                  placeholder="24px"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:border-indigo-500 outline-none"
                />
              </div>

              {/* Margin */}
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">
                  Margin (e.g. 0px auto or 16px)
                </label>
                <input
                  type="text"
                  value={effectiveStyles.margin || ""}
                  onChange={(e) => handleStyleChange("margin", e.target.value)}
                  placeholder="0px auto"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:border-indigo-500 outline-none"
                />
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Width</label>
                  <input
                    type="text"
                    value={effectiveStyles.width || ""}
                    onChange={(e) => handleStyleChange("width", e.target.value)}
                    placeholder="100% or auto"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Max Width</label>
                  <input
                    type="text"
                    value={effectiveStyles.maxWidth || ""}
                    onChange={(e) => handleStyleChange("maxWidth", e.target.value)}
                    placeholder="1200px"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 4: Typography */}
        <div className="p-4">
          <button
            onClick={() => toggleSection("typography")}
            className="flex items-center justify-between w-full text-zinc-300 font-semibold mb-3 hover:text-white"
          >
            <div className="flex items-center gap-2">
              <Type className="w-3.5 h-3.5 text-zinc-400" />
              <span>Typography</span>
            </div>
            {openSections.typography ? (
              <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            )}
          </button>

          {openSections.typography && (
            <div className="space-y-3">
              {/* Font Size & Weight */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Font Size</label>
                  <input
                    type="text"
                    value={effectiveStyles.fontSize || ""}
                    onChange={(e) => handleStyleChange("fontSize", e.target.value)}
                    placeholder="16px"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">
                    Font Weight
                  </label>
                  <select
                    value={effectiveStyles.fontWeight || "400"}
                    onChange={(e) => handleStyleChange("fontWeight", e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:border-indigo-500 outline-none"
                  >
                    <option value="400">Normal (400)</option>
                    <option value="500">Medium (500)</option>
                    <option value="600">Semibold (600)</option>
                    <option value="700">Bold (700)</option>
                    <option value="800">Extrabold (800)</option>
                  </select>
                </div>
              </div>

              {/* Text Align */}
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Text Align</label>
                <div className="grid grid-cols-4 gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                  {["left", "center", "right", "justify"].map((align) => (
                    <button
                      key={align}
                      onClick={() => handleStyleChange("textAlign", align)}
                      className={`py-1 text-[11px] capitalize rounded transition ${
                        effectiveStyles.textAlign === align
                          ? "bg-indigo-600 text-white font-medium"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {align}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Color */}
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Text Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={
                      effectiveStyles.color && typeof effectiveStyles.color === "string"
                        ? effectiveStyles.color
                        : "#ffffff"
                    }
                    onChange={(e) => handleStyleChange("color", e.target.value)}
                    className="w-8 h-8 rounded border border-zinc-800 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={effectiveStyles.color || ""}
                    onChange={(e) => handleStyleChange("color", e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 5: Background & Appearance */}
        <div className="p-4">
          <button
            onClick={() => toggleSection("appearance")}
            className="flex items-center justify-between w-full text-zinc-300 font-semibold mb-3 hover:text-white"
          >
            <div className="flex items-center gap-2">
              <Palette className="w-3.5 h-3.5 text-zinc-400" />
              <span>Background & Border</span>
            </div>
            {openSections.appearance ? (
              <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            )}
          </button>

          {openSections.appearance && (
            <div className="space-y-3">
              {/* Background Color */}
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">
                  Background Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={
                      effectiveStyles.backgroundColor &&
                      typeof effectiveStyles.backgroundColor === "string"
                        ? effectiveStyles.backgroundColor
                        : "#000000"
                    }
                    onChange={(e) =>
                      handleStyleChange("backgroundColor", e.target.value)
                    }
                    className="w-8 h-8 rounded border border-zinc-800 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={effectiveStyles.backgroundColor || ""}
                    onChange={(e) =>
                      handleStyleChange("backgroundColor", e.target.value)
                    }
                    placeholder="transparent or #18181b"
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Border Radius */}
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">
                  Border Radius ({effectiveStyles.borderRadius || "0px"})
                </label>
                <input
                  type="text"
                  value={effectiveStyles.borderRadius || ""}
                  onChange={(e) => handleStyleChange("borderRadius", e.target.value)}
                  placeholder="8px or 9999px"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:border-indigo-500 outline-none"
                />
              </div>

              {/* Border */}
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">
                  Border (Width, Style, Color)
                </label>
                <input
                  type="text"
                  value={effectiveStyles.border || ""}
                  onChange={(e) => handleStyleChange("border", e.target.value)}
                  placeholder="1px solid #27272a"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
