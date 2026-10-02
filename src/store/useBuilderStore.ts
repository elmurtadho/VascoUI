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

export function generateDashboardNodes(prompt: string): Record<string, BuilderNode> {
  return {
    root: {
      id: "root",
      type: "root",
      name: "Dashboard Root",
      parentId: null,
      children: ["dash_nav", "dash_header_section", "dash_stats_section", "dash_analytics_section"],
      props: {
        styles: {
          desktop: {
            minHeight: "100vh",
            backgroundColor: "#000000",
            color: "#fafafa",
            display: "flex",
            flexDirection: "column",
            width: "100%",
          },
        },
      },
    },
    dash_nav: {
      id: "dash_nav",
      type: "section",
      name: "Dashboard Navigation",
      parentId: "root",
      children: ["dash_nav_container"],
      props: {
        tag: "div",
        styles: {
          desktop: {
            padding: "16px 32px",
            backgroundColor: "#050505",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            justifyContent: "center",
            width: "100%",
          },
          mobile: {
            padding: "12px 16px",
          },
        },
      },
    },
    dash_nav_container: {
      id: "dash_nav_container",
      type: "container",
      name: "Nav Flex Row",
      parentId: "dash_nav",
      children: ["dash_nav_logo", "dash_nav_status"],
      props: {
        tag: "div",
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            maxWidth: "1240px",
            backgroundColor: "transparent",
            border: "none",
            padding: "0px",
          },
        },
      },
    },
    dash_nav_logo: {
      id: "dash_nav_logo",
      type: "heading",
      name: "Brand Logo",
      parentId: "dash_nav_container",
      children: [],
      props: {
        content: "⚡ NOVA METRICS ENGINE",
        tag: "h3",
        styles: {
          desktop: {
            fontSize: "16px",
            fontWeight: "800",
            color: "#ffffff",
            letterSpacing: "-0.02em",
          },
        },
      },
    },
    dash_nav_status: {
      id: "dash_nav_status",
      type: "button",
      name: "Live Status Pill",
      parentId: "dash_nav_container",
      children: [],
      props: {
        content: "● Edge Cluster Online",
        styles: {
          desktop: {
            padding: "6px 14px",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            color: "#34d399",
            fontSize: "12px",
            fontWeight: "600",
            borderRadius: "9999px",
            border: "1px solid rgba(16, 185, 129, 0.25)",
            cursor: "default",
          },
        },
      },
    },
    dash_header_section: {
      id: "dash_header_section",
      type: "section",
      name: "Dashboard Title Banner",
      parentId: "root",
      children: ["dash_title_container"],
      props: {
        tag: "div",
        styles: {
          desktop: {
            padding: "48px 32px 24px 32px",
            backgroundColor: "#000000",
            display: "flex",
            justifyContent: "center",
            width: "100%",
          },
          mobile: {
            padding: "32px 16px 16px 16px",
          },
        },
      },
    },
    dash_title_container: {
      id: "dash_title_container",
      type: "container",
      name: "Header Wrapper",
      parentId: "dash_header_section",
      children: ["dash_main_title", "dash_main_subtitle"],
      props: {
        tag: "div",
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            width: "100%",
            maxWidth: "1240px",
            backgroundColor: "transparent",
            border: "none",
            padding: "0px",
          },
        },
      },
    },
    dash_main_title: {
      id: "dash_main_title",
      type: "heading",
      name: "Page Heading",
      parentId: "dash_title_container",
      children: [],
      props: {
        content: "Real-time Telemetry & Global Activity",
        tag: "h1",
        styles: {
          desktop: {
            fontSize: "34px",
            fontWeight: "800",
            color: "#ffffff",
            letterSpacing: "-0.03em",
          },
          mobile: {
            fontSize: "26px",
          },
        },
      },
    },
    dash_main_subtitle: {
      id: "dash_main_subtitle",
      type: "text",
      name: "Page Subtitle",
      parentId: "dash_title_container",
      children: [],
      props: {
        content: `Synthesized based on your prompt: "${prompt}". Ingestion rates, latency budgets, and active nodes across all edge clusters.`,
        tag: "p",
        styles: {
          desktop: {
            fontSize: "15px",
            color: "#a1a1aa",
            lineHeight: "1.5",
          },
        },
      },
    },
    dash_stats_section: {
      id: "dash_stats_section",
      type: "section",
      name: "KPI Metrics Grid Section",
      parentId: "root",
      children: ["dash_stats_grid"],
      props: {
        tag: "div",
        styles: {
          desktop: {
            padding: "16px 32px 32px 32px",
            backgroundColor: "#000000",
            display: "flex",
            justifyContent: "center",
            width: "100%",
          },
          mobile: {
            padding: "16px",
          },
        },
      },
    },
    dash_stats_grid: {
      id: "dash_stats_grid",
      type: "grid",
      name: "4-Column KPI Grid",
      parentId: "dash_stats_section",
      children: ["stat_card_1", "stat_card_2", "stat_card_3", "stat_card_4"],
      props: {
        columns: 4,
        gap: "16px",
        styles: {
          desktop: {
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "16px",
            width: "100%",
            maxWidth: "1240px",
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
    stat_card_1: {
      id: "stat_card_1",
      type: "container",
      name: "ARR Stat Card",
      parentId: "dash_stats_grid",
      children: ["c1_title", "c1_val", "c1_badge"],
      props: {
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            padding: "20px",
            backgroundColor: "#0a0a0a",
            borderRadius: "14px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          },
        },
      },
    },
    c1_title: {
      id: "c1_title",
      type: "text",
      name: "Stat Label",
      parentId: "stat_card_1",
      children: [],
      props: {
        content: "Gross Ingestion ARR",
        styles: { desktop: { fontSize: "12px", color: "#a1a1aa", fontWeight: "500" } },
      },
    },
    c1_val: {
      id: "c1_val",
      type: "heading",
      name: "Stat Value",
      parentId: "stat_card_1",
      children: [],
      props: {
        content: "$2,480,900",
        tag: "h3",
        styles: { desktop: { fontSize: "28px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.03em" } },
      },
    },
    c1_badge: {
      id: "c1_badge",
      type: "text",
      name: "Stat Delta",
      parentId: "stat_card_1",
      children: [],
      props: {
        content: "↑ +28.4% from last billing cycle",
        styles: { desktop: { fontSize: "11px", color: "#34d399", fontWeight: "600" } },
      },
    },
    stat_card_2: {
      id: "stat_card_2",
      type: "container",
      name: "Throughput Stat Card",
      parentId: "dash_stats_grid",
      children: ["c2_title", "c2_val", "c2_badge"],
      props: {
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            padding: "20px",
            backgroundColor: "#0a0a0a",
            borderRadius: "14px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          },
        },
      },
    },
    c2_title: {
      id: "c2_title",
      type: "text",
      name: "Stat Label",
      parentId: "stat_card_2",
      children: [],
      props: {
        content: "Global Edge Throughput",
        styles: { desktop: { fontSize: "12px", color: "#a1a1aa", fontWeight: "500" } },
      },
    },
    c2_val: {
      id: "c2_val",
      type: "heading",
      name: "Stat Value",
      parentId: "stat_card_2",
      children: [],
      props: {
        content: "14.2M req/s",
        tag: "h3",
        styles: { desktop: { fontSize: "28px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.03em" } },
      },
    },
    c2_badge: {
      id: "c2_badge",
      type: "text",
      name: "Stat Delta",
      parentId: "stat_card_2",
      children: [],
      props: {
        content: "● 42 Regions fully balanced",
        styles: { desktop: { fontSize: "11px", color: "#818cf8", fontWeight: "600" } },
      },
    },
    stat_card_3: {
      id: "stat_card_3",
      type: "container",
      name: "Latency Stat Card",
      parentId: "dash_stats_grid",
      children: ["c3_title", "c3_val", "c3_badge"],
      props: {
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            padding: "20px",
            backgroundColor: "#0a0a0a",
            borderRadius: "14px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          },
        },
      },
    },
    c3_title: {
      id: "c3_title",
      type: "text",
      name: "Stat Label",
      parentId: "stat_card_3",
      children: [],
      props: {
        content: "Median Edge Latency",
        styles: { desktop: { fontSize: "12px", color: "#a1a1aa", fontWeight: "500" } },
      },
    },
    c3_val: {
      id: "c3_val",
      type: "heading",
      name: "Stat Value",
      parentId: "stat_card_3",
      children: [],
      props: {
        content: "4.8 ms",
        tag: "h3",
        styles: { desktop: { fontSize: "28px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.03em" } },
      },
    },
    c3_badge: {
      id: "c3_badge",
      type: "text",
      name: "Stat Delta",
      parentId: "stat_card_3",
      children: [],
      props: {
        content: "↓ -1.2ms p99 optimization",
        styles: { desktop: { fontSize: "11px", color: "#34d399", fontWeight: "600" } },
      },
    },
    stat_card_4: {
      id: "stat_card_4",
      type: "container",
      name: "Availability Stat Card",
      parentId: "dash_stats_grid",
      children: ["c4_title", "c4_val", "c4_badge"],
      props: {
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            padding: "20px",
            backgroundColor: "#0a0a0a",
            borderRadius: "14px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          },
        },
      },
    },
    c4_title: {
      id: "c4_title",
      type: "text",
      name: "Stat Label",
      parentId: "stat_card_4",
      children: [],
      props: {
        content: "Edge SLA Health",
        styles: { desktop: { fontSize: "12px", color: "#a1a1aa", fontWeight: "500" } },
      },
    },
    c4_val: {
      id: "c4_val",
      type: "heading",
      name: "Stat Value",
      parentId: "stat_card_4",
      children: [],
      props: {
        content: "99.992%",
        tag: "h3",
        styles: { desktop: { fontSize: "28px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.03em" } },
      },
    },
    c4_badge: {
      id: "c4_badge",
      type: "text",
      name: "Stat Delta",
      parentId: "stat_card_4",
      children: [],
      props: {
        content: "✓ Zero degraded endpoints",
        styles: { desktop: { fontSize: "11px", color: "#34d399", fontWeight: "600" } },
      },
    },
    dash_analytics_section: {
      id: "dash_analytics_section",
      type: "section",
      name: "Analytics Detail Section",
      parentId: "root",
      children: ["dash_analytics_grid"],
      props: {
        tag: "div",
        styles: {
          desktop: {
            padding: "16px 32px 64px 32px",
            backgroundColor: "#000000",
            display: "flex",
            justifyContent: "center",
            width: "100%",
          },
          mobile: {
            padding: "16px",
          },
        },
      },
    },
    dash_analytics_grid: {
      id: "dash_analytics_grid",
      type: "grid",
      name: "2-Column Chart Showcase",
      parentId: "dash_analytics_section",
      children: ["chart_box_1", "chart_box_2"],
      props: {
        columns: 2,
        gap: "20px",
        styles: {
          desktop: {
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "20px",
            width: "100%",
            maxWidth: "1240px",
          },
          mobile: {
            gridTemplateColumns: "1fr",
          },
        },
      },
    },
    chart_box_1: {
      id: "chart_box_1",
      type: "container",
      name: "Traffic Ingestion Panel",
      parentId: "dash_analytics_grid",
      children: ["cb1_title", "cb1_desc", "cb1_visual"],
      props: {
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            padding: "26px",
            backgroundColor: "#0a0a0a",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          },
        },
      },
    },
    cb1_title: {
      id: "cb1_title",
      type: "heading",
      name: "Panel Title",
      parentId: "chart_box_1",
      children: [],
      props: {
        content: "📊 Ingestion Pipeline Throughput",
        tag: "h3",
        styles: { desktop: { fontSize: "18px", fontWeight: "700", color: "#ffffff" } },
      },
    },
    cb1_desc: {
      id: "cb1_desc",
      type: "text",
      name: "Panel Desc",
      parentId: "chart_box_1",
      children: [],
      props: {
        content: "Synchronous telemetry ingestion streaming from APAC, EU-Central, and US-East edge gateways with zero packet drop.",
        styles: { desktop: { fontSize: "14px", color: "#a1a1aa", lineHeight: "1.6" } },
      },
    },
    cb1_visual: {
      id: "cb1_visual",
      type: "image",
      name: "Chart Mock Graphic",
      parentId: "chart_box_1",
      children: [],
      props: {
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        alt: "Telemetry chart visualization",
        styles: {
          desktop: {
            width: "100%",
            height: "220px",
            objectFit: "cover",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          },
        },
      },
    },
    chart_box_2: {
      id: "chart_box_2",
      type: "container",
      name: "Replication Map Panel",
      parentId: "dash_analytics_grid",
      children: ["cb2_title", "cb2_desc", "cb2_visual"],
      props: {
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            padding: "26px",
            backgroundColor: "#0a0a0a",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          },
        },
      },
    },
    cb2_title: {
      id: "cb2_title",
      type: "heading",
      name: "Panel Title",
      parentId: "chart_box_2",
      children: [],
      props: {
        content: "🌐 Distributed Turso Consensus",
        tag: "h3",
        styles: { desktop: { fontSize: "18px", fontWeight: "700", color: "#ffffff" } },
      },
    },
    cb2_desc: {
      id: "cb2_desc",
      type: "text",
      name: "Panel Desc",
      parentId: "chart_box_2",
      children: [],
      props: {
        content: "Automated Raft consensus log synchronization across edge instances. Replicating writes globally in under 9ms.",
        styles: { desktop: { fontSize: "14px", color: "#a1a1aa", lineHeight: "1.6" } },
      },
    },
    cb2_visual: {
      id: "cb2_visual",
      type: "image",
      name: "Map Mock Graphic",
      parentId: "chart_box_2",
      children: [],
      props: {
        src: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
        alt: "Distributed consensus visualization",
        styles: {
          desktop: {
            width: "100%",
            height: "220px",
            objectFit: "cover",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          },
        },
      },
    },
  };
}

export function generatePortfolioNodes(prompt: string): Record<string, BuilderNode> {
  return {
    root: {
      id: "root",
      type: "root",
      name: "Portfolio Root",
      parentId: null,
      children: ["port_nav", "port_hero", "port_work_section", "port_services_section", "port_cta_section"],
      props: {
        styles: {
          desktop: {
            minHeight: "100vh",
            backgroundColor: "#000000",
            color: "#fafafa",
            display: "flex",
            flexDirection: "column",
            width: "100%",
          },
        },
      },
    },
    port_nav: {
      id: "port_nav",
      type: "section",
      name: "Portfolio Nav",
      parentId: "root",
      children: ["port_nav_container"],
      props: {
        tag: "div",
        styles: {
          desktop: {
            padding: "20px 32px",
            backgroundColor: "#050505",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            justifyContent: "center",
            width: "100%",
          },
        },
      },
    },
    port_nav_container: {
      id: "port_nav_container",
      type: "container",
      name: "Nav Row",
      parentId: "port_nav",
      children: ["port_brand", "port_contact_btn"],
      props: {
        tag: "div",
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            maxWidth: "1140px",
            backgroundColor: "transparent",
            border: "none",
            padding: "0px",
          },
        },
      },
    },
    port_brand: {
      id: "port_brand",
      type: "heading",
      name: "Studio Brand",
      parentId: "port_nav_container",
      children: [],
      props: {
        content: "ALEX VANCE // ARCHITECT",
        tag: "h3",
        styles: {
          desktop: {
            fontSize: "15px",
            fontWeight: "800",
            color: "#ffffff",
            letterSpacing: "0.05em",
          },
        },
      },
    },
    port_contact_btn: {
      id: "port_contact_btn",
      type: "button",
      name: "Get in Touch Button",
      parentId: "port_nav_container",
      children: [],
      props: {
        content: "Available for Q4 Projects →",
        styles: {
          desktop: {
            padding: "8px 18px",
            backgroundColor: "rgba(255, 255, 255, 0.06)",
            color: "#ffffff",
            fontSize: "12px",
            fontWeight: "600",
            borderRadius: "9999px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            cursor: "pointer",
          },
        },
      },
    },
    port_hero: {
      id: "port_hero",
      type: "section",
      name: "Hero Section",
      parentId: "root",
      children: ["port_hero_container"],
      props: {
        tag: "div",
        styles: {
          desktop: {
            padding: "96px 24px 64px 24px",
            backgroundColor: "#000000",
            display: "flex",
            justifyContent: "center",
            width: "100%",
            textAlign: "center",
          },
          mobile: {
            padding: "56px 16px 40px 16px",
          },
        },
      },
    },
    port_hero_container: {
      id: "port_hero_container",
      type: "container",
      name: "Hero Container",
      parentId: "port_hero",
      children: ["port_badge", "port_title", "port_bio"],
      props: {
        tag: "div",
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            maxWidth: "840px",
            width: "100%",
            backgroundColor: "transparent",
            border: "none",
            padding: "0px",
          },
        },
      },
    },
    port_badge: {
      id: "port_badge",
      type: "text",
      name: "Specialty Badge",
      parentId: "port_hero_container",
      children: [],
      props: {
        content: "✨ Principal Systems & Interface Designer",
        styles: {
          desktop: {
            fontSize: "12px",
            fontWeight: "600",
            color: "#818cf8",
            padding: "6px 16px",
            borderRadius: "9999px",
            backgroundColor: "rgba(99, 102, 241, 0.1)",
            border: "1px solid rgba(99, 102, 241, 0.25)",
          },
        },
      },
    },
    port_title: {
      id: "port_title",
      type: "heading",
      name: "Hero Title",
      parentId: "port_hero_container",
      children: [],
      props: {
        content: "Crafting High-Conviction Digital Products & Spatial Web Experiences",
        tag: "h1",
        styles: {
          desktop: {
            fontSize: "52px",
            fontWeight: "800",
            color: "#ffffff",
            letterSpacing: "-0.04em",
            lineHeight: "1.1",
            textAlign: "center",
          },
          tablet: { fontSize: "40px" },
          mobile: { fontSize: "30px" },
        },
      },
    },
    port_bio: {
      id: "port_bio",
      type: "text",
      name: "Hero Bio",
      parentId: "port_hero_container",
      children: [],
      props: {
        content: `Synthesized for: "${prompt}". Specializing in ultra-fast Next.js architectures, polished micro-interactions, and AI-native design systems.`,
        tag: "p",
        styles: {
          desktop: {
            fontSize: "17px",
            color: "#a1a1aa",
            lineHeight: "1.6",
            maxWidth: "680px",
            textAlign: "center",
          },
        },
      },
    },
    port_work_section: {
      id: "port_work_section",
      type: "section",
      name: "Selected Works Section",
      parentId: "root",
      children: ["port_work_title", "port_work_grid"],
      props: {
        tag: "div",
        styles: {
          desktop: {
            padding: "40px 24px 80px 24px",
            backgroundColor: "#000000",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "32px",
            width: "100%",
          },
        },
      },
    },
    port_work_title: {
      id: "port_work_title",
      type: "heading",
      name: "Section Heading",
      parentId: "port_work_section",
      children: [],
      props: {
        content: "Selected Artifacts (2024 — 2026)",
        tag: "h2",
        styles: {
          desktop: {
            fontSize: "24px",
            fontWeight: "700",
            color: "#ffffff",
            letterSpacing: "-0.02em",
          },
        },
      },
    },
    port_work_grid: {
      id: "port_work_grid",
      type: "grid",
      name: "2-Column Project Showcase",
      parentId: "port_work_section",
      children: ["work_card_1", "work_card_2", "work_card_3", "work_card_4"],
      props: {
        columns: 2,
        gap: "24px",
        styles: {
          desktop: {
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "24px",
            maxWidth: "1140px",
            width: "100%",
          },
          mobile: {
            gridTemplateColumns: "1fr",
          },
        },
      },
    },
    work_card_1: {
      id: "work_card_1",
      type: "container",
      name: "Project Card 1",
      parentId: "port_work_grid",
      children: ["wc1_img", "wc1_tag", "wc1_title"],
      props: {
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            padding: "20px",
            backgroundColor: "#0a0a0a",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          },
        },
      },
    },
    wc1_img: {
      id: "wc1_img",
      type: "image",
      name: "Project Visual",
      parentId: "work_card_1",
      children: [],
      props: {
        src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
        alt: "Spatial Computing Project",
        styles: {
          desktop: { width: "100%", height: "260px", objectFit: "cover", borderRadius: "10px" },
        },
      },
    },
    wc1_tag: {
      id: "wc1_tag",
      type: "text",
      name: "Category",
      parentId: "work_card_1",
      children: [],
      props: {
        content: "Spatial Computing • macOS / WebGL",
        styles: { desktop: { fontSize: "11px", color: "#818cf8", fontWeight: "600", textTransform: "uppercase" } },
      },
    },
    wc1_title: {
      id: "wc1_title",
      type: "heading",
      name: "Project Title",
      parentId: "work_card_1",
      children: [],
      props: {
        content: "Stitch OS — Zero-Latency Canvas Studio",
        tag: "h3",
        styles: { desktop: { fontSize: "20px", fontWeight: "700", color: "#ffffff" } },
      },
    },
    work_card_2: {
      id: "work_card_2",
      type: "container",
      name: "Project Card 2",
      parentId: "port_work_grid",
      children: ["wc2_img", "wc2_tag", "wc2_title"],
      props: {
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            padding: "20px",
            backgroundColor: "#0a0a0a",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          },
        },
      },
    },
    wc2_img: {
      id: "wc2_img",
      type: "image",
      name: "Project Visual",
      parentId: "work_card_2",
      children: [],
      props: {
        src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
        alt: "Edge Cloud Database Project",
        styles: {
          desktop: { width: "100%", height: "260px", objectFit: "cover", borderRadius: "10px" },
        },
      },
    },
    wc2_tag: {
      id: "wc2_tag",
      type: "text",
      name: "Category",
      parentId: "work_card_2",
      children: [],
      props: {
        content: "Distributed Systems • Turso & Drizzle",
        styles: { desktop: { fontSize: "11px", color: "#34d399", fontWeight: "600", textTransform: "uppercase" } },
      },
    },
    wc2_title: {
      id: "wc2_title",
      type: "heading",
      name: "Project Title",
      parentId: "work_card_2",
      children: [],
      props: {
        content: "Hyperion Edge — Global SQLite Cloud",
        tag: "h3",
        styles: { desktop: { fontSize: "20px", fontWeight: "700", color: "#ffffff" } },
      },
    },
    work_card_3: {
      id: "work_card_3",
      type: "container",
      name: "Project Card 3",
      parentId: "port_work_grid",
      children: ["wc3_img", "wc3_tag", "wc3_title"],
      props: {
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            padding: "20px",
            backgroundColor: "#0a0a0a",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          },
        },
      },
    },
    wc3_img: {
      id: "wc3_img",
      type: "image",
      name: "Project Visual",
      parentId: "work_card_3",
      children: [],
      props: {
        src: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80",
        alt: "AI Agent Interface Project",
        styles: {
          desktop: { width: "100%", height: "260px", objectFit: "cover", borderRadius: "10px" },
        },
      },
    },
    wc3_tag: {
      id: "wc3_tag",
      type: "text",
      name: "Category",
      parentId: "work_card_3",
      children: [],
      props: {
        content: "Autonomous Coding • LLM UX",
        styles: { desktop: { fontSize: "11px", color: "#f472b6", fontWeight: "600", textTransform: "uppercase" } },
      },
    },
    wc3_title: {
      id: "wc3_title",
      type: "heading",
      name: "Project Title",
      parentId: "work_card_3",
      children: [],
      props: {
        content: "Antigravity IDE — Agentic Pair Programmer",
        tag: "h3",
        styles: { desktop: { fontSize: "20px", fontWeight: "700", color: "#ffffff" } },
      },
    },
    work_card_4: {
      id: "work_card_4",
      type: "container",
      name: "Project Card 4",
      parentId: "port_work_grid",
      children: ["wc4_img", "wc4_tag", "wc4_title"],
      props: {
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            padding: "20px",
            backgroundColor: "#0a0a0a",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          },
        },
      },
    },
    wc4_img: {
      id: "wc4_img",
      type: "image",
      name: "Project Visual",
      parentId: "work_card_4",
      children: [],
      props: {
        src: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80",
        alt: "Design System Project",
        styles: {
          desktop: { width: "100%", height: "260px", objectFit: "cover", borderRadius: "10px" },
        },
      },
    },
    wc4_tag: {
      id: "wc4_tag",
      type: "text",
      name: "Category",
      parentId: "work_card_4",
      children: [],
      props: {
        content: "Design Tokens • Multi-Platform",
        styles: { desktop: { fontSize: "11px", color: "#fbbf24", fontWeight: "600", textTransform: "uppercase" } },
      },
    },
    wc4_title: {
      id: "wc4_title",
      type: "heading",
      name: "Project Title",
      parentId: "work_card_4",
      children: [],
      props: {
        content: "Nexus Tokens — Enterprise Multi-Brand Engine",
        tag: "h3",
        styles: { desktop: { fontSize: "20px", fontWeight: "700", color: "#ffffff" } },
      },
    },
    port_services_section: {
      id: "port_services_section",
      type: "section",
      name: "Services Section",
      parentId: "root",
      children: ["port_services_grid"],
      props: {
        tag: "div",
        styles: {
          desktop: {
            padding: "40px 24px 60px 24px",
            backgroundColor: "#000000",
            display: "flex",
            justifyContent: "center",
            width: "100%",
          },
        },
      },
    },
    port_services_grid: {
      id: "port_services_grid",
      type: "grid",
      name: "3-Column Services Grid",
      parentId: "port_services_section",
      children: ["serv_1", "serv_2", "serv_3"],
      props: {
        columns: 3,
        gap: "20px",
        styles: {
          desktop: {
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "20px",
            maxWidth: "1140px",
            width: "100%",
          },
          mobile: {
            gridTemplateColumns: "1fr",
          },
        },
      },
    },
    serv_1: {
      id: "serv_1",
      type: "container",
      name: "Service 1",
      parentId: "port_services_grid",
      children: ["s1_t", "s1_d"],
      props: {
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "24px",
            backgroundColor: "#0a0a0a",
            borderRadius: "14px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          },
        },
      },
    },
    s1_t: {
      id: "s1_t",
      type: "heading",
      name: "Service Title",
      parentId: "serv_1",
      children: [],
      props: {
        content: "📐 Design Systems Architecture",
        tag: "h3",
        styles: { desktop: { fontSize: "17px", fontWeight: "700", color: "#ffffff" } },
      },
    },
    s1_d: {
      id: "s1_d",
      type: "text",
      name: "Service Desc",
      parentId: "serv_1",
      children: [],
      props: {
        content: "Scalable component libraries, semantic token pipelines, and production-ready Figma-to-Code tooling.",
        styles: { desktop: { fontSize: "14px", color: "#a1a1aa", lineHeight: "1.6" } },
      },
    },
    serv_2: {
      id: "serv_2",
      type: "container",
      name: "Service 2",
      parentId: "port_services_grid",
      children: ["s2_t", "s2_d"],
      props: {
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "24px",
            backgroundColor: "#0a0a0a",
            borderRadius: "14px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          },
        },
      },
    },
    s2_t: {
      id: "s2_t",
      type: "heading",
      name: "Service Title",
      parentId: "serv_2",
      children: [],
      props: {
        content: "⚡ Full-Stack Web Synthesis",
        tag: "h3",
        styles: { desktop: { fontSize: "17px", fontWeight: "700", color: "#ffffff" } },
      },
    },
    s2_d: {
      id: "s2_d",
      type: "text",
      name: "Service Desc",
      parentId: "serv_2",
      children: [],
      props: {
        content: "Zero-latency Next.js applications, server actions, libSQL edge databases, and reactive Zustand state machines.",
        styles: { desktop: { fontSize: "14px", color: "#a1a1aa", lineHeight: "1.6" } },
      },
    },
    serv_3: {
      id: "serv_3",
      type: "container",
      name: "Service 3",
      parentId: "port_services_grid",
      children: ["s3_t", "s3_d"],
      props: {
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "24px",
            backgroundColor: "#0a0a0a",
            borderRadius: "14px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          },
        },
      },
    },
    s3_t: {
      id: "s3_t",
      type: "heading",
      name: "Service Title",
      parentId: "serv_3",
      children: [],
      props: {
        content: "🔮 AI-Native Interface Design",
        tag: "h3",
        styles: { desktop: { fontSize: "17px", fontWeight: "700", color: "#ffffff" } },
      },
    },
    s3_d: {
      id: "s3_d",
      type: "text",
      name: "Service Desc",
      parentId: "serv_3",
      children: [],
      props: {
        content: "Conversational UI paradigms, prompt-based canvas workspaces, and streaming agentic workflows.",
        styles: { desktop: { fontSize: "14px", color: "#a1a1aa", lineHeight: "1.6" } },
      },
    },
    port_cta_section: {
      id: "port_cta_section",
      type: "section",
      name: "Contact Banner Section",
      parentId: "root",
      children: ["port_cta_container"],
      props: {
        tag: "div",
        styles: {
          desktop: {
            padding: "60px 24px 90px 24px",
            backgroundColor: "#000000",
            display: "flex",
            justifyContent: "center",
            width: "100%",
          },
        },
      },
    },
    port_cta_container: {
      id: "port_cta_container",
      type: "container",
      name: "CTA Box",
      parentId: "port_cta_section",
      children: ["cta_heading", "cta_sub", "cta_btn"],
      props: {
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "18px",
            padding: "48px 32px",
            backgroundColor: "#0a0a0a",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            maxWidth: "880px",
            width: "100%",
          },
        },
      },
    },
    cta_heading: {
      id: "cta_heading",
      type: "heading",
      name: "CTA Title",
      parentId: "port_cta_container",
      children: [],
      props: {
        content: "Have an ambitious project in mind?",
        tag: "h2",
        styles: { desktop: { fontSize: "32px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.03em" } },
      },
    },
    cta_sub: {
      id: "cta_sub",
      type: "text",
      name: "CTA Subtitle",
      parentId: "port_cta_container",
      children: [],
      props: {
        content: "Currently accepting design engineering and advisory engagements for select teams.",
        styles: { desktop: { fontSize: "15px", color: "#a1a1aa", maxWidth: "560px" } },
      },
    },
    cta_btn: {
      id: "cta_btn",
      type: "button",
      name: "Call to Action Button",
      parentId: "port_cta_container",
      children: [],
      props: {
        content: "Schedule an Intro Call →",
        styles: {
          desktop: {
            padding: "14px 32px",
            backgroundColor: "#4f46e5",
            color: "#ffffff",
            fontSize: "15px",
            fontWeight: "600",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            cursor: "pointer",
          },
        },
      },
    },
  };
}

export function generateEcommerceNodes(prompt: string): Record<string, BuilderNode> {
  return {
    root: {
      id: "root",
      type: "root",
      name: "E-Commerce Root",
      parentId: null,
      children: ["shop_nav", "shop_hero", "shop_products_section", "shop_features_section"],
      props: {
        styles: {
          desktop: {
            minHeight: "100vh",
            backgroundColor: "#000000",
            color: "#fafafa",
            display: "flex",
            flexDirection: "column",
            width: "100%",
          },
        },
      },
    },
    shop_nav: {
      id: "shop_nav",
      type: "section",
      name: "Store Navigation",
      parentId: "root",
      children: ["shop_nav_container"],
      props: {
        tag: "div",
        styles: {
          desktop: {
            padding: "16px 32px",
            backgroundColor: "#050505",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            justifyContent: "center",
            width: "100%",
          },
        },
      },
    },
    shop_nav_container: {
      id: "shop_nav_container",
      type: "container",
      name: "Nav Row",
      parentId: "shop_nav",
      children: ["shop_brand", "shop_cart_btn"],
      props: {
        tag: "div",
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            maxWidth: "1240px",
            backgroundColor: "transparent",
            border: "none",
            padding: "0px",
          },
        },
      },
    },
    shop_brand: {
      id: "shop_brand",
      type: "heading",
      name: "Store Brand",
      parentId: "shop_nav_container",
      children: [],
      props: {
        content: "KINETIC LABS // SERIES 04",
        tag: "h3",
        styles: { desktop: { fontSize: "16px", fontWeight: "800", color: "#ffffff", letterSpacing: "0.08em" } },
      },
    },
    shop_cart_btn: {
      id: "shop_cart_btn",
      type: "button",
      name: "Cart Button",
      parentId: "shop_nav_container",
      children: [],
      props: {
        content: "Cart (0) • $0.00",
        styles: {
          desktop: {
            padding: "8px 18px",
            backgroundColor: "#ffffff",
            color: "#000000",
            fontSize: "12px",
            fontWeight: "700",
            borderRadius: "9999px",
            border: "none",
            cursor: "pointer",
          },
        },
      },
    },
    shop_hero: {
      id: "shop_hero",
      type: "section",
      name: "Hero Showcase Banner",
      parentId: "root",
      children: ["shop_hero_box"],
      props: {
        tag: "div",
        styles: {
          desktop: {
            padding: "88px 24px 64px 24px",
            backgroundColor: "#000000",
            display: "flex",
            justifyContent: "center",
            width: "100%",
            textAlign: "center",
          },
        },
      },
    },
    shop_hero_box: {
      id: "shop_hero_box",
      type: "container",
      name: "Hero Box",
      parentId: "shop_hero",
      children: ["sh_badge", "sh_title", "sh_sub", "sh_btn"],
      props: {
        tag: "div",
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            maxWidth: "840px",
            width: "100%",
            backgroundColor: "transparent",
            border: "none",
            padding: "0px",
          },
        },
      },
    },
    sh_badge: {
      id: "sh_badge",
      type: "text",
      name: "Collection Badge",
      parentId: "shop_hero_box",
      children: [],
      props: {
        content: "LIMITED EDITION • AEROSPACE CARBON COMPOSITE",
        styles: {
          desktop: {
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.1em",
            color: "#a1a1aa",
            padding: "6px 14px",
            borderRadius: "9999px",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
        },
      },
    },
    sh_title: {
      id: "sh_title",
      type: "heading",
      name: "Hero Headline",
      parentId: "shop_hero_box",
      children: [],
      props: {
        content: "Engineered Precision For Spatial Workstations",
        tag: "h1",
        styles: {
          desktop: {
            fontSize: "50px",
            fontWeight: "800",
            color: "#ffffff",
            letterSpacing: "-0.04em",
            lineHeight: "1.1",
          },
          tablet: { fontSize: "38px" },
          mobile: { fontSize: "28px" },
        },
      },
    },
    sh_sub: {
      id: "sh_sub",
      type: "text",
      name: "Hero Subtitle",
      parentId: "shop_hero_box",
      children: [],
      props: {
        content: `Generated for: "${prompt}". Minimalist hardware accessories precision-machined from single-billet aircraft grade titanium.`,
        tag: "p",
        styles: { desktop: { fontSize: "16px", color: "#a1a1aa", maxWidth: "620px", lineHeight: "1.6" } },
      },
    },
    sh_btn: {
      id: "sh_btn",
      type: "button",
      name: "Hero CTA",
      parentId: "shop_hero_box",
      children: [],
      props: {
        content: "Shop The Release →",
        styles: {
          desktop: {
            padding: "14px 34px",
            backgroundColor: "#6366f1",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "600",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
          },
        },
      },
    },
    shop_products_section: {
      id: "shop_products_section",
      type: "section",
      name: "Featured Products Section",
      parentId: "root",
      children: ["shop_products_grid"],
      props: {
        tag: "div",
        styles: {
          desktop: {
            padding: "30px 24px 80px 24px",
            backgroundColor: "#000000",
            display: "flex",
            justifyContent: "center",
            width: "100%",
          },
        },
      },
    },
    shop_products_grid: {
      id: "shop_products_grid",
      type: "grid",
      name: "3-Column Product Grid",
      parentId: "shop_products_section",
      children: ["prod_card_1", "prod_card_2", "prod_card_3"],
      props: {
        columns: 3,
        gap: "24px",
        styles: {
          desktop: {
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "24px",
            maxWidth: "1240px",
            width: "100%",
          },
          tablet: { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" },
          mobile: { gridTemplateColumns: "1fr" },
        },
      },
    },
    prod_card_1: {
      id: "prod_card_1",
      type: "container",
      name: "Product 1",
      parentId: "shop_products_grid",
      children: ["p1_img", "p1_title", "p1_price", "p1_btn"],
      props: {
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            padding: "20px",
            backgroundColor: "#0a0a0a",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          },
        },
      },
    },
    p1_img: {
      id: "p1_img",
      type: "image",
      name: "Product Image",
      parentId: "prod_card_1",
      children: [],
      props: {
        src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
        alt: "Kinetic Chrono Minimal Watch",
        styles: { desktop: { width: "100%", height: "240px", objectFit: "cover", borderRadius: "10px" } },
      },
    },
    p1_title: {
      id: "p1_title",
      type: "heading",
      name: "Product Title",
      parentId: "prod_card_1",
      children: [],
      props: {
        content: "Chrono Minimal Watch // Black",
        tag: "h3",
        styles: { desktop: { fontSize: "17px", fontWeight: "700", color: "#ffffff" } },
      },
    },
    p1_price: {
      id: "p1_price",
      type: "text",
      name: "Price",
      parentId: "prod_card_1",
      children: [],
      props: {
        content: "$420.00 USD",
        styles: { desktop: { fontSize: "15px", fontWeight: "600", color: "#818cf8" } },
      },
    },
    p1_btn: {
      id: "p1_btn",
      type: "button",
      name: "Add to Cart",
      parentId: "prod_card_1",
      children: [],
      props: {
        content: "Add to Bag",
        styles: {
          desktop: {
            padding: "10px 18px",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: "600",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            cursor: "pointer",
            width: "100%",
          },
        },
      },
    },
    prod_card_2: {
      id: "prod_card_2",
      type: "container",
      name: "Product 2",
      parentId: "shop_products_grid",
      children: ["p2_img", "p2_title", "p2_price", "p2_btn"],
      props: {
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            padding: "20px",
            backgroundColor: "#0a0a0a",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          },
        },
      },
    },
    p2_img: {
      id: "p2_img",
      type: "image",
      name: "Product Image",
      parentId: "prod_card_2",
      children: [],
      props: {
        src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
        alt: "Studio Headphones",
        styles: { desktop: { width: "100%", height: "240px", objectFit: "cover", borderRadius: "10px" } },
      },
    },
    p2_title: {
      id: "p2_title",
      type: "heading",
      name: "Product Title",
      parentId: "prod_card_2",
      children: [],
      props: {
        content: "Titanium Studio Headset // Slate",
        tag: "h3",
        styles: { desktop: { fontSize: "17px", fontWeight: "700", color: "#ffffff" } },
      },
    },
    p2_price: {
      id: "p2_price",
      type: "text",
      name: "Price",
      parentId: "prod_card_2",
      children: [],
      props: {
        content: "$680.00 USD",
        styles: { desktop: { fontSize: "15px", fontWeight: "600", color: "#818cf8" } },
      },
    },
    p2_btn: {
      id: "p2_btn",
      type: "button",
      name: "Add to Cart",
      parentId: "prod_card_2",
      children: [],
      props: {
        content: "Add to Bag",
        styles: {
          desktop: {
            padding: "10px 18px",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: "600",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            cursor: "pointer",
            width: "100%",
          },
        },
      },
    },
    prod_card_3: {
      id: "prod_card_3",
      type: "container",
      name: "Product 3",
      parentId: "shop_products_grid",
      children: ["p3_img", "p3_title", "p3_price", "p3_btn"],
      props: {
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            padding: "20px",
            backgroundColor: "#0a0a0a",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          },
        },
      },
    },
    p3_img: {
      id: "p3_img",
      type: "image",
      name: "Product Image",
      parentId: "prod_card_3",
      children: [],
      props: {
        src: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
        alt: "Smart Tactical Band",
        styles: { desktop: { width: "100%", height: "240px", objectFit: "cover", borderRadius: "10px" } },
      },
    },
    p3_title: {
      id: "p3_title",
      type: "heading",
      name: "Product Title",
      parentId: "prod_card_3",
      children: [],
      props: {
        content: "Tactical Smart Band // Obsidian",
        tag: "h3",
        styles: { desktop: { fontSize: "17px", fontWeight: "700", color: "#ffffff" } },
      },
    },
    p3_price: {
      id: "p3_price",
      type: "text",
      name: "Price",
      parentId: "prod_card_3",
      children: [],
      props: {
        content: "$290.00 USD",
        styles: { desktop: { fontSize: "15px", fontWeight: "600", color: "#818cf8" } },
      },
    },
    p3_btn: {
      id: "p3_btn",
      type: "button",
      name: "Add to Cart",
      parentId: "prod_card_3",
      children: [],
      props: {
        content: "Add to Bag",
        styles: {
          desktop: {
            padding: "10px 18px",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: "600",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            cursor: "pointer",
            width: "100%",
          },
        },
      },
    },
    shop_features_section: {
      id: "shop_features_section",
      type: "section",
      name: "Guarantees Section",
      parentId: "root",
      children: ["shop_feat_grid"],
      props: {
        tag: "div",
        styles: {
          desktop: {
            padding: "40px 24px 80px 24px",
            backgroundColor: "#050505",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            justifyContent: "center",
            width: "100%",
          },
        },
      },
    },
    shop_feat_grid: {
      id: "shop_feat_grid",
      type: "grid",
      name: "Perks Grid",
      parentId: "shop_features_section",
      children: ["perk_1", "perk_2", "perk_3"],
      props: {
        columns: 3,
        gap: "24px",
        styles: {
          desktop: {
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "24px",
            maxWidth: "1240px",
            width: "100%",
          },
          mobile: { gridTemplateColumns: "1fr" },
        },
      },
    },
    perk_1: {
      id: "perk_1",
      type: "container",
      name: "Perk 1",
      parentId: "shop_feat_grid",
      children: ["pk1_t", "pk1_d"],
      props: {
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "20px",
            backgroundColor: "#0a0a0a",
            borderRadius: "14px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          },
        },
      },
    },
    pk1_t: {
      id: "pk1_t",
      type: "heading",
      name: "Perk Title",
      parentId: "perk_1",
      children: [],
      props: {
        content: "✈️ Express Global Freight",
        tag: "h3",
        styles: { desktop: { fontSize: "16px", fontWeight: "700", color: "#ffffff" } },
      },
    },
    pk1_d: {
      id: "pk1_d",
      type: "text",
      name: "Perk Desc",
      parentId: "perk_1",
      children: [],
      props: {
        content: "Complimentary DHL Express 2-day delivery on all domestic and international orders over $300.",
        styles: { desktop: { fontSize: "13px", color: "#a1a1aa", lineHeight: "1.5" } },
      },
    },
    perk_2: {
      id: "perk_2",
      type: "container",
      name: "Perk 2",
      parentId: "shop_feat_grid",
      children: ["pk2_t", "pk2_d"],
      props: {
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "20px",
            backgroundColor: "#0a0a0a",
            borderRadius: "14px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          },
        },
      },
    },
    pk2_t: {
      id: "pk2_t",
      type: "heading",
      name: "Perk Title",
      parentId: "perk_2",
      children: [],
      props: {
        content: "🛡️ Lifetime Machining Warranty",
        tag: "h3",
        styles: { desktop: { fontSize: "16px", fontWeight: "700", color: "#ffffff" } },
      },
    },
    pk2_d: {
      id: "pk2_d",
      type: "text",
      name: "Perk Desc",
      parentId: "perk_2",
      children: [],
      props: {
        content: "Every chassis carries a lifetime structural guarantee against mechanical defect or deformation.",
        styles: { desktop: { fontSize: "13px", color: "#a1a1aa", lineHeight: "1.5" } },
      },
    },
    perk_3: {
      id: "perk_3",
      type: "container",
      name: "Perk 3",
      parentId: "shop_feat_grid",
      children: ["pk3_t", "pk3_d"],
      props: {
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "20px",
            backgroundColor: "#0a0a0a",
            borderRadius: "14px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          },
        },
      },
    },
    pk3_t: {
      id: "pk3_t",
      type: "heading",
      name: "Perk Title",
      parentId: "perk_3",
      children: [],
      props: {
        content: "🔄 30-Day Hassle-Free Returns",
        tag: "h3",
        styles: { desktop: { fontSize: "16px", fontWeight: "700", color: "#ffffff" } },
      },
    },
    pk3_d: {
      id: "pk3_d",
      type: "text",
      name: "Perk Desc",
      parentId: "perk_3",
      children: [],
      props: {
        content: "Test the hardware in your setup. Complete satisfaction guaranteed or return for a full refund.",
        styles: { desktop: { fontSize: "13px", color: "#a1a1aa", lineHeight: "1.5" } },
      },
    },
  };
}

export function generateSaaSNodes(prompt: string): Record<string, BuilderNode> {
  return {
    root: {
      id: "root",
      type: "root",
      name: "Page Root",
      parentId: null,
      children: ["saas_nav", "saas_hero", "saas_features", "saas_cta"],
      props: {
        styles: {
          desktop: {
            minHeight: "100vh",
            backgroundColor: "#000000",
            color: "#fafafa",
            display: "flex",
            flexDirection: "column",
            width: "100%",
          },
        },
      },
    },
    saas_nav: {
      id: "saas_nav",
      type: "section",
      name: "Navbar",
      parentId: "root",
      children: ["saas_nav_cont"],
      props: {
        tag: "div",
        styles: {
          desktop: {
            padding: "18px 32px",
            backgroundColor: "#050505",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            justifyContent: "center",
            width: "100%",
          },
        },
      },
    },
    saas_nav_cont: {
      id: "saas_nav_cont",
      type: "container",
      name: "Nav Container",
      parentId: "saas_nav",
      children: ["saas_logo", "saas_nav_btn"],
      props: {
        tag: "div",
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            maxWidth: "1200px",
            backgroundColor: "transparent",
            border: "none",
            padding: "0px",
          },
        },
      },
    },
    saas_logo: {
      id: "saas_logo",
      type: "heading",
      name: "Brand Logo",
      parentId: "saas_nav_cont",
      children: [],
      props: {
        content: "✦ VASCO STUDIO AI",
        tag: "h3",
        styles: { desktop: { fontSize: "16px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.02em" } },
      },
    },
    saas_nav_btn: {
      id: "saas_nav_btn",
      type: "button",
      name: "Nav Action",
      parentId: "saas_nav_cont",
      children: [],
      props: {
        content: "Start Free Trial →",
        styles: {
          desktop: {
            padding: "8px 20px",
            backgroundColor: "#6366f1",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: "600",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
          },
        },
      },
    },
    saas_hero: {
      id: "saas_hero",
      type: "section",
      name: "Hero Section",
      parentId: "root",
      children: ["saas_hero_box"],
      props: {
        tag: "div",
        styles: {
          desktop: {
            padding: "96px 24px 72px 24px",
            backgroundColor: "#000000",
            display: "flex",
            justifyContent: "center",
            width: "100%",
            textAlign: "center",
          },
          mobile: { padding: "56px 16px 40px 16px" },
        },
      },
    },
    saas_hero_box: {
      id: "saas_hero_box",
      type: "container",
      name: "Hero Content",
      parentId: "saas_hero",
      children: ["saas_badge", "saas_title", "saas_desc", "saas_cta_row"],
      props: {
        tag: "div",
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
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
    saas_badge: {
      id: "saas_badge",
      type: "text",
      name: "Badge",
      parentId: "saas_hero_box",
      children: [],
      props: {
        content: "⚡ AI Prompt-to-Canvas Synthesis",
        styles: {
          desktop: {
            fontSize: "12px",
            fontWeight: "600",
            color: "#818cf8",
            padding: "6px 16px",
            borderRadius: "9999px",
            backgroundColor: "rgba(99, 102, 241, 0.1)",
            border: "1px solid rgba(99, 102, 241, 0.25)",
          },
        },
      },
    },
    saas_title: {
      id: "saas_title",
      type: "heading",
      name: "Hero Headline",
      parentId: "saas_hero_box",
      children: [],
      props: {
        content: "Design with AI. Edit with Precision.",
        tag: "h1",
        styles: {
          desktop: {
            fontSize: "56px",
            fontWeight: "800",
            color: "#ffffff",
            letterSpacing: "-0.04em",
            lineHeight: "1.1",
          },
          tablet: { fontSize: "42px" },
          mobile: { fontSize: "32px" },
        },
      },
    },
    saas_desc: {
      id: "saas_desc",
      type: "text",
      name: "Hero Subtitle",
      parentId: "saas_hero_box",
      children: [],
      props: {
        content: `Generated based on your prompt: "${prompt}". Transform raw design intent into production-grade Next.js interfaces with instant Turso edge persistence.`,
        tag: "p",
        styles: { desktop: { fontSize: "17px", color: "#a1a1aa", maxWidth: "680px", lineHeight: "1.6" } },
      },
    },
    saas_cta_row: {
      id: "saas_cta_row",
      type: "container",
      name: "Hero CTA Row",
      parentId: "saas_hero_box",
      children: ["saas_btn_p", "saas_btn_s"],
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
            padding: "8px 0px",
          },
          mobile: { flexDirection: "column", width: "100%" },
        },
      },
    },
    saas_btn_p: {
      id: "saas_btn_p",
      type: "button",
      name: "Primary CTA",
      parentId: "saas_cta_row",
      children: [],
      props: {
        content: "Deploy to Production →",
        styles: {
          desktop: {
            padding: "13px 30px",
            backgroundColor: "#4f46e5",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "600",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
          },
        },
      },
    },
    saas_btn_s: {
      id: "saas_btn_s",
      type: "button",
      name: "Secondary CTA",
      parentId: "saas_cta_row",
      children: [],
      props: {
        content: "View Code Export",
        styles: {
          desktop: {
            padding: "13px 26px",
            backgroundColor: "#0a0a0a",
            color: "#d4d4d8",
            fontSize: "14px",
            fontWeight: "600",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            cursor: "pointer",
          },
        },
      },
    },
    saas_features: {
      id: "saas_features",
      type: "section",
      name: "Features Section",
      parentId: "root",
      children: ["saas_feat_grid"],
      props: {
        tag: "div",
        styles: {
          desktop: {
            padding: "40px 24px 80px 24px",
            backgroundColor: "#000000",
            display: "flex",
            justifyContent: "center",
            width: "100%",
          },
        },
      },
    },
    saas_feat_grid: {
      id: "saas_feat_grid",
      type: "grid",
      name: "Features Grid",
      parentId: "saas_features",
      children: ["sf_card_1", "sf_card_2", "sf_card_3"],
      props: {
        columns: 3,
        gap: "24px",
        styles: {
          desktop: {
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "24px",
            maxWidth: "1200px",
            width: "100%",
          },
          tablet: { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" },
          mobile: { gridTemplateColumns: "1fr" },
        },
      },
    },
    sf_card_1: {
      id: "sf_card_1",
      type: "container",
      name: "Feature Card 1",
      parentId: "saas_feat_grid",
      children: ["sf1_t", "sf1_d"],
      props: {
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            padding: "28px",
            backgroundColor: "#0a0a0a",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          },
        },
      },
    },
    sf1_t: {
      id: "sf1_t",
      type: "heading",
      name: "Feature 1 Title",
      parentId: "sf_card_1",
      children: [],
      props: {
        content: "🧠 Prompt-to-DOM Synthesis",
        tag: "h3",
        styles: { desktop: { fontSize: "18px", fontWeight: "700", color: "#ffffff" } },
      },
    },
    sf1_d: {
      id: "sf1_d",
      type: "text",
      name: "Feature 1 Desc",
      parentId: "sf_card_1",
      children: [],
      props: {
        content: "Describe any interface in natural language and receive an editable, nested, responsive DOM tree in seconds.",
        styles: { desktop: { fontSize: "14px", color: "#a1a1aa", lineHeight: "1.6" } },
      },
    },
    sf_card_2: {
      id: "sf_card_2",
      type: "container",
      name: "Feature Card 2",
      parentId: "saas_feat_grid",
      children: ["sf2_t", "sf2_d"],
      props: {
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            padding: "28px",
            backgroundColor: "#0a0a0a",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          },
        },
      },
    },
    sf2_t: {
      id: "sf2_t",
      type: "heading",
      name: "Feature 2 Title",
      parentId: "sf_card_2",
      children: [],
      props: {
        content: "⚡ Turso Edge Persistence",
        tag: "h3",
        styles: { desktop: { fontSize: "18px", fontWeight: "700", color: "#ffffff" } },
      },
    },
    sf2_d: {
      id: "sf2_d",
      type: "text",
      name: "Feature 2 Desc",
      parentId: "sf_card_2",
      children: [],
      props: {
        content: "Global sub-10ms SQLite replicas across 42 locations. Never lose state with real-time automatic synchronization.",
        styles: { desktop: { fontSize: "14px", color: "#a1a1aa", lineHeight: "1.6" } },
      },
    },
    sf_card_3: {
      id: "sf_card_3",
      type: "container",
      name: "Feature Card 3",
      parentId: "saas_feat_grid",
      children: ["sf3_t", "sf3_d"],
      props: {
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            padding: "28px",
            backgroundColor: "#0a0a0a",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          },
        },
      },
    },
    sf3_t: {
      id: "sf3_t",
      type: "heading",
      name: "Feature 3 Title",
      parentId: "sf_card_3",
      children: [],
      props: {
        content: "💻 Zero Lock-in Export",
        tag: "h3",
        styles: { desktop: { fontSize: "18px", fontWeight: "700", color: "#ffffff" } },
      },
    },
    sf3_d: {
      id: "sf3_d",
      type: "text",
      name: "Feature 3 Desc",
      parentId: "sf_card_3",
      children: [],
      props: {
        content: "Export raw, production-grade Next.js React JSX or clean semantic HTML+CSS with one click copy and file download.",
        styles: { desktop: { fontSize: "14px", color: "#a1a1aa", lineHeight: "1.6" } },
      },
    },
    saas_cta: {
      id: "saas_cta",
      type: "section",
      name: "Bottom CTA Banner",
      parentId: "root",
      children: ["saas_cta_box"],
      props: {
        tag: "div",
        styles: {
          desktop: {
            padding: "60px 24px 96px 24px",
            backgroundColor: "#000000",
            display: "flex",
            justifyContent: "center",
            width: "100%",
          },
        },
      },
    },
    saas_cta_box: {
      id: "saas_cta_box",
      type: "container",
      name: "CTA Card",
      parentId: "saas_cta",
      children: ["sc_title", "sc_sub", "sc_btn"],
      props: {
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "18px",
            padding: "48px 32px",
            backgroundColor: "#0a0a0a",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            maxWidth: "920px",
            width: "100%",
          },
        },
      },
    },
    sc_title: {
      id: "sc_title",
      type: "heading",
      name: "CTA Title",
      parentId: "saas_cta_box",
      children: [],
      props: {
        content: "Build Better. Faster. Visually.",
        tag: "h2",
        styles: { desktop: { fontSize: "32px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.03em" } },
      },
    },
    sc_sub: {
      id: "sc_sub",
      type: "text",
      name: "CTA Subtitle",
      parentId: "saas_cta_box",
      children: [],
      props: {
        content: "Join thousands of product engineers shipping production web experiences with Vasco Studio.",
        styles: { desktop: { fontSize: "15px", color: "#a1a1aa", maxWidth: "560px" } },
      },
    },
    sc_btn: {
      id: "sc_btn",
      type: "button",
      name: "CTA Action Button",
      parentId: "saas_cta_box",
      children: [],
      props: {
        content: "Get Started Free",
        styles: {
          desktop: {
            padding: "13px 32px",
            backgroundColor: "#6366f1",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "600",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
          },
        },
      },
    },
  };
}

export function generateAiCanvas(prompt: string): Record<string, BuilderNode> {
  const p = prompt.toLowerCase();

  if (
    p.includes("dashboard") ||
    p.includes("analytic") ||
    p.includes("crm") ||
    p.includes("admin") ||
    p.includes("metric") ||
    p.includes("saas dashboard")
  ) {
    return generateDashboardNodes(prompt);
  }

  if (
    p.includes("portfolio") ||
    p.includes("agency") ||
    p.includes("resume") ||
    p.includes("studio") ||
    p.includes("creative") ||
    p.includes("designer")
  ) {
    return generatePortfolioNodes(prompt);
  }

  if (
    p.includes("e-commerce") ||
    p.includes("ecommerce") ||
    p.includes("shop") ||
    p.includes("store") ||
    p.includes("product") ||
    p.includes("apparel") ||
    p.includes("brand")
  ) {
    return generateEcommerceNodes(prompt);
  }

  return generateSaaSNodes(prompt);
}

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

  // AI Generation State
  isGenerated: boolean;
  aiPrompt: string;

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
  setGeneratedStatus: (status: boolean) => void;
  setAiPrompt: (prompt: string) => void;
  generateFromAiPrompt: (prompt: string) => void;
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
  loadProject: (
    nodes: Record<string, BuilderNode> | BuilderNode[],
    id?: string,
    name?: string,
    isGenerated?: boolean,
    prompt?: string
  ) => void;
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

  isGenerated: false,
  aiPrompt: "",

  setGeneratedStatus: (status) => set({ isGenerated: status }),
  setAiPrompt: (prompt) => set({ aiPrompt: prompt }),
  generateFromAiPrompt: (prompt) => {
    const generatedNodes = generateAiCanvas(prompt);
    set({
      nodes: generatedNodes,
      rootNodeId: "root",
      isGenerated: true,
      aiPrompt: prompt,
      selectedNodeId: null,
      history: [get().nodes],
      future: [],
    });
  },

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

  loadProject: (incomingNodes, id, name, isGenerated, prompt) => {
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
        ...(typeof isGenerated === "boolean" ? { isGenerated } : {}),
        ...(typeof prompt === "string" ? { aiPrompt: prompt } : {}),
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
        ...(typeof isGenerated === "boolean" ? { isGenerated } : {}),
        ...(typeof prompt === "string" ? { aiPrompt: prompt } : {}),
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
