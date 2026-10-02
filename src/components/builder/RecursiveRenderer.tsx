"use client";

import React from "react";
import { BuilderNode, Device } from "@/types/builder";
import { CanvasNode } from "./CanvasNode";

interface RecursiveRendererProps {
  nodes: BuilderNode[];
  device: Device;
}

export const RecursiveRenderer: React.FC<RecursiveRendererProps> = ({
  nodes,
  device,
}) => {
  if (!nodes || nodes.length === 0) return null;

  return (
    <>
      {nodes.map((node) => (
        <CanvasNode key={node.id} node={node} device={device} />
      ))}
    </>
  );
};
