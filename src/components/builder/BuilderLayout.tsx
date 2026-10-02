"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";
import { Canvas } from "./Canvas";
import { Inspector } from "./Inspector";
import { useBuilderStore } from "@/lib/store/useBuilderStore";
import { NodeType } from "@/types/builder";
import { Sparkles } from "lucide-react";

interface BuilderLayoutProps {
  onSave?: () => Promise<void>;
}

export const BuilderLayout: React.FC<BuilderLayoutProps> = ({ onSave }) => {
  const { addNode, moveNode, previewMode } = useBuilderStore();
  const [activeDragData, setActiveDragData] = useState<{
    type?: string;
    nodeType?: NodeType;
    label?: string;
  } | null>(null);

  // Require a 5px movement before initiating drag to allow simple clicks
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current;
    if (data) {
      setActiveDragData(data as { type?: string; nodeType?: NodeType; label?: string });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragData(null);

    if (!over) return;

    const activeData = active.data.current as
      | { type?: string; nodeType?: NodeType; nodeId?: string }
      | undefined;
    const overId = String(over.id);

    if (activeData?.type === "sidebar-item" && activeData.nodeType) {
      if (overId === "droppable-canvas-root") {
        // Dropped on root canvas
        addNode(activeData.nodeType, null);
      } else if (overId.startsWith("droppable-")) {
        // Dropped inside a container
        const targetContainerId = overId.replace("droppable-", "");
        addNode(activeData.nodeType, targetContainerId);
      }
    } else if (activeData?.type === "canvas-node" && activeData.nodeId) {
      // Reordering / moving canvas node
      if (overId === "droppable-canvas-root") {
        moveNode(activeData.nodeId, null);
      } else if (overId.startsWith("droppable-")) {
        const targetContainerId = overId.replace("droppable-", "");
        moveNode(activeData.nodeId, targetContainerId);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-screen w-screen bg-zinc-950 text-zinc-100 overflow-hidden select-none">
        {/* Top Navigation Bar */}
        <TopBar onSave={onSave} />

        {/* Main Work Area: Left Sidebar, Center Canvas, Right Inspector */}
        <div className="flex-1 flex flex-row overflow-hidden relative">
          {!previewMode && <Sidebar />}

          <Canvas />

          {!previewMode && <Inspector />}
        </div>
      </div>

      {/* Drag Overlay Preview */}
      <DragOverlay>
        {activeDragData ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-600 text-white font-medium text-xs shadow-2xl ring-2 ring-indigo-400 select-none cursor-grabbing">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Drop {activeDragData.label || activeDragData.nodeType}</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
