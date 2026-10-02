"use client";

import React, { useState } from "react";
import { DraggableSidebarItem } from "./DraggableSidebarItem";
import { LayersTree } from "./LayersTree";
import { BlocksLibrary } from "./BlocksLibrary";
import {
  Component,
  FolderTree,
  Sparkles,
  Layers,
  Layout,
  Grid,
  CreditCard,
  Heading,
  Type,
  MousePointerClick,
  Image as ImageIcon,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"components" | "blocks" | "layers">("components");

  return (
    <aside className="w-80 bg-zinc-950 border-r border-zinc-800/80 flex flex-col h-full select-none z-20">
      {/* Tabs Header */}
      <div className="flex items-center border-b border-zinc-800/80 bg-zinc-900/40 p-1.5 gap-1">
        <button
          onClick={() => setActiveTab("components")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === "components"
              ? "bg-zinc-800 text-white shadow-sm font-semibold"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
          }`}
        >
          <Component className="w-3.5 h-3.5" />
          <span>Elements</span>
        </button>

        <button
          onClick={() => setActiveTab("blocks")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === "blocks"
              ? "bg-zinc-800 text-white shadow-sm font-semibold"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Blocks</span>
        </button>

        <button
          onClick={() => setActiveTab("layers")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === "layers"
              ? "bg-zinc-800 text-white shadow-sm font-semibold"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
          }`}
        >
          <FolderTree className="w-3.5 h-3.5" />
          <span>Layers</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === "components" && (
          <div className="space-y-5">
            {/* Layout Section */}
            <div>
              <div className="flex items-center gap-1.5 px-1 mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                <Layout className="w-3 h-3" />
                <span>Layout & Containers</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <DraggableSidebarItem
                  type="section"
                  label="Section"
                  description="Full-width outer layout block"
                  icon={<Layers className="w-4 h-4 text-purple-400" />}
                />
                <DraggableSidebarItem
                  type="container"
                  label="Container"
                  description="Flexbox inner content wrapper"
                  icon={<Layout className="w-4 h-4 text-blue-400" />}
                />
                <DraggableSidebarItem
                  type="grid"
                  label="2-Column Grid"
                  description="Responsive multi-column grid"
                  icon={<Grid className="w-4 h-4 text-emerald-400" />}
                />
                <DraggableSidebarItem
                  type="card"
                  label="Feature Card"
                  description="Pre-composed title & text card"
                  icon={<CreditCard className="w-4 h-4 text-cyan-400" />}
                />
              </div>
            </div>

            {/* Typography & Media */}
            <div>
              <div className="flex items-center gap-1.5 px-1 mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                <Type className="w-3 h-3" />
                <span>Content & Typography</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <DraggableSidebarItem
                  type="heading"
                  label="Heading"
                  description="Title H1-H4 typography"
                  icon={<Heading className="w-4 h-4 text-amber-400" />}
                />
                <DraggableSidebarItem
                  type="text"
                  label="Paragraph"
                  description="Rich body text copy"
                  icon={<Type className="w-4 h-4 text-zinc-300" />}
                />
                <DraggableSidebarItem
                  type="button"
                  label="Action Button"
                  description="Interactive styled link/button"
                  icon={<MousePointerClick className="w-4 h-4 text-indigo-400" />}
                />
                <DraggableSidebarItem
                  type="image"
                  label="Media Image"
                  description="Responsive visual image asset"
                  icon={<ImageIcon className="w-4 h-4 text-pink-400" />}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "blocks" && <BlocksLibrary />}

        {activeTab === "layers" && <LayersTree />}
      </div>
    </aside>
  );
};
