"use client";

import React, { useState } from "react";
import { DraggableSidebarItem } from "./DraggableSidebarItem";
import { LayersTree } from "./LayersTree";
import {
  Component,
  FolderTree,
  Layers,
  Layout,
  Grid,
  Heading,
  Type,
  MousePointerClick,
  Image as ImageIcon,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"components" | "layers">("components");

  return (
    <aside className="w-72 bg-[#0a0a0a] border-r border-white/10 flex flex-col h-full select-none z-20">
      {/* Tabs Header */}
      <div className="flex items-center border-b border-white/10 bg-[#050505] p-1.5 gap-1">
        <button
          onClick={() => setActiveTab("components")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "components"
              ? "bg-white/10 text-white shadow-sm"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
          }`}
        >
          <Component className="w-3.5 h-3.5" />
          <span>Palette</span>
        </button>

        <button
          onClick={() => setActiveTab("layers")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "layers"
              ? "bg-white/10 text-white shadow-sm"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
          }`}
        >
          <FolderTree className="w-3.5 h-3.5" />
          <span>Layers</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === "components" ? (
          <div className="space-y-5">
            {/* Layout Section */}
            <div>
              <div className="flex items-center gap-1.5 px-1 mb-2.5 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                <Layout className="w-3 h-3" />
                <span>Layout & Structure</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <DraggableSidebarItem
                  type="section"
                  label="Section"
                  description="Outer full-width wrapper"
                  icon={<Layers className="w-4 h-4 text-purple-400" />}
                />
                <DraggableSidebarItem
                  type="container"
                  label="Container"
                  description="Flexbox content container"
                  icon={<Layout className="w-4 h-4 text-blue-400" />}
                />
                <DraggableSidebarItem
                  type="grid"
                  label="2-Column Grid"
                  description="Responsive multi-column grid"
                  icon={<Grid className="w-4 h-4 text-emerald-400" />}
                />
              </div>
            </div>

            {/* Typography & Media */}
            <div>
              <div className="flex items-center gap-1.5 px-1 mb-2.5 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                <Type className="w-3 h-3" />
                <span>Content & Typography</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <DraggableSidebarItem
                  type="heading"
                  label="Heading"
                  description="H1 to H4 title typography"
                  icon={<Heading className="w-4 h-4 text-amber-400" />}
                />
                <DraggableSidebarItem
                  type="text"
                  label="Paragraph"
                  description="Body text paragraph"
                  icon={<Type className="w-4 h-4 text-zinc-300" />}
                />
                <DraggableSidebarItem
                  type="button"
                  label="Action Button"
                  description="Interactive styled button"
                  icon={<MousePointerClick className="w-4 h-4 text-indigo-400" />}
                />
                <DraggableSidebarItem
                  type="image"
                  label="Media Image"
                  description="Responsive image asset"
                  icon={<ImageIcon className="w-4 h-4 text-pink-400" />}
                />
              </div>
            </div>
          </div>
        ) : (
          <LayersTree />
        )}
      </div>
    </aside>
  );
};
