"use client";

import React from "react";
import { BuilderNode, Device } from "@/types/builder";
import { computeEffectiveStyles } from "@/lib/builder/utils";
import { useBuilderStore } from "@/lib/store/useBuilderStore";
import { RecursiveRenderer } from "./RecursiveRenderer";
import { useDroppable } from "@dnd-kit/core";
import { Copy, Trash2, ArrowUp, Plus } from "lucide-react";

interface CanvasNodeProps {
  node: BuilderNode;
  device: Device;
}

export const CanvasNode: React.FC<CanvasNodeProps> = ({ node, device }) => {
  const {
    selectedNodeId,
    hoveredNodeId,
    previewMode,
    selectNode,
    setHoveredNode,
    deleteNode,
    duplicateNode,
  } = useBuilderStore();

  const isSelected = selectedNodeId === node.id && !previewMode;
  const isHovered = hoveredNodeId === node.id && !isSelected && !previewMode;

  const isContainerType = ["container", "section", "grid", "card"].includes(
    node.type
  );

  // Droppable hook for nesting elements
  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${node.id}`,
    data: {
      type: "canvas-container",
      nodeId: node.id,
    },
    disabled: !isContainerType,
  });

  const effectiveStyles = computeEffectiveStyles(node, device);

  const handleClick = (e: React.MouseEvent) => {
    if (previewMode) return;
    e.stopPropagation();
    selectNode(node.id);
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (previewMode) return;
    e.stopPropagation();
    setHoveredNode(node.id);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (previewMode) return;
    e.stopPropagation();
    if (hoveredNodeId === node.id) {
      setHoveredNode(null);
    }
  };

  const handleSelectParent = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.parentId) {
      selectNode(node.parentId);
    } else {
      selectNode(null);
    }
  };

  // Border & outline styling for visual builder
  const outlineStyles: React.CSSProperties = !previewMode
    ? {
        position: "relative",
        outline: isSelected
          ? "2px solid #6366f1"
          : isOver
          ? "2px dashed #10b981"
          : isHovered
          ? "1px dashed #64748b"
          : "none",
        outlineOffset: "-1px",
      }
    : {};

  const mergedStyles: React.CSSProperties = {
    ...effectiveStyles,
    ...outlineStyles,
  };

  const renderBadge = () => {
    if (!isSelected || previewMode) return null;

    return (
      <div
        className="absolute -top-7 left-0 z-50 flex items-center gap-1.5 px-2 py-0.5 rounded-t text-xs font-semibold text-white bg-indigo-600 shadow-md select-none pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <span>{node.name || node.type}</span>
        {node.parentId && (
          <button
            title="Select Parent"
            onClick={handleSelectParent}
            className="p-0.5 hover:bg-indigo-700 rounded transition"
          >
            <ArrowUp className="w-3 h-3" />
          </button>
        )}
        <button
          title="Duplicate"
          onClick={() => duplicateNode(node.id)}
          className="p-0.5 hover:bg-indigo-700 rounded transition"
        >
          <Copy className="w-3 h-3" />
        </button>
        <button
          title="Delete"
          onClick={() => deleteNode(node.id)}
          className="p-0.5 hover:bg-red-600 rounded transition"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    );
  };

  const renderEmptyContainerNotice = () => {
    if (
      isContainerType &&
      (!node.children || node.children.length === 0) &&
      !previewMode
    ) {
      return (
        <div className="flex flex-col items-center justify-center p-6 border border-dashed border-zinc-700 rounded-lg text-zinc-500 hover:text-zinc-400 bg-zinc-900/40 w-full min-h-[70px]">
          <Plus className="w-4 h-4 mb-1" />
          <span className="text-xs">Drop or add elements here</span>
        </div>
      );
    }
    return null;
  };

  const renderContent = () => {
    switch (node.type) {
      case "heading": {
        const Tag = node.props.tag || "h2";
        return (
          <Tag
            ref={setNodeRef}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={mergedStyles}
          >
            {renderBadge()}
            {node.props.content || "Heading Text"}
          </Tag>
        );
      }

      case "text": {
        const Tag = node.props.tag || "p";
        return (
          <Tag
            ref={setNodeRef}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={mergedStyles}
          >
            {renderBadge()}
            {node.props.content || "Paragraph content text..."}
          </Tag>
        );
      }

      case "button": {
        return (
          <button
            ref={setNodeRef}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={mergedStyles}
          >
            {renderBadge()}
            {node.props.content || "Button"}
          </button>
        );
      }

      case "image": {
        return (
          <div
            ref={setNodeRef}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              position: "relative",
              display: "inline-block",
              width: mergedStyles.width || "100%",
            }}
          >
            {renderBadge()}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                node.props.src ||
                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
              }
              alt={node.props.alt || "Visual Builder Image"}
              style={{
                ...mergedStyles,
                display: "block",
              }}
            />
          </div>
        );
      }

      case "grid":
      case "section":
      case "container":
      case "card":
      default: {
        return (
          <div
            ref={setNodeRef}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={mergedStyles}
          >
            {renderBadge()}
            {renderEmptyContainerNotice()}
            {node.children && node.children.length > 0 && (
              <RecursiveRenderer nodes={node.children} device={device} />
            )}
          </div>
        );
      }
    }
  };

  return renderContent();
};
