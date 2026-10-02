import React from "react";

export type Device = "desktop" | "tablet" | "mobile";

export type NodeType =
  | "container"
  | "section"
  | "grid"
  | "heading"
  | "text"
  | "button"
  | "image"
  | "card";

export interface BreakpointStyles {
  desktop?: React.CSSProperties;
  tablet?: React.CSSProperties;
  mobile?: React.CSSProperties;
}

export interface NodeCustomProps {
  content?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  src?: string;
  alt?: string;
  href?: string;
  target?: "_blank" | "_self";
  columns?: number;
  gap?: string;
  [key: string]: unknown;
}

export interface BuilderNode {
  id: string;
  type: NodeType;
  name: string;
  props: NodeCustomProps;
  styles: BreakpointStyles;
  children: BuilderNode[];
  parentId?: string | null;
}

export interface DragItemData {
  type: "sidebar-item" | "canvas-node";
  nodeType?: NodeType;
  nodeId?: string;
  label?: string;
  defaultData?: Partial<BuilderNode>;
}

export interface ViewportConfig {
  width: string;
  maxWidth: string;
  label: string;
  iconName: string;
}
