"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { NodeType, useBuilderStore } from "@/store/useBuilderStore";

interface DraggableSidebarItemProps {
  type: NodeType;
  label: string;
  icon: React.ReactNode;
  description?: string;
}

export const DraggableSidebarItem: React.FC<DraggableSidebarItemProps> = ({
  type,
  label,
  icon,
  description,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-item-${type}`,
    data: {
      type: "sidebar-item",
      nodeType: type,
      label,
    },
  });

  const { addNode, selectedNodeId } = useBuilderStore();

  const handleClick = () => {
    addNode(type, selectedNodeId);
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      className={`group flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-[#050505] hover:bg-white/5 hover:border-indigo-500/50 cursor-grab active:cursor-grabbing transition-all select-none ${
        isDragging ? "opacity-40 border-indigo-500 scale-95" : ""
      }`}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 group-hover:bg-indigo-600/20 group-hover:text-indigo-400 text-zinc-400 transition-colors">
        {icon}
      </div>
      <div className="flex flex-col text-left">
        <span className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">
          {label}
        </span>
        {description && (
          <span className="text-[11px] text-zinc-500 group-hover:text-zinc-400">
            {description}
          </span>
        )}
      </div>
    </div>
  );
};
