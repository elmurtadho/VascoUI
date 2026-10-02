"use client";

import React, { useState, useRef, useEffect } from "react";
import { useBuilderStore, computeEffectiveStyles } from "@/store/useBuilderStore";
import { RecursiveRenderer } from "./RecursiveRenderer";
import { useDroppable } from "@dnd-kit/core";
import {
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  ChevronUp,
  Plus,
} from "lucide-react";

interface CanvasNodeProps {
  nodeId: string;
}

export const CanvasNode: React.FC<CanvasNodeProps> = ({ nodeId }) => {
  const node = useBuilderStore((state) => state.nodes[nodeId]);
  const {
    selectedNodeId,
    hoveredNodeId,
    viewport,
    previewMode,
    selectNode,
    setHoveredNode,
    deleteNode,
    duplicateNode,
    moveNodeUp,
    moveNodeDown,
    updateNodeProps,
  } = useBuilderStore();

  const [isEditingInline, setIsEditingInline] = useState(false);
  const [inlineValue, setInlineValue] = useState(node?.props.content || "");
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditingInline && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingInline]);

  useEffect(() => {
    if (node) {
      setInlineValue(node.props.content || "");
    }
  }, [node?.props.content]);

  if (!node) return null;

  const isSelected = selectedNodeId === node.id && !previewMode;
  const isHovered = hoveredNodeId === node.id && !isSelected && !previewMode;

  const isContainerType = [
    "root",
    "container",
    "section",
    "grid",
    "card",
  ].includes(node.type);

  // Droppable container hook
  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${node.id}`,
    data: {
      type: "canvas-container",
      nodeId: node.id,
    },
    disabled: !isContainerType,
  });

  const effectiveStyles = computeEffectiveStyles(node, viewport);

  const handleClick = (e: React.MouseEvent) => {
    if (previewMode) return;
    e.stopPropagation();
    selectNode(node.id);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (previewMode) return;
    e.stopPropagation();
    if (["heading", "text", "button"].includes(node.type)) {
      setIsEditingInline(true);
    }
  };

  const handleInlineBlur = () => {
    setIsEditingInline(false);
    updateNodeProps(node.id, { content: inlineValue });
  };

  const handleInlineKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleInlineBlur();
    } else if (e.key === "Escape") {
      setIsEditingInline(false);
      setInlineValue(node.props.content || "");
    }
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

  const outlineStyles: React.CSSProperties =
    !previewMode && node.type !== "root"
      ? {
          position: "relative",
          outline: isSelected
            ? "2px solid #6366f1"
            : isOver
            ? "2px dashed #10b981"
            : isHovered
            ? "1px dashed rgba(255, 255, 255, 0.2)"
            : "none",
          outlineOffset: "-1px",
        }
      : {};

  const mergedStyles: React.CSSProperties = {
    ...effectiveStyles,
    ...outlineStyles,
  };

  const renderBadge = () => {
    if (!isSelected || previewMode || node.type === "root") return null;

    return (
      <div
        className="absolute -top-7 left-0 z-50 flex items-center gap-1 px-2.5 py-0.5 rounded-t-md text-[11px] font-semibold text-white bg-indigo-600 shadow-xl select-none pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="capitalize">{node.name || node.type}</span>

        <div className="h-3 w-px bg-indigo-400/50 mx-0.5" />

        <button
          title="Move Up"
          onClick={() => moveNodeUp(node.id)}
          className="p-0.5 hover:bg-indigo-700 rounded transition text-indigo-100 hover:text-white"
        >
          <ArrowUp className="w-3 h-3" />
        </button>

        <button
          title="Move Down"
          onClick={() => moveNodeDown(node.id)}
          className="p-0.5 hover:bg-indigo-700 rounded transition text-indigo-100 hover:text-white"
        >
          <ArrowDown className="w-3 h-3" />
        </button>

        {node.parentId && (
          <button
            title="Select Parent"
            onClick={handleSelectParent}
            className="p-0.5 hover:bg-indigo-700 rounded transition text-indigo-100 hover:text-white"
          >
            <ChevronUp className="w-3 h-3" />
          </button>
        )}

        <button
          title="Duplicate"
          onClick={() => duplicateNode(node.id)}
          className="p-0.5 hover:bg-indigo-700 rounded transition text-indigo-100 hover:text-white"
        >
          <Copy className="w-3 h-3" />
        </button>

        <button
          title="Delete"
          onClick={() => deleteNode(node.id)}
          className="p-0.5 hover:bg-red-600 rounded transition text-indigo-100 hover:text-white"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    );
  };

  const renderEmptyContainerNotice = () => {
    if (
      isContainerType &&
      node.type !== "root" &&
      (!node.children || node.children.length === 0) &&
      !previewMode
    ) {
      return (
        <div className="flex flex-col items-center justify-center p-6 border border-dashed border-white/10 rounded-xl text-zinc-500 hover:text-zinc-400 bg-white/[0.02] w-full min-h-[70px] transition-colors">
          <Plus className="w-4 h-4 mb-1 text-zinc-600" />
          <span className="text-[11px]">Drop elements or blocks inside</span>
        </div>
      );
    }
    return null;
  };

  const renderChildren = () => {
    if (!node.children || node.children.length === 0) return null;
    return node.children.map((childId) => (
      <RecursiveRenderer key={childId} nodeId={childId} />
    ));
  };

  switch (node.type) {
    case "heading": {
      const Tag = node.props.tag || "h2";
      if (isEditingInline) {
        return (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={inlineValue}
            onChange={(e) => setInlineValue(e.target.value)}
            onBlur={handleInlineBlur}
            onKeyDown={handleInlineKeyDown}
            style={mergedStyles}
            className="bg-transparent outline-none ring-2 ring-indigo-500 rounded px-1"
          />
        );
      }
      return (
        <Tag
          ref={setNodeRef}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
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
      if (isEditingInline) {
        return (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            rows={2}
            value={inlineValue}
            onChange={(e) => setInlineValue(e.target.value)}
            onBlur={handleInlineBlur}
            onKeyDown={handleInlineKeyDown}
            style={mergedStyles}
            className="bg-transparent outline-none ring-2 ring-indigo-500 rounded p-1 resize-none w-full"
          />
        );
      }
      return (
        <Tag
          ref={setNodeRef}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
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
      if (isEditingInline) {
        return (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={inlineValue}
            onChange={(e) => setInlineValue(e.target.value)}
            onBlur={handleInlineBlur}
            onKeyDown={handleInlineKeyDown}
            style={mergedStyles}
            className="bg-transparent outline-none ring-2 ring-indigo-500 rounded px-1"
          />
        );
      }
      return (
        <button
          ref={setNodeRef}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
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
              "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"
            }
            alt={node.props.alt || "Visual Builder Graphic"}
            style={{
              ...mergedStyles,
              display: "block",
            }}
          />
        </div>
      );
    }

    case "root":
    case "grid":
    case "section":
    case "container":
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
          {renderChildren()}
        </div>
      );
    }
  }
};
