import { create } from "zustand";
import React from "react";

export type Viewport = "desktop" | "tablet" | "mobile";
export type Device = Viewport; // Alias for compatibility

export type NodeType =
  | "root"
  | "section"
  | "container"
  | "grid"
  | "heading"
  | "text"
  | "button"
  | "image"
  | "card";

export interface ResponsiveStyles {
  desktop?: React.CSSProperties;
  tablet?: React.CSSProperties;
  mobile?: React.CSSProperties;
}

export type BreakpointStyles = ResponsiveStyles; // Alias for compatibility

export interface NodeProps {
  styles: ResponsiveStyles;
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

export type NodeCustomProps = NodeProps; // Alias for compatibility

export interface BuilderNode {
  id: string;
  type: NodeType;
  name: string;
  props: NodeProps;
  children: string[]; // List of child node IDs
  parentId?: string | null;
}

export function generateNodeId(prefix: string = "node"): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
}

export function computeEffectiveStyles(
  node: BuilderNode,
  viewport: Viewport
): React.CSSProperties {
  const desktop = node.props.styles?.desktop || {};
  const tablet = node.props.styles?.tablet || {};
  const mobile = node.props.styles?.mobile || {};

  if (viewport === "desktop") {
    return { ...desktop };
  } else if (viewport === "tablet") {
    return { ...desktop, ...tablet };
  } else {
    return { ...desktop, ...tablet, ...mobile };
  }
}

export function createDefaultNode(
  type: NodeType,
  parentId: string | null = null
): BuilderNode {
  const id = generateNodeId(type);

  switch (type) {
    case "section":
      return {
        id,
        type: "section",
        name: "Section",
        parentId,
        children: [],
        props: {
          tag: "div",
          styles: {
            desktop: {
              padding: "80px 24px",
              backgroundColor: "#050505",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              position: "relative",
            },
            mobile: {
              padding: "48px 16px",
            },
          },
        },
      };

    case "container":
      return {
        id,
        type: "container",
        name: "Container",
        parentId,
        children: [],
        props: {
          tag: "div",
          styles: {
            desktop: {
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              padding: "24px",
              backgroundColor: "#0a0a0a",
              borderRadius: "14px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              width: "100%",
              maxWidth: "1140px",
            },
          },
        },
      };

    case "grid":
      return {
        id,
        type: "grid",
        name: "2-Column Grid",
        parentId,
        children: [],
        props: {
          columns: 2,
          gap: "20px",
          styles: {
            desktop: {
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "20px",
              width: "100%",
              padding: "16px",
            },
            mobile: {
              gridTemplateColumns: "1fr",
            },
          },
        },
      };

    case "heading":
      return {
        id,
        type: "heading",
        name: "Heading",
        parentId,
        children: [],
        props: {
          content: "Build High-Conversion Interfaces Visually",
          tag: "h2",
          styles: {
            desktop: {
              fontSize: "38px",
              fontWeight: "700",
              color: "#ffffff",
              letterSpacing: "-0.03em",
              lineHeight: "1.2",
              margin: "0px",
            },
            mobile: {
              fontSize: "28px",
            },
          },
        },
      };

    case "text":
      return {
        id,
        type: "text",
        name: "Paragraph",
        parentId,
        children: [],
        props: {
          content:
            "Design responsive layouts, tweak visual styles for each breakpoint, and sync instantly to edge database.",
          tag: "p",
          styles: {
            desktop: {
              fontSize: "16px",
              color: "#a1a1aa",
              lineHeight: "1.6",
              margin: "0px",
            },
          },
        },
      };

    case "button":
      return {
        id,
        type: "button",
        name: "Primary Button",
        parentId,
        children: [],
        props: {
          content: "Get Started Free",
          href: "#",
          styles: {
            desktop: {
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px 26px",
              backgroundColor: "#6366f1",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "600",
              borderRadius: "10px",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              width: "auto",
            },
          },
        },
      };

    case "image":
      return {
        id,
        type: "image",
        name: "Image",
        parentId,
        children: [],
        props: {
          src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
          alt: "Abstract Studio Graphic",
          styles: {
            desktop: {
              width: "100%",
              height: "320px",
              objectFit: "cover",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            },
          },
        },
      };

    case "card":
    default:
      return {
        id,
        type: "container",
        name: "Container",
        parentId,
        children: [],
        props: {
          styles: {
            desktop: {
              padding: "24px",
              backgroundColor: "#0a0a0a",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            },
          },
        },
      };
  }
}

export const initialNormalizedNodes: Record<string, BuilderNode> = {
  root: {
    id: "root",
    type: "root",
    name: "Page Root",
    parentId: null,
    children: ["hero_section", "features_section"],
    props: {
      styles: {
        desktop: {
          minHeight: "100vh",
          backgroundColor: "#050505",
          color: "#fafafa",
          display: "flex",
          flexDirection: "column",
          width: "100%",
        },
      },
    },
  },
  hero_section: {
    id: "hero_section",
    type: "section",
    name: "Hero Section",
    parentId: "root",
    children: ["hero_container"],
    props: {
      tag: "div",
      styles: {
        desktop: {
          padding: "90px 24px 70px 24px",
          backgroundColor: "#050505",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          textAlign: "center",
        },
        mobile: {
          padding: "50px 16px",
        },
      },
    },
  },
  hero_container: {
    id: "hero_container",
    type: "container",
    name: "Hero Wrapper",
    parentId: "hero_section",
    children: ["hero_badge", "hero_title", "hero_subtitle", "hero_cta_group"],
    props: {
      tag: "div",
      styles: {
        desktop: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "22px",
          maxWidth: "880px",
          width: "100%",
          backgroundColor: "transparent",
          border: "none",
          padding: "0px",
        },
      },
    },
  },
  hero_badge: {
    id: "hero_badge",
    type: "button",
    name: "Hero Announcement",
    parentId: "hero_container",
    children: [],
    props: {
      content: "✨ Next-Gen Visual Web Studio",
      href: "#",
      styles: {
        desktop: {
          display: "inline-flex",
          alignItems: "center",
          padding: "6px 16px",
          backgroundColor: "rgba(99, 102, 241, 0.1)",
          color: "#a5b4fc",
          fontSize: "12px",
          fontWeight: "600",
          borderRadius: "9999px",
          border: "1px solid rgba(99, 102, 241, 0.3)",
          cursor: "pointer",
        },
      },
    },
  },
  hero_title: {
    id: "hero_title",
    type: "heading",
    name: "Hero Title",
    parentId: "hero_container",
    children: [],
    props: {
      content: "Design Visually. Ship Instantly.",
      tag: "h1",
      styles: {
        desktop: {
          fontSize: "56px",
          fontWeight: "800",
          color: "#ffffff",
          letterSpacing: "-0.04em",
          lineHeight: "1.1",
          textAlign: "center",
          margin: "0px",
        },
        tablet: {
          fontSize: "44px",
        },
        mobile: {
          fontSize: "32px",
        },
      },
    },
  },
  hero_subtitle: {
    id: "hero_subtitle",
    type: "text",
    name: "Hero Description",
    parentId: "hero_container",
    children: [],
    props: {
      content:
        "The complete visual page builder powered by Next.js, Zustand, Turso edge database, and seamless Vercel deployment.",
      tag: "p",
      styles: {
        desktop: {
          fontSize: "18px",
          color: "#a1a1aa",
          maxWidth: "680px",
          lineHeight: "1.6",
          textAlign: "center",
          margin: "0px",
        },
        mobile: {
          fontSize: "15px",
        },
      },
    },
  },
  hero_cta_group: {
    id: "hero_cta_group",
    type: "container",
    name: "CTA Group",
    parentId: "hero_container",
    children: ["hero_btn_start", "hero_btn_docs"],
    props: {
      tag: "div",
      styles: {
        desktop: {
          display: "flex",
          flexDirection: "row",
          gap: "14px",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent",
          border: "none",
          padding: "10px 0px",
        },
        mobile: {
          flexDirection: "column",
          width: "100%",
        },
      },
    },
  },
  hero_btn_start: {
    id: "hero_btn_start",
    type: "button",
    name: "Primary CTA",
    parentId: "hero_cta_group",
    children: [],
    props: {
      content: "Start Designing Free →",
      href: "/dashboard",
      styles: {
        desktop: {
          padding: "13px 30px",
          backgroundColor: "#4f46e5",
          color: "#ffffff",
          fontSize: "15px",
          fontWeight: "600",
          borderRadius: "10px",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          cursor: "pointer",
        },
      },
    },
  },
  hero_btn_docs: {
    id: "hero_btn_docs",
    type: "button",
    name: "Secondary CTA",
    parentId: "hero_cta_group",
    children: [],
    props: {
      content: "Explore Templates",
      href: "#",
      styles: {
        desktop: {
          padding: "13px 30px",
          backgroundColor: "#0a0a0a",
          color: "#e4e4e7",
          fontSize: "15px",
          fontWeight: "600",
          borderRadius: "10px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          cursor: "pointer",
        },
      },
    },
  },
  features_section: {
    id: "features_section",
    type: "section",
    name: "Features Section",
    parentId: "root",
    children: ["features_grid"],
    props: {
      tag: "div",
      styles: {
        desktop: {
          padding: "60px 24px 90px 24px",
          backgroundColor: "#050505",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        },
        mobile: {
          padding: "40px 16px",
        },
      },
    },
  },
  features_grid: {
    id: "features_grid",
    type: "grid",
    name: "Features Grid",
    parentId: "features_section",
    children: ["card_edge", "card_responsive", "card_export"],
    props: {
      columns: 3,
      gap: "24px",
      styles: {
        desktop: {
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "24px",
          maxWidth: "1140px",
          width: "100%",
        },
        tablet: {
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        },
        mobile: {
          gridTemplateColumns: "1fr",
        },
      },
    },
  },
  card_edge: {
    id: "card_edge",
    type: "container",
    name: "Edge Card",
    parentId: "features_grid",
    children: ["card_edge_title", "card_edge_desc"],
    props: {
      tag: "div",
      styles: {
        desktop: {
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          padding: "30px 24px",
          backgroundColor: "#0a0a0a",
          borderRadius: "14px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
      },
    },
  },
  card_edge_title: {
    id: "card_edge_title",
    type: "heading",
    name: "Card Title",
    parentId: "card_edge",
    children: [],
    props: {
      content: "⚡ Turso Edge Database",
      tag: "h3",
      styles: {
        desktop: { fontSize: "18px", fontWeight: "700", color: "#ffffff" },
      },
    },
  },
  card_edge_desc: {
    id: "card_edge_desc",
    type: "text",
    name: "Card Description",
    parentId: "card_edge",
    children: [],
    props: {
      content:
        "Sub-10ms queries worldwide with libSQL edge replication and Drizzle ORM.",
      tag: "p",
      styles: {
        desktop: { fontSize: "14px", color: "#a1a1aa", lineHeight: "1.6" },
      },
    },
  },
  card_responsive: {
    id: "card_responsive",
    type: "container",
    name: "Responsive Card",
    parentId: "features_grid",
    children: ["card_resp_title", "card_resp_desc"],
    props: {
      tag: "div",
      styles: {
        desktop: {
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          padding: "30px 24px",
          backgroundColor: "#0a0a0a",
          borderRadius: "14px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
      },
    },
  },
  card_resp_title: {
    id: "card_resp_title",
    type: "heading",
    name: "Card Title",
    parentId: "card_responsive",
    children: [],
    props: {
      content: "📱 Breakpoint System",
      tag: "h3",
      styles: {
        desktop: { fontSize: "18px", fontWeight: "700", color: "#ffffff" },
      },
    },
  },
  card_resp_desc: {
    id: "card_resp_desc",
    type: "text",
    name: "Card Description",
    parentId: "card_responsive",
    children: [],
    props: {
      content:
        "Visual switching between Desktop, Tablet, and Mobile with cascading style inheritance.",
      tag: "p",
      styles: {
        desktop: { fontSize: "14px", color: "#a1a1aa", lineHeight: "1.6" },
      },
    },
  },
  card_export: {
    id: "card_export",
    type: "container",
    name: "Code Export Card",
    parentId: "features_grid",
    children: ["card_export_title", "card_export_desc"],
    props: {
      tag: "div",
      styles: {
        desktop: {
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          padding: "30px 24px",
          backgroundColor: "#0a0a0a",
          borderRadius: "14px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
      },
    },
  },
  card_export_title: {
    id: "card_export_title",
    type: "heading",
    name: "Card Title",
    parentId: "card_export",
    children: [],
    props: {
      content: "💻 Zero Lock-in Export",
      tag: "h3",
      styles: {
        desktop: { fontSize: "18px", fontWeight: "700", color: "#ffffff" },
      },
    },
  },
  card_export_desc: {
    id: "card_export_desc",
    type: "text",
    name: "Card Description",
    parentId: "card_export",
    children: [],
    props: {
      content:
        "Generate clean Next.js React JSX or HTML+CSS with one click copy and download.",
      tag: "p",
      styles: {
        desktop: { fontSize: "14px", color: "#a1a1aa", lineHeight: "1.6" },
      },
    },
  },
};

const MAX_HISTORY = 30;

export interface BuilderState {
  // Tree State
  nodes: Record<string, BuilderNode>;
  rootNodeId: string;
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  viewport: Viewport;
  currentDevice: Viewport; // Alias for compatibility
  previewMode: boolean;

  // Viewport Settings
  zoomLevel: number;
  showGrid: boolean;
  showDeviceFrame: boolean;

  // Project Info
  projectId: string | null;
  projectName: string;
  isSaving: boolean;
  lastSavedAt: Date | null;

  // Undo / Redo
  history: Record<string, BuilderNode>[];
  future: Record<string, BuilderNode>[];

  // Actions
  addNode: (
    nodeOrType: (Partial<BuilderNode> & { type: NodeType }) | NodeType,
    parentId?: string | null,
    index?: number
  ) => string;
  insertBlock: (blockRootNode: any, additionalNodes?: Record<string, BuilderNode>) => void;
  updateNodeProps: (id: string, props: Partial<NodeProps>) => void;
  updateNodeStyles: (
    id: string,
    newStyles: Partial<React.CSSProperties>,
    targetViewport?: Viewport
  ) => void;
  moveNode: (nodeId: string, newParentId: string | null, newIndex?: number) => void;
  moveNodeUp: (nodeId: string) => void;
  moveNodeDown: (nodeId: string) => void;
  deleteNode: (id: string) => void;
  duplicateNode: (id: string) => string | null;
  selectNode: (id: string | null) => void;
  setHoveredNode: (id: string | null) => void;
  setViewport: (viewport: Viewport) => void;
  setDevice: (device: Viewport) => void; // Alias for compatibility
  setPreviewMode: (preview: boolean) => void;
  setZoomLevel: (zoom: number) => void;
  toggleGrid: () => void;
  toggleDeviceFrame: () => void;
  setProjectName: (name: string) => void;
  setSaving: (saving: boolean) => void;
  setLastSavedAt: (date: Date) => void;
  setInitialState: (nodes: Record<string, BuilderNode>, rootNodeId?: string) => void;
  loadProject: (nodes: Record<string, BuilderNode> | BuilderNode[], id?: string, name?: string) => void;
  undo: () => void;
  redo: () => void;
  resetCanvas: () => void;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  nodes: initialNormalizedNodes,
  rootNodeId: "root",
  selectedNodeId: null,
  hoveredNodeId: null,
  viewport: "desktop",
  currentDevice: "desktop",
  previewMode: false,

  zoomLevel: 1,
  showGrid: true,
  showDeviceFrame: true,

  projectId: null,
  projectName: "Untitled Project",
  isSaving: false,
  lastSavedAt: null,

  history: [],
  future: [],

  selectNode: (id) => set({ selectedNodeId: id }),
  setHoveredNode: (id) => set({ hoveredNodeId: id }),
  setViewport: (viewport) => set({ viewport, currentDevice: viewport }),
  setDevice: (device) => set({ viewport: device, currentDevice: device }),
  setPreviewMode: (preview) =>
    set({
      previewMode: preview,
      selectedNodeId: preview ? null : get().selectedNodeId,
    }),
  setZoomLevel: (zoom) => set({ zoomLevel: zoom }),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleDeviceFrame: () =>
    set((state) => ({ showDeviceFrame: !state.showDeviceFrame })),
  setProjectName: (name) => set({ projectName: name }),
  setSaving: (saving) => set({ isSaving: saving }),
  setLastSavedAt: (date) => set({ lastSavedAt: date }),

  addNode: (nodeOrType, parentId = null, index) => {
    const { nodes, rootNodeId, history } = get();
    const targetParentId = parentId || rootNodeId;
    const parent = nodes[targetParentId] || nodes[rootNodeId];

    const type: NodeType =
      typeof nodeOrType === "string" ? nodeOrType : nodeOrType.type;
    const customConfig =
      typeof nodeOrType === "object" ? nodeOrType : null;

    const baseDefault = createDefaultNode(type, targetParentId);
    const newNode: BuilderNode = {
      ...baseDefault,
      ...(customConfig || {}),
      id: customConfig?.id || baseDefault.id,
      parentId: targetParentId,
      children: customConfig?.children || [],
    };

    const updatedParentChildren = [...(parent.children || [])];
    if (
      typeof index === "number" &&
      index >= 0 &&
      index <= updatedParentChildren.length
    ) {
      updatedParentChildren.splice(index, 0, newNode.id);
    } else {
      updatedParentChildren.push(newNode.id);
    }

    const updatedNodes: Record<string, BuilderNode> = {
      ...nodes,
      [newNode.id]: newNode,
      [parent.id]: {
        ...parent,
        children: updatedParentChildren,
      },
    };

    set({
      nodes: updatedNodes,
      selectedNodeId: newNode.id,
      history: [...history.slice(-MAX_HISTORY), nodes],
      future: [],
    });

    return newNode.id;
  },

  insertBlock: (blockRootNode: any, additionalNodes: Record<string, BuilderNode> = {}) => {
    const { nodes, rootNodeId, history } = get();
    const root = nodes[rootNodeId];
    if (!root) return;

    const flattened: Record<string, BuilderNode> = { ...additionalNodes };

    function flatten(n: any, pId: string | null): string {
      const nodeId = n.id || generateNodeId(n.type || "section");
      const childIds: string[] = [];

      if (Array.isArray(n.children)) {
        for (const child of n.children) {
          if (typeof child === "string") {
            childIds.push(child);
          } else if (child && typeof child === "object") {
            childIds.push(flatten(child, nodeId));
          }
        }
      }

      flattened[nodeId] = {
        id: nodeId,
        type: n.type || "section",
        name: n.name || n.type || "Section",
        parentId: pId,
        children: childIds,
        props: n.props?.styles ? n.props : { styles: n.styles || {}, ...n.props },
      };

      return nodeId;
    }

    const insertedRootId = flatten(blockRootNode, rootNodeId);

    const updatedNodes: Record<string, BuilderNode> = {
      ...nodes,
      ...flattened,
      [rootNodeId]: {
        ...root,
        children: [...(root.children || []), insertedRootId],
      },
    };

    set({
      nodes: updatedNodes,
      selectedNodeId: insertedRootId,
      history: [...history.slice(-MAX_HISTORY), nodes],
      future: [],
    });
  },

  updateNodeProps: (id, newProps) => {
    const { nodes, history } = get();
    const node = nodes[id];
    if (!node) return;

    const updatedNode: BuilderNode = {
      ...node,
      props: {
        ...node.props,
        ...newProps,
        styles: {
          ...node.props.styles,
          ...(newProps.styles || {}),
        },
      },
    };

    set({
      nodes: {
        ...nodes,
        [id]: updatedNode,
      },
      history: [...history.slice(-MAX_HISTORY), nodes],
      future: [],
    });
  },

  updateNodeStyles: (id, newStyles, targetViewport) => {
    const { nodes, viewport, history } = get();
    const activeViewport = targetViewport || viewport;
    const node = nodes[id];
    if (!node) return;

    const currentViewportStyles = node.props.styles?.[activeViewport] || {};

    const updatedNode: BuilderNode = {
      ...node,
      props: {
        ...node.props,
        styles: {
          ...node.props.styles,
          [activeViewport]: {
            ...currentViewportStyles,
            ...newStyles,
          },
        },
      },
    };

    set({
      nodes: {
        ...nodes,
        [id]: updatedNode,
      },
      history: [...history.slice(-MAX_HISTORY), nodes],
      future: [],
    });
  },

  moveNode: (nodeId, newParentId, newIndex) => {
    const { nodes, rootNodeId, history } = get();
    const targetParentId = newParentId || rootNodeId;
    const node = nodes[nodeId];
    const newParent = nodes[targetParentId];
    if (!node || !newParent || nodeId === targetParentId) return;

    const oldParent = node.parentId ? nodes[node.parentId] : null;

    // Remove from old parent
    const updatedNodes = { ...nodes };
    if (oldParent) {
      updatedNodes[oldParent.id] = {
        ...oldParent,
        children: oldParent.children.filter((cid) => cid !== nodeId),
      };
    }

    // Add to new parent
    const targetChildren = [...(updatedNodes[targetParentId]?.children || [])];
    if (
      typeof newIndex === "number" &&
      newIndex >= 0 &&
      newIndex <= targetChildren.length
    ) {
      targetChildren.splice(newIndex, 0, nodeId);
    } else {
      targetChildren.push(nodeId);
    }

    updatedNodes[targetParentId] = {
      ...updatedNodes[targetParentId],
      children: targetChildren,
    };

    // Update node's parentId
    updatedNodes[nodeId] = {
      ...node,
      parentId: targetParentId,
    };

    set({
      nodes: updatedNodes,
      selectedNodeId: nodeId,
      history: [...history.slice(-MAX_HISTORY), nodes],
      future: [],
    });
  },

  moveNodeUp: (nodeId) => {
    const { nodes, history } = get();
    const node = nodes[nodeId];
    if (!node || !node.parentId) return;

    const parent = nodes[node.parentId];
    if (!parent) return;

    const index = parent.children.indexOf(nodeId);
    if (index <= 0) return;

    const newChildren = [...parent.children];
    const temp = newChildren[index - 1];
    newChildren[index - 1] = newChildren[index];
    newChildren[index] = temp;

    set({
      nodes: {
        ...nodes,
        [parent.id]: {
          ...parent,
          children: newChildren,
        },
      },
      history: [...history.slice(-MAX_HISTORY), nodes],
      future: [],
    });
  },

  moveNodeDown: (nodeId) => {
    const { nodes, history } = get();
    const node = nodes[nodeId];
    if (!node || !node.parentId) return;

    const parent = nodes[node.parentId];
    if (!parent) return;

    const index = parent.children.indexOf(nodeId);
    if (index === -1 || index >= parent.children.length - 1) return;

    const newChildren = [...parent.children];
    const temp = newChildren[index + 1];
    newChildren[index + 1] = newChildren[index];
    newChildren[index] = temp;

    set({
      nodes: {
        ...nodes,
        [parent.id]: {
          ...parent,
          children: newChildren,
        },
      },
      history: [...history.slice(-MAX_HISTORY), nodes],
      future: [],
    });
  },

  deleteNode: (id) => {
    const { nodes, rootNodeId, selectedNodeId, history } = get();
    if (id === rootNodeId) return;
    const node = nodes[id];
    if (!node) return;

    const updatedNodes = { ...nodes };

    if (node.parentId && updatedNodes[node.parentId]) {
      updatedNodes[node.parentId] = {
        ...updatedNodes[node.parentId],
        children: updatedNodes[node.parentId].children.filter(
          (cid) => cid !== id
        ),
      };
    }

    function collectDescendants(nodeId: string, ids: string[] = []): string[] {
      ids.push(nodeId);
      const current = updatedNodes[nodeId];
      if (current && current.children) {
        current.children.forEach((cid) => collectDescendants(cid, ids));
      }
      return ids;
    }

    const idsToDelete = collectDescendants(id);
    idsToDelete.forEach((delId) => {
      delete updatedNodes[delId];
    });

    set({
      nodes: updatedNodes,
      selectedNodeId: selectedNodeId === id ? null : selectedNodeId,
      history: [...history.slice(-MAX_HISTORY), nodes],
      future: [],
    });
  },

  duplicateNode: (id) => {
    const { nodes, rootNodeId, history } = get();
    if (id === rootNodeId) return null;
    const node = nodes[id];
    if (!node || !node.parentId) return null;

    const updatedNodes = { ...nodes };

    function cloneRecursive(
      originalId: string,
      newParentId: string | null
    ): string {
      const orig = nodes[originalId];
      const newId = generateNodeId(orig.type);

      const cloned: BuilderNode = {
        ...orig,
        id: newId,
        name: `${orig.name} (Copy)`,
        parentId: newParentId,
        children: [],
        props: JSON.parse(JSON.stringify(orig.props)),
      };

      updatedNodes[newId] = cloned;

      cloned.children = (orig.children || []).map((cid) =>
        cloneRecursive(cid, newId)
      );

      return newId;
    }

    const clonedRootId = cloneRecursive(id, node.parentId);

    const parent = updatedNodes[node.parentId];
    if (parent) {
      const origIndex = parent.children.indexOf(id);
      const newChildren = [...parent.children];
      newChildren.splice(origIndex + 1, 0, clonedRootId);
      updatedNodes[parent.id] = {
        ...parent,
        children: newChildren,
      };
    }

    set({
      nodes: updatedNodes,
      selectedNodeId: clonedRootId,
      history: [...history.slice(-MAX_HISTORY), nodes],
      future: [],
    });

    return clonedRootId;
  },

  setInitialState: (newNodes, newRootId = "root") => {
    set({
      nodes: newNodes,
      rootNodeId: newRootId,
      selectedNodeId: null,
      hoveredNodeId: null,
      history: [],
      future: [],
    });
  },

  loadProject: (incomingNodes, id, name) => {
    if (Array.isArray(incomingNodes)) {
      // Convert array tree to normalized dictionary if needed
      const normalized: Record<string, BuilderNode> = {
        root: {
          id: "root",
          type: "root",
          name: "Page Root",
          parentId: null,
          children: [],
          props: { styles: {} },
        },
      };

      function flattenNode(n: any, pId: string | null = "root") {
        const nodeId = n.id || generateNodeId(n.type);
        normalized[nodeId] = {
          id: nodeId,
          type: n.type,
          name: n.name || n.type,
          parentId: pId,
          children: (n.children || []).map((c: any) => c.id || generateNodeId(c.type)),
          props: n.props?.styles ? n.props : { styles: n.styles || {}, ...n.props },
        };
        (n.children || []).forEach((c: any) => flattenNode(c, nodeId));
      }

      incomingNodes.forEach((n: any) => {
        normalized.root.children.push(n.id);
        flattenNode(n, "root");
      });

      set({
        nodes: normalized,
        rootNodeId: "root",
        selectedNodeId: null,
        history: [],
        future: [],
        ...(id ? { projectId: id } : {}),
        ...(name ? { projectName: name } : {}),
      });
    } else {
      set({
        nodes: incomingNodes,
        rootNodeId: "root",
        selectedNodeId: null,
        history: [],
        future: [],
        ...(id ? { projectId: id } : {}),
        ...(name ? { projectName: name } : {}),
      });
    }
  },

  undo: () => {
    const { history, nodes, future } = get();
    if (history.length === 0) return;

    const previous = history[history.length - 1];
    const newHistory = history.slice(0, history.length - 1);

    set({
      nodes: previous,
      history: newHistory,
      future: [nodes, ...future],
    });
  },

  redo: () => {
    const { future, nodes, history } = get();
    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);

    set({
      nodes: next,
      history: [...history, nodes],
      future: newFuture,
    });
  },

  resetCanvas: () => {
    const { nodes, history } = get();
    const emptyRoot: Record<string, BuilderNode> = {
      root: {
        id: "root",
        type: "root",
        name: "Page Root",
        parentId: null,
        children: [],
        props: {
          styles: {
            desktop: {
              minHeight: "100vh",
              backgroundColor: "#050505",
              color: "#fafafa",
              display: "flex",
              flexDirection: "column",
              width: "100%",
            },
          },
        },
      },
    };

    set({
      nodes: emptyRoot,
      rootNodeId: "root",
      selectedNodeId: null,
      history: [...history.slice(-MAX_HISTORY), nodes],
      future: [],
    });
  },
}));
