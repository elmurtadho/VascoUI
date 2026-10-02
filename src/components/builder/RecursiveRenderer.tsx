"use client";

import React from "react";
import { useBuilderStore } from "@/store/useBuilderStore";
import { CanvasNode } from "./CanvasNode";

interface RecursiveRendererProps {
  nodeId: string;
}

export const RecursiveRenderer: React.FC<RecursiveRendererProps> = ({ nodeId }) => {
  const node = useBuilderStore((state) => state.nodes[nodeId]);

  if (!node) return null;

  return <CanvasNode nodeId={nodeId} />;
};
