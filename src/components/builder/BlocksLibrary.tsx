"use client";

import React from "react";
import { templateBlocks, TemplateBlock } from "@/lib/builder/blocks";
import { useBuilderStore } from "@/lib/store/useBuilderStore";
import { Plus, Sparkles, Navigation, Layers, Grid, CreditCard, Megaphone, Footprints } from "lucide-react";

function getCategoryIcon(cat: TemplateBlock["category"]) {
  switch (cat) {
    case "navigation":
      return <Navigation className="w-3.5 h-3.5 text-blue-400" />;
    case "hero":
      return <Sparkles className="w-3.5 h-3.5 text-indigo-400" />;
    case "features":
      return <Grid className="w-3.5 h-3.5 text-emerald-400" />;
    case "pricing":
      return <CreditCard className="w-3.5 h-3.5 text-amber-400" />;
    case "cta":
      return <Megaphone className="w-3.5 h-3.5 text-rose-400" />;
    case "footer":
      return <Footprints className="w-3.5 h-3.5 text-purple-400" />;
    default:
      return <Layers className="w-3.5 h-3.5 text-zinc-400" />;
  }
}

export const BlocksLibrary: React.FC = () => {
  const { insertBlock } = useBuilderStore();

  const handleAddBlock = (block: TemplateBlock) => {
    const node = block.generate();
    insertBlock(node);
  };

  return (
    <div className="flex flex-col gap-3 py-1">
      <div className="px-1 text-[11px] text-zinc-400 leading-relaxed">
        Pre-designed, fully responsive landing page sections. Click to insert into your canvas:
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {templateBlocks.map((block) => (
          <div
            key={block.id}
            className="group flex flex-col p-3 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/80 hover:border-zinc-700 transition-all select-none"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-zinc-800 group-hover:bg-zinc-700/80">
                  {getCategoryIcon(block.category)}
                </div>
                <span className="text-xs font-semibold text-zinc-200 group-hover:text-white">
                  {block.name}
                </span>
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 bg-zinc-800/80 px-1.5 py-0.5 rounded">
                {block.category}
              </span>
            </div>

            <p className="text-[11px] text-zinc-400 leading-snug mb-3">
              {block.description}
            </p>

            <button
              onClick={() => handleAddBlock(block)}
              className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-indigo-600/20 group-hover:bg-indigo-600 text-indigo-300 group-hover:text-white transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Insert Section</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
