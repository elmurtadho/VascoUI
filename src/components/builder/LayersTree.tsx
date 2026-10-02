"use client";

import React, { useState } from "react";
import { useBuilderStore, BuilderNode } from "@/store/useBuilderStore";
import {
  Layers,
  Layout,
  Grid,
  Heading,
  Type,
  MousePointerClick,
  Image as ImageIcon,
  ChevronRight,
  ChevronDown,
  Trash2,
  Copy,
} from "lucide-react";

function getNodeIcon(type: string) {
  switch (type) {
    case "section":
      return <Layers className="w-3.5 h-3.5 text-purple-400" />;
    case "container":
      return <Layout className="w-3.5 h-3.5 text-blue-400" />;
    case "grid":
      return <Grid className="w-3.5 h-3.5 text-emerald-400" />;
    case "heading":
      return <Heading className="w-3.5 h-3.5 text-amber-400" />;
    case "text":
      return <Type className="w-3.5 h-3.5 text-zinc-400" />;
    case "button":
      return <MousePointerClick className="w-3.5 h-3.5 text-indigo-400" />;
    case "image":
      return <ImageIcon className="w-3.5 h-3.5 text-pink-400" />;
    default:
      return <Layout className="w-3.5 h-3.5 text-zinc-400" />;
  }
}

interface TreeItemProps {
  nodeId: string;
  depth: number;
}

const TreeItem: React.FC<TreeItemProps> = ({ nodeId, depth }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const node = useBuilderStore((state) => state.nodes[nodeId]);
  const {
    selectedNodeId,
    hoveredNodeId,
    selectNode,
    setHoveredNode,
    deleteNode,
    duplicateNode,
  } = useBuilderStore();

  if (!node) return null;

  const isSelected = selectedNodeId === node.id;
  const isHovered = hoveredNodeId === node.id;
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col select-none">
      <div
        onClick={(e) => {
          e.stopPropagation();
          selectNode(node.id);
        }}
        onMouseEnter={() => setHoveredNode(node.id)}
        onMouseLeave={() => {
          if (hoveredNodeId === node.id) setHoveredNode(null);
        }}
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
        className={`group flex items-center justify-between py-1.5 pr-2 rounded-lg cursor-pointer text-xs transition-colors ${
          isSelected
            ? "bg-indigo-600/20 text-indigo-300 font-medium"
            : isHovered
            ? "bg-white/5 text-zinc-200"
            : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]"
        }`}
      >
        <div className="flex items-center gap-1.5 overflow-hidden">
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="p-0.5 hover:text-white"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-zinc-500" />
              ) : (
                <ChevronRight className="w-3 h-3 text-zinc-500" />
              )}
            </button>
          ) : (
            <div className="w-3" />
          )}
          {getNodeIcon(node.type)}
          <span className="truncate max-w-[130px]">{node.name || node.type}</span>
        </div>

        {node.type !== "root" && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              title="Duplicate"
              onClick={(e) => {
                e.stopPropagation();
                duplicateNode(node.id);
              }}
              className="p-1 hover:text-indigo-400 text-zinc-400"
            >
              <Copy className="w-3 h-3" />
            </button>
            <button
              title="Delete"
              onClick={(e) => {
                e.stopPropagation();
                deleteNode(node.id);
              }}
              className="p-1 hover:text-red-400 text-zinc-400"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {hasChildren && isExpanded && (
        <div className="flex flex-col">
          {node.children.map((childId) => (
            <TreeItem key={childId} nodeId={childId} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const LayersTree: React.FC = () => {
  const { rootNodeId, selectNode } = useBuilderStore();

  return (
    <div
      className="flex flex-col h-full overflow-y-auto px-1 py-2"
      onClick={() => selectNode(null)}
    >
      <TreeItem nodeId={rootNodeId} depth={0} />
    </div>
  );
};
