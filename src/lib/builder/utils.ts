import { BuilderNode, Device, NodeType } from "@/types/builder";
import React from "react";

export function generateId(): string {
  return "node_" + Math.random().toString(36).substring(2, 9);
}

/**
 * Calculates cascading styles based on responsive breakpoint:
 * Desktop (base) -> Tablet (overrides desktop) -> Mobile (overrides tablet & desktop)
 */
export function computeEffectiveStyles(
  node: BuilderNode,
  device: Device
): React.CSSProperties {
  const desktop = node.styles.desktop || {};
  const tablet = node.styles.tablet || {};
  const mobile = node.styles.mobile || {};

  if (device === "desktop") {
    return { ...desktop };
  } else if (device === "tablet") {
    return { ...desktop, ...tablet };
  } else {
    return { ...desktop, ...tablet, ...mobile };
  }
}

export function findNodeById(
  nodes: BuilderNode[],
  id: string
): BuilderNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children && node.children.length > 0) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function findParentNode(
  nodes: BuilderNode[],
  id: string,
  parent: BuilderNode | null = null
): { parent: BuilderNode | null; index: number } | null {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
      return { parent, index: i };
    }
    if (nodes[i].children && nodes[i].children.length > 0) {
      const result = findParentNode(nodes[i].children, id, nodes[i]);
      if (result) return result;
    }
  }
  return null;
}

export function updateNodeInTree(
  nodes: BuilderNode[],
  id: string,
  updater: (node: BuilderNode) => BuilderNode
): BuilderNode[] {
  return nodes.map((node) => {
    if (node.id === id) {
      return updater({ ...node });
    }
    if (node.children && node.children.length > 0) {
      return {
        ...node,
        children: updateNodeInTree(node.children, id, updater),
      };
    }
    return node;
  });
}

export function removeNodeFromTree(
  nodes: BuilderNode[],
  id: string
): { newNodes: BuilderNode[]; removed: BuilderNode | null } {
  let removed: BuilderNode | null = null;

  function recursiveFilter(currentNodes: BuilderNode[]): BuilderNode[] {
    const result: BuilderNode[] = [];
    for (const node of currentNodes) {
      if (node.id === id) {
        removed = node;
        continue;
      }
      if (node.children && node.children.length > 0) {
        result.push({
          ...node,
          children: recursiveFilter(node.children),
        });
      } else {
        result.push(node);
      }
    }
    return result;
  }

  const newNodes = recursiveFilter(nodes);
  return { newNodes, removed };
}

export function insertNodeIntoTree(
  nodes: BuilderNode[],
  nodeToInsert: BuilderNode,
  parentId?: string | null,
  index?: number
): BuilderNode[] {
  if (!parentId) {
    const list = [...nodes];
    if (typeof index === "number" && index >= 0 && index <= list.length) {
      list.splice(index, 0, { ...nodeToInsert, parentId: null });
    } else {
      list.push({ ...nodeToInsert, parentId: null });
    }
    return list;
  }

  return nodes.map((item) => {
    if (item.id === parentId) {
      const updatedChildren = [...(item.children || [])];
      if (typeof index === "number" && index >= 0 && index <= updatedChildren.length) {
        updatedChildren.splice(index, 0, { ...nodeToInsert, parentId });
      } else {
        updatedChildren.push({ ...nodeToInsert, parentId });
      }
      return {
        ...item,
        children: updatedChildren,
      };
    }
    if (item.children && item.children.length > 0) {
      return {
        ...item,
        children: insertNodeIntoTree(item.children, nodeToInsert, parentId, index),
      };
    }
    return item;
  });
}

export function cloneNode(node: BuilderNode, parentId: string | null = null): BuilderNode {
  const newId = generateId();
  return {
    ...node,
    id: newId,
    name: `${node.name} (Copy)`,
    parentId,
    props: { ...node.props },
    styles: {
      desktop: { ...node.styles.desktop },
      tablet: { ...node.styles.tablet },
      mobile: { ...node.styles.mobile },
    },
    children: (node.children || []).map((child) => cloneNode(child, newId)),
  };
}

export function createDefaultNode(type: NodeType): BuilderNode {
  const id = generateId();

  switch (type) {
    case "section":
      return {
        id,
        type: "section",
        name: "Section",
        props: { tag: "div" },
        styles: {
          desktop: {
            padding: "60px 24px",
            backgroundColor: "#09090b",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          },
          mobile: {
            padding: "32px 16px",
          },
        },
        children: [],
      };

    case "container":
      return {
        id,
        type: "container",
        name: "Container",
        props: { tag: "div" },
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            padding: "24px",
            backgroundColor: "#18181b",
            borderRadius: "12px",
            border: "1px solid #27272a",
            width: "100%",
            maxWidth: "1000px",
          },
        },
        children: [],
      };

    case "grid":
      return {
        id,
        type: "grid",
        name: "2-Column Grid",
        props: { columns: 2, gap: "20px" },
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
        children: [],
      };

    case "heading":
      return {
        id,
        type: "heading",
        name: "Heading",
        props: { content: "Build Beautiful Websites Visually", tag: "h2" },
        styles: {
          desktop: {
            fontSize: "36px",
            fontWeight: "700",
            color: "#fafafa",
            textAlign: "left",
            lineHeight: "1.2",
            margin: "0px",
          },
          mobile: {
            fontSize: "26px",
          },
        },
        children: [],
      };

    case "text":
      return {
        id,
        type: "text",
        name: "Paragraph",
        props: {
          content:
            "Design, tweak responsive breakpoints, inspect CSS properties, and deploy directly to production with zero friction.",
          tag: "p",
        },
        styles: {
          desktop: {
            fontSize: "16px",
            color: "#a1a1aa",
            lineHeight: "1.6",
            margin: "0px",
          },
        },
        children: [],
      };

    case "button":
      return {
        id,
        type: "button",
        name: "Primary Button",
        props: { content: "Get Started Now", href: "#" },
        styles: {
          desktop: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px 24px",
            backgroundColor: "#6366f1",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "600",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s ease",
            width: "auto",
          },
        },
        children: [],
      };

    case "image":
      return {
        id,
        type: "image",
        name: "Image",
        props: {
          src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
          alt: "Abstract Fluid Gradient Graphic",
        },
        styles: {
          desktop: {
            width: "100%",
            height: "280px",
            objectFit: "cover",
            borderRadius: "10px",
          },
        },
        children: [],
      };

    case "card":
      return {
        id,
        type: "card",
        name: "Feature Card",
        props: { tag: "div" },
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            padding: "24px",
            backgroundColor: "#18181b",
            borderRadius: "12px",
            border: "1px solid #27272a",
          },
        },
        children: [
          {
            id: generateId(),
            type: "heading",
            name: "Card Title",
            props: { content: "Ultra-Fast Edge Engine", tag: "h3" },
            styles: {
              desktop: {
                fontSize: "20px",
                fontWeight: "600",
                color: "#fafafa",
              },
            },
            children: [],
          },
          {
            id: generateId(),
            type: "text",
            name: "Card Description",
            props: {
              content:
                "Powered by Turso edge replicas and Next.js for blazing fast performance worldwide.",
            },
            styles: {
              desktop: {
                fontSize: "14px",
                color: "#a1a1aa",
                lineHeight: "1.5",
              },
            },
            children: [],
          },
        ],
      };

    default:
      return {
        id,
        type: "container",
        name: "Container",
        props: {},
        styles: { desktop: { padding: "16px" } },
        children: [],
      };
  }
}

export const initialTemplateNodes: BuilderNode[] = [
  {
    id: "hero_section_1",
    type: "section",
    name: "Hero Section",
    props: { tag: "div" },
    styles: {
      desktop: {
        padding: "80px 24px",
        backgroundColor: "#09090b",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      },
      mobile: {
        padding: "48px 16px",
      },
    },
    children: [
      {
        id: "hero_container_1",
        type: "container",
        name: "Hero Content Container",
        props: { tag: "div" },
        styles: {
          desktop: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "20px",
            maxWidth: "850px",
            width: "100%",
            backgroundColor: "transparent",
            border: "none",
          },
        },
        children: [
          {
            id: "badge_1",
            type: "button",
            name: "Announce Badge",
            props: { content: "⚡ Vasco Studio 2.0 Live", href: "#" },
            styles: {
              desktop: {
                display: "inline-flex",
                padding: "6px 14px",
                backgroundColor: "#27272a",
                color: "#a1a1aa",
                fontSize: "12px",
                fontWeight: "500",
                borderRadius: "9999px",
                border: "1px solid #3f3f46",
                cursor: "pointer",
              },
            },
            children: [],
          },
          {
            id: "hero_title_1",
            type: "heading",
            name: "Main Title",
            props: {
              content: "Visual Design Meets Production-Grade Next.js",
              tag: "h1",
            },
            styles: {
              desktop: {
                fontSize: "52px",
                fontWeight: "800",
                color: "#ffffff",
                letterSpacing: "-0.03em",
                lineHeight: "1.1",
                textAlign: "center",
              },
              tablet: {
                fontSize: "40px",
              },
              mobile: {
                fontSize: "32px",
              },
            },
            children: [],
          },
          {
            id: "hero_desc_1",
            type: "text",
            name: "Subtitle",
            props: {
              content:
                "Design visually with responsive breakpoints, recursive DOM nesting, and dynamic CSS inspector. Save instantly to Turso Edge and deploy to Vercel.",
            },
            styles: {
              desktop: {
                fontSize: "18px",
                color: "#a1a1aa",
                maxWidth: "650px",
                lineHeight: "1.6",
                textAlign: "center",
              },
              mobile: {
                fontSize: "15px",
              },
            },
            children: [],
          },
          {
            id: "button_group_1",
            type: "container",
            name: "CTA Group",
            props: { tag: "div" },
            styles: {
              desktop: {
                display: "flex",
                flexDirection: "row",
                gap: "12px",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "transparent",
                border: "none",
                padding: "8px 0px",
              },
              mobile: {
                flexDirection: "column",
                width: "100%",
              },
            },
            children: [
              {
                id: "cta_btn_1",
                type: "button",
                name: "Start Building CTA",
                props: { content: "Start Building Free", href: "#" },
                styles: {
                  desktop: {
                    padding: "12px 28px",
                    backgroundColor: "#6366f1",
                    color: "#ffffff",
                    fontSize: "15px",
                    fontWeight: "600",
                    borderRadius: "8px",
                    cursor: "pointer",
                    border: "none",
                  },
                },
                children: [],
              },
              {
                id: "cta_btn_2",
                type: "button",
                name: "Documentation CTA",
                props: { content: "Documentation →", href: "#" },
                styles: {
                  desktop: {
                    padding: "12px 28px",
                    backgroundColor: "#18181b",
                    color: "#e4e4e7",
                    fontSize: "15px",
                    fontWeight: "600",
                    borderRadius: "8px",
                    cursor: "pointer",
                    border: "1px solid #27272a",
                  },
                },
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: "features_grid_1",
        type: "grid",
        name: "Features Grid",
        props: { columns: 3, gap: "20px" },
        styles: {
          desktop: {
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "24px",
            maxWidth: "1100px",
            width: "100%",
            marginTop: "60px",
          },
          tablet: {
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          },
          mobile: {
            gridTemplateColumns: "1fr",
            marginTop: "36px",
          },
        },
        children: [
          {
            id: "card_1",
            type: "card",
            name: "Responsive Breakpoints Card",
            props: {},
            styles: {
              desktop: {
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                padding: "24px",
                backgroundColor: "#18181b",
                borderRadius: "12px",
                border: "1px solid #27272a",
              },
            },
            children: [
              {
                id: "c1_title",
                type: "heading",
                name: "Feature 1 Title",
                props: { content: "📱 Responsive Breakpoints", tag: "h3" },
                styles: {
                  desktop: { fontSize: "18px", fontWeight: "600", color: "#fafafa" },
                },
                children: [],
              },
              {
                id: "c1_desc",
                type: "text",
                name: "Feature 1 Description",
                props: {
                  content:
                    "Switch effortlessly between Desktop, Tablet, and Mobile. Style changes cascade naturally across breakpoints.",
                },
                styles: {
                  desktop: { fontSize: "14px", color: "#a1a1aa", lineHeight: "1.5" },
                },
                children: [],
              },
            ],
          },
          {
            id: "card_2",
            type: "card",
            name: "Turso & Drizzle Card",
            props: {},
            styles: {
              desktop: {
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                padding: "24px",
                backgroundColor: "#18181b",
                borderRadius: "12px",
                border: "1px solid #27272a",
              },
            },
            children: [
              {
                id: "c2_title",
                type: "heading",
                name: "Feature 2 Title",
                props: { content: "⚡ Edge Persistence", tag: "h3" },
                styles: {
                  desktop: { fontSize: "18px", fontWeight: "600", color: "#fafafa" },
                },
                children: [],
              },
              {
                id: "c2_desc",
                type: "text",
                name: "Feature 2 Description",
                props: {
                  content:
                    "Persist and hydrate your visual canvas directly into Turso database with Drizzle ORM server actions.",
                },
                styles: {
                  desktop: { fontSize: "14px", color: "#a1a1aa", lineHeight: "1.5" },
                },
                children: [],
              },
            ],
          },
          {
            id: "card_3",
            type: "card",
            name: "React Code Export Card",
            props: {},
            styles: {
              desktop: {
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                padding: "24px",
                backgroundColor: "#18181b",
                borderRadius: "12px",
                border: "1px solid #27272a",
              },
            },
            children: [
              {
                id: "c3_title",
                type: "heading",
                name: "Feature 3 Title",
                props: { content: "💻 Clean Code Export", tag: "h3" },
                styles: {
                  desktop: { fontSize: "18px", fontWeight: "600", color: "#fafafa" },
                },
                children: [],
              },
              {
                id: "c3_desc",
                type: "text",
                name: "Feature 3 Description",
                props: {
                  content:
                    "Generate production-ready Next.js React JSX with inline styles or Tailwind classes with a single click.",
                },
                styles: {
                  desktop: { fontSize: "14px", color: "#a1a1aa", lineHeight: "1.5" },
                },
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
];

/**
 * Generates ready-to-run React JSX code export from the node tree
 */
export function generateReactCode(inputNodes: any): string {
  // If normalized Record<string, any>
  if (inputNodes && !Array.isArray(inputNodes) && typeof inputNodes === "object") {
    const nodesMap = inputNodes as Record<string, any>;
    const rootNode = nodesMap["root"] || Object.values(nodesMap).find((n: any) => !n.parentId);
    if (!rootNode) return "// No nodes found";

    function renderNormalizedNode(nodeId: string, depth: number): string {
      const node = nodesMap[nodeId];
      if (!node) return "";
      const indent = "  ".repeat(depth);
      const styles = node.props?.styles?.desktop || node.styles?.desktop || {};
      const styleString = JSON.stringify(styles, null, 2)
        .split("\n")
        .map((line: string, idx: number) => (idx === 0 ? line : indent + "  " + line))
        .join("\n");

      const childIds: string[] = Array.isArray(node.children) ? node.children : [];
      const hasChildren = childIds.length > 0;

      switch (node.type) {
        case "heading": {
          const Tag = node.props?.tag || "h2";
          return `${indent}<${Tag} style={${styleString}}>${node.props?.content || ""}</${Tag}>`;
        }
        case "text": {
          const Tag = node.props?.tag || "p";
          return `${indent}<${Tag} style={${styleString}}>${node.props?.content || ""}</${Tag}>`;
        }
        case "button": {
          return `${indent}<button style={${styleString}}>${node.props?.content || "Button"}</button>`;
        }
        case "image": {
          return `${indent}<img src="${node.props?.src || ""}" alt="${node.props?.alt || ""}" style={${styleString}} />`;
        }
        case "root": {
          return childIds
            .map((cId) => renderNormalizedNode(cId, depth))
            .filter(Boolean)
            .join("\n\n");
        }
        default: {
          const Tag = node.props?.tag || "div";
          if (!hasChildren) {
            return `${indent}<${Tag} style={${styleString}} />`;
          }
          const childrenCode = childIds
            .map((cId) => renderNormalizedNode(cId, depth + 1))
            .filter(Boolean)
            .join("\n");
          return `${indent}<${Tag} style={${styleString}}>\n${childrenCode}\n${indent}</${Tag}>`;
        }
      }
    }

    const body = renderNormalizedNode(rootNode.id, 2);

    return `import React from "react";

export default function ExportedPage() {
  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#050505", color: "#fafafa", fontFamily: "sans-serif" }}>
${body}
    </main>
  );
}
`;
  }

  // Fallback for array-based nodes
  const nodes = (Array.isArray(inputNodes) ? inputNodes : []) as BuilderNode[];

  function renderNodeCode(node: BuilderNode, depth: number): string {
    const indent = "  ".repeat(depth);
    const styles = node.styles?.desktop || {};
    const styleString = JSON.stringify(styles, null, 2)
      .split("\n")
      .map((line, idx) => (idx === 0 ? line : indent + "  " + line))
      .join("\n");

    const hasChildren = node.children && node.children.length > 0;

    switch (node.type) {
      case "heading": {
        const Tag = node.props.tag || "h2";
        return `${indent}<${Tag} style={${styleString}}>${node.props.content || ""}</${Tag}>`;
      }
      case "text": {
        const Tag = node.props.tag || "p";
        return `${indent}<${Tag} style={${styleString}}>${node.props.content || ""}</${Tag}>`;
      }
      case "button": {
        return `${indent}<button style={${styleString}}>${node.props.content || "Button"}</button>`;
      }
      case "image": {
        return `${indent}<img src="${node.props.src || ""}" alt="${node.props.alt || ""}" style={${styleString}} />`;
      }
      default: {
        const Tag = node.props.tag || "div";
        if (!hasChildren) {
          return `${indent}<${Tag} style={${styleString}} />`;
        }
        const childrenCode = node.children
          .map((child) => renderNodeCode(child, depth + 1))
          .join("\n");
        return `${indent}<${Tag} style={${styleString}}>\n${childrenCode}\n${indent}</${Tag}>`;
      }
    }
  }

  const body = nodes.map((n) => renderNodeCode(n, 2)).join("\n\n");

  return `import React from "react";

export default function ExportedPage() {
  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#050505", color: "#fafafa", fontFamily: "sans-serif" }}>
${body}
    </main>
  );
}
`;
}

function styleObjectToCssString(styles: Record<string, unknown>): string {
  return Object.entries(styles)
    .map(([key, val]) => {
      const kebab = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      return `${kebab}: ${val};`;
    })
    .join(" ");
}

export function generateHtmlCode(inputNodes: any): string {
  // If normalized Record<string, any>
  if (inputNodes && !Array.isArray(inputNodes) && typeof inputNodes === "object") {
    const nodesMap = inputNodes as Record<string, any>;
    const rootNode = nodesMap["root"] || Object.values(nodesMap).find((n: any) => !n.parentId);
    if (!rootNode) return "<!DOCTYPE html><html><body></body></html>";

    function renderNormalizedHtml(nodeId: string, depth: number): string {
      const node = nodesMap[nodeId];
      if (!node) return "";
      const indent = "  ".repeat(depth);
      const styles = node.props?.styles?.desktop || node.styles?.desktop || {};
      const css = styleObjectToCssString(styles as Record<string, unknown>);
      const styleAttr = css ? ` style="${css}"` : "";

      const childIds: string[] = Array.isArray(node.children) ? node.children : [];
      const hasChildren = childIds.length > 0;

      switch (node.type) {
        case "heading": {
          const Tag = node.props?.tag || "h2";
          return `${indent}<${Tag}${styleAttr}>${node.props?.content || ""}</${Tag}>`;
        }
        case "text": {
          const Tag = node.props?.tag || "p";
          return `${indent}<${Tag}${styleAttr}>${node.props?.content || ""}</${Tag}>`;
        }
        case "button": {
          return `${indent}<button${styleAttr}>${node.props?.content || "Button"}</button>`;
        }
        case "image": {
          return `${indent}<img src="${node.props?.src || ""}" alt="${node.props?.alt || ""}"${styleAttr} />`;
        }
        case "root": {
          return childIds
            .map((cId) => renderNormalizedHtml(cId, depth))
            .filter(Boolean)
            .join("\n");
        }
        default: {
          const Tag = node.props?.tag || "div";
          if (!hasChildren) {
            return `${indent}<${Tag}${styleAttr}></${Tag}>`;
          }
          const inner = childIds
            .map((cId) => renderNormalizedHtml(cId, depth + 1))
            .filter(Boolean)
            .join("\n");
          return `${indent}<${Tag}${styleAttr}>\n${inner}\n${indent}</${Tag}>`;
        }
      }
    }

    const innerHtml = renderNormalizedHtml(rootNode.id, 2);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vasco Exported Page</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #050505; color: #fafafa; }
  </style>
</head>
<body>
${innerHtml}
</body>
</html>`;
  }

  // Fallback for array-based nodes
  const nodes = (Array.isArray(inputNodes) ? inputNodes : []) as BuilderNode[];

  function renderHtmlNode(node: BuilderNode, depth: number): string {
    const indent = "  ".repeat(depth);
    const styles = node.styles?.desktop || {};
    const css = styleObjectToCssString(styles as Record<string, unknown>);
    const styleAttr = css ? ` style="${css}"` : "";

    switch (node.type) {
      case "heading": {
        const Tag = node.props.tag || "h2";
        return `${indent}<${Tag}${styleAttr}>${node.props.content || ""}</${Tag}>`;
      }
      case "text": {
        const Tag = node.props.tag || "p";
        return `${indent}<${Tag}${styleAttr}>${node.props.content || ""}</${Tag}>`;
      }
      case "button": {
        return `${indent}<button${styleAttr}>${node.props.content || "Button"}</button>`;
      }
      case "image": {
        return `${indent}<img src="${node.props.src || ""}" alt="${node.props.alt || ""}"${styleAttr} />`;
      }
      default: {
        const Tag = node.props.tag || "div";
        const hasChildren = node.children && node.children.length > 0;
        if (!hasChildren) {
          return `${indent}<${Tag}${styleAttr}></${Tag}>`;
        }
        const inner = node.children.map((c) => renderHtmlNode(c, depth + 1)).join("\n");
        return `${indent}<${Tag}${styleAttr}>\n${inner}\n${indent}</${Tag}>`;
      }
    }
  }

  const innerHtml = nodes.map((n) => renderHtmlNode(n, 2)).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vasco Exported Page</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #050505; color: #fafafa; }
  </style>
</head>
<body>
${innerHtml}
</body>
</html>`;
}

export function moveNodeUpInTree(nodes: BuilderNode[], id: string): BuilderNode[] {
  // Check at current level
  const index = nodes.findIndex((n) => n.id === id);
  if (index > 0) {
    const copy = [...nodes];
    const temp = copy[index - 1];
    copy[index - 1] = copy[index];
    copy[index] = temp;
    return copy;
  }

  // Recurse into children
  return nodes.map((node) => {
    if (node.children && node.children.length > 0) {
      return {
        ...node,
        children: moveNodeUpInTree(node.children, id),
      };
    }
    return node;
  });
}

export function moveNodeDownInTree(nodes: BuilderNode[], id: string): BuilderNode[] {
  // Check at current level
  const index = nodes.findIndex((n) => n.id === id);
  if (index !== -1 && index < nodes.length - 1) {
    const copy = [...nodes];
    const temp = copy[index + 1];
    copy[index + 1] = copy[index];
    copy[index] = temp;
    return copy;
  }

  // Recurse into children
  return nodes.map((node) => {
    if (node.children && node.children.length > 0) {
      return {
        ...node,
        children: moveNodeDownInTree(node.children, id),
      };
    }
    return node;
  });
}

