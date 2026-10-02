import { BuilderNode } from "@/types/builder";
import { generateId } from "./utils";

export interface TemplateBlock {
  id: string;
  name: string;
  category: "navigation" | "hero" | "features" | "pricing" | "cta" | "footer";
  description: string;
  generate: () => BuilderNode;
}

export const templateBlocks: TemplateBlock[] = [
  {
    id: "block-navbar",
    name: "Modern Navbar",
    category: "navigation",
    description: "Glassmorphic header with logo, navigation links, and CTA button",
    generate: () => ({
      id: generateId(),
      type: "section",
      name: "Header Navigation",
      props: { tag: "div" },
      styles: {
        desktop: {
          padding: "16px 32px",
          backgroundColor: "rgba(10, 10, 12, 0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #27272a",
          display: "flex",
          justifyContent: "center",
          width: "100%",
          position: "sticky",
          top: "0px",
          zIndex: "40",
        },
        mobile: {
          padding: "14px 16px",
        },
      },
      children: [
        {
          id: generateId(),
          type: "container",
          name: "Nav Container",
          props: { tag: "div" },
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
          children: [
            {
              id: generateId(),
              type: "heading",
              name: "Brand Logo",
              props: { content: "⚡ VascoUI", tag: "h3" },
              styles: {
                desktop: {
                  fontSize: "20px",
                  fontWeight: "800",
                  color: "#ffffff",
                  letterSpacing: "-0.03em",
                },
              },
              children: [],
            },
            {
              id: generateId(),
              type: "container",
              name: "Nav Links",
              props: { tag: "div" },
              styles: {
                desktop: {
                  display: "flex",
                  flexDirection: "row",
                  gap: "28px",
                  alignItems: "center",
                  backgroundColor: "transparent",
                  border: "none",
                  padding: "0px",
                },
                mobile: {
                  display: "none",
                },
              },
              children: [
                {
                  id: generateId(),
                  type: "text",
                  name: "Link Features",
                  props: { content: "Features" },
                  styles: {
                    desktop: { fontSize: "14px", color: "#a1a1aa", cursor: "pointer" },
                  },
                  children: [],
                },
                {
                  id: generateId(),
                  type: "text",
                  name: "Link Pricing",
                  props: { content: "Pricing" },
                  styles: {
                    desktop: { fontSize: "14px", color: "#a1a1aa", cursor: "pointer" },
                  },
                  children: [],
                },
                {
                  id: generateId(),
                  type: "text",
                  name: "Link Docs",
                  props: { content: "Documentation" },
                  styles: {
                    desktop: { fontSize: "14px", color: "#a1a1aa", cursor: "pointer" },
                  },
                  children: [],
                },
              ],
            },
            {
              id: generateId(),
              type: "button",
              name: "Nav Action Button",
              props: { content: "Get Started Free" },
              styles: {
                desktop: {
                  padding: "8px 18px",
                  backgroundColor: "#6366f1",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: "600",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                },
              },
              children: [],
            },
          ],
        },
      ],
    }),
  },
  {
    id: "block-hero",
    name: "High-Impact Hero",
    category: "hero",
    description: "Bold hero banner with announcement pill, dynamic headline, and CTA group",
    generate: () => ({
      id: generateId(),
      type: "section",
      name: "Hero Section",
      props: { tag: "div" },
      styles: {
        desktop: {
          padding: "100px 24px",
          backgroundColor: "#09090b",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          textAlign: "center",
        },
        mobile: {
          padding: "60px 16px",
        },
      },
      children: [
        {
          id: generateId(),
          type: "button",
          name: "Hero Announcement Pill",
          props: { content: "✨ The Ultimate Next.js Visual Builder" },
          styles: {
            desktop: {
              display: "inline-flex",
              alignItems: "center",
              padding: "6px 16px",
              backgroundColor: "#18181b",
              color: "#a5b4fc",
              fontSize: "12px",
              fontWeight: "500",
              borderRadius: "9999px",
              border: "1px solid #3730a3",
              marginBottom: "24px",
              cursor: "pointer",
            },
          },
          children: [],
        },
        {
          id: generateId(),
          type: "heading",
          name: "Hero Headline",
          props: {
            content: "Design at the Speed of Thought. Ship to Production in Seconds.",
            tag: "h1",
          },
          styles: {
            desktop: {
              fontSize: "56px",
              fontWeight: "800",
              color: "#ffffff",
              letterSpacing: "-0.04em",
              lineHeight: "1.1",
              maxWidth: "900px",
              margin: "0px auto 20px auto",
              textAlign: "center",
            },
            tablet: {
              fontSize: "42px",
            },
            mobile: {
              fontSize: "32px",
            },
          },
          children: [],
        },
        {
          id: generateId(),
          type: "text",
          name: "Hero Subtitle",
          props: {
            content:
              "Empower your team with visual responsive design, live Turso edge persistence, zero vendor lock-in, and instant Vercel deployments.",
          },
          styles: {
            desktop: {
              fontSize: "18px",
              color: "#a1a1aa",
              maxWidth: "680px",
              lineHeight: "1.6",
              margin: "0px auto 36px auto",
              textAlign: "center",
            },
            mobile: {
              fontSize: "15px",
            },
          },
          children: [],
        },
        {
          id: generateId(),
          type: "container",
          name: "CTA Buttons Row",
          props: { tag: "div" },
          styles: {
            desktop: {
              display: "flex",
              flexDirection: "row",
              gap: "14px",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "transparent",
              border: "none",
              padding: "0px",
            },
            mobile: {
              flexDirection: "column",
              width: "100%",
            },
          },
          children: [
            {
              id: generateId(),
              type: "button",
              name: "Primary CTA",
              props: { content: "Start Building Free →" },
              styles: {
                desktop: {
                  padding: "14px 32px",
                  backgroundColor: "#4f46e5",
                  color: "#ffffff",
                  fontSize: "15px",
                  fontWeight: "600",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                },
              },
              children: [],
            },
            {
              id: generateId(),
              type: "button",
              name: "Secondary CTA",
              props: { content: "Live Interactive Demo" },
              styles: {
                desktop: {
                  padding: "14px 32px",
                  backgroundColor: "#18181b",
                  color: "#f4f4f5",
                  fontSize: "15px",
                  fontWeight: "600",
                  borderRadius: "10px",
                  border: "1px solid #27272a",
                  cursor: "pointer",
                },
              },
              children: [],
            },
          ],
        },
      ],
    }),
  },
  {
    id: "block-features",
    name: "3-Column Feature Cards",
    category: "features",
    description: "Clean grid showing key selling points and capabilities",
    generate: () => ({
      id: generateId(),
      type: "section",
      name: "Features Section",
      props: { tag: "div" },
      styles: {
        desktop: {
          padding: "80px 24px",
          backgroundColor: "#09090b",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        },
        mobile: {
          padding: "48px 16px",
        },
      },
      children: [
        {
          id: generateId(),
          type: "heading",
          name: "Features Section Title",
          props: { content: "Built for Professional Full-Stack Engineers", tag: "h2" },
          styles: {
            desktop: {
              fontSize: "36px",
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: "12px",
              textAlign: "center",
            },
            mobile: { fontSize: "26px" },
          },
          children: [],
        },
        {
          id: generateId(),
          type: "text",
          name: "Features Section Subtitle",
          props: {
            content:
              "Everything you need to craft high-conversion web experiences without sacrificing code quality.",
          },
          styles: {
            desktop: {
              fontSize: "16px",
              color: "#71717a",
              marginBottom: "48px",
              textAlign: "center",
            },
          },
          children: [],
        },
        {
          id: generateId(),
          type: "grid",
          name: "Features Grid",
          props: { columns: 3 },
          styles: {
            desktop: {
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "24px",
              width: "100%",
              maxWidth: "1140px",
            },
            tablet: {
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            },
            mobile: {
              gridTemplateColumns: "1fr",
            },
          },
          children: [
            {
              id: generateId(),
              type: "card",
              name: "Feature Card 1",
              props: {},
              styles: {
                desktop: {
                  padding: "32px 24px",
                  backgroundColor: "#18181b",
                  borderRadius: "14px",
                  border: "1px solid #27272a",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                },
              },
              children: [
                {
                  id: generateId(),
                  type: "heading",
                  name: "Card 1 Title",
                  props: { content: "⚡ Edge-Speed State", tag: "h3" },
                  styles: {
                    desktop: { fontSize: "19px", fontWeight: "600", color: "#ffffff" },
                  },
                  children: [],
                },
                {
                  id: generateId(),
                  type: "text",
                  name: "Card 1 Text",
                  props: {
                    content:
                      "Powered by Zustand and Turso LibSQL replicas with sub-10ms query times worldwide.",
                  },
                  styles: {
                    desktop: { fontSize: "14px", color: "#a1a1aa", lineHeight: "1.6" },
                  },
                  children: [],
                },
              ],
            },
            {
              id: generateId(),
              type: "card",
              name: "Feature Card 2",
              props: {},
              styles: {
                desktop: {
                  padding: "32px 24px",
                  backgroundColor: "#18181b",
                  borderRadius: "14px",
                  border: "1px solid #27272a",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                },
              },
              children: [
                {
                  id: generateId(),
                  type: "heading",
                  name: "Card 2 Title",
                  props: { content: "📱 Responsive Breakpoints", tag: "h3" },
                  styles: {
                    desktop: { fontSize: "19px", fontWeight: "600", color: "#ffffff" },
                  },
                  children: [],
                },
                {
                  id: generateId(),
                  type: "text",
                  name: "Card 2 Text",
                  props: {
                    content:
                      "Tailor every style property individually for Desktop, Tablet, and Mobile with instant visual previews.",
                  },
                  styles: {
                    desktop: { fontSize: "14px", color: "#a1a1aa", lineHeight: "1.6" },
                  },
                  children: [],
                },
              ],
            },
            {
              id: generateId(),
              type: "card",
              name: "Feature Card 3",
              props: {},
              styles: {
                desktop: {
                  padding: "32px 24px",
                  backgroundColor: "#18181b",
                  borderRadius: "14px",
                  border: "1px solid #27272a",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                },
              },
              children: [
                {
                  id: generateId(),
                  type: "heading",
                  name: "Card 3 Title",
                  props: { content: "🛠 Pure React Export", tag: "h3" },
                  styles: {
                    desktop: { fontSize: "19px", fontWeight: "600", color: "#ffffff" },
                  },
                  children: [],
                },
                {
                  id: generateId(),
                  type: "text",
                  name: "Card 3 Text",
                  props: {
                    content:
                      "Export clean, readable, copy-pasteable Next.js JSX components without any proprietary runtime tags.",
                  },
                  styles: {
                    desktop: { fontSize: "14px", color: "#a1a1aa", lineHeight: "1.6" },
                  },
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    }),
  },
  {
    id: "block-pricing",
    name: "Pricing Cards Tier",
    category: "pricing",
    description: "Side-by-side pricing tier cards with features and call-to-actions",
    generate: () => ({
      id: generateId(),
      type: "section",
      name: "Pricing Section",
      props: { tag: "div" },
      styles: {
        desktop: {
          padding: "80px 24px",
          backgroundColor: "#09090b",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        },
        mobile: {
          padding: "48px 16px",
        },
      },
      children: [
        {
          id: generateId(),
          type: "heading",
          name: "Pricing Title",
          props: { content: "Simple, Transparent Pricing", tag: "h2" },
          styles: {
            desktop: {
              fontSize: "36px",
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: "8px",
              textAlign: "center",
            },
          },
          children: [],
        },
        {
          id: generateId(),
          type: "text",
          name: "Pricing Subtitle",
          props: { content: "No credit card required. Cancel anytime." },
          styles: {
            desktop: {
              fontSize: "15px",
              color: "#71717a",
              marginBottom: "40px",
              textAlign: "center",
            },
          },
          children: [],
        },
        {
          id: generateId(),
          type: "grid",
          name: "Pricing Grid",
          props: { columns: 2 },
          styles: {
            desktop: {
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "28px",
              width: "100%",
              maxWidth: "800px",
            },
            mobile: {
              gridTemplateColumns: "1fr",
            },
          },
          children: [
            {
              id: generateId(),
              type: "card",
              name: "Starter Tier",
              props: {},
              styles: {
                desktop: {
                  padding: "36px 28px",
                  backgroundColor: "#18181b",
                  borderRadius: "16px",
                  border: "1px solid #27272a",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                },
              },
              children: [
                {
                  id: generateId(),
                  type: "heading",
                  name: "Tier Name",
                  props: { content: "Starter Plan", tag: "h3" },
                  styles: {
                    desktop: { fontSize: "20px", fontWeight: "600", color: "#ffffff" },
                  },
                  children: [],
                },
                {
                  id: generateId(),
                  type: "heading",
                  name: "Price Tag",
                  props: { content: "$0 / month", tag: "h2" },
                  styles: {
                    desktop: { fontSize: "36px", fontWeight: "800", color: "#6366f1" },
                  },
                  children: [],
                },
                {
                  id: generateId(),
                  type: "text",
                  name: "Plan Features",
                  props: {
                    content:
                      "✓ Unlimited Canvas Projects\n✓ Responsive Viewports\n✓ React Code Export\n✓ Community Support",
                  },
                  styles: {
                    desktop: {
                      fontSize: "14px",
                      color: "#a1a1aa",
                      lineHeight: "1.8",
                      whiteSpace: "pre-line",
                    },
                  },
                  children: [],
                },
                {
                  id: generateId(),
                  type: "button",
                  name: "Tier CTA",
                  props: { content: "Get Started Free" },
                  styles: {
                    desktop: {
                      padding: "12px",
                      backgroundColor: "#27272a",
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: "600",
                      borderRadius: "8px",
                      border: "1px solid #3f3f46",
                      cursor: "pointer",
                      width: "100%",
                      textAlign: "center",
                    },
                  },
                  children: [],
                },
              ],
            },
            {
              id: generateId(),
              type: "card",
              name: "Pro Tier",
              props: {},
              styles: {
                desktop: {
                  padding: "36px 28px",
                  backgroundColor: "#18181b",
                  borderRadius: "16px",
                  border: "2px solid #6366f1",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.15)",
                },
              },
              children: [
                {
                  id: generateId(),
                  type: "heading",
                  name: "Pro Tier Name",
                  props: { content: "Professional Pro", tag: "h3" },
                  styles: {
                    desktop: { fontSize: "20px", fontWeight: "600", color: "#ffffff" },
                  },
                  children: [],
                },
                {
                  id: generateId(),
                  type: "heading",
                  name: "Pro Price Tag",
                  props: { content: "$29 / month", tag: "h2" },
                  styles: {
                    desktop: { fontSize: "36px", fontWeight: "800", color: "#818cf8" },
                  },
                  children: [],
                },
                {
                  id: generateId(),
                  type: "text",
                  name: "Pro Features",
                  props: {
                    content:
                      "✓ All Starter Features\n✓ Turso Cloud Edge Database\n✓ Direct Vercel 1-Click Deploy\n✓ Custom Domains & SSL\n✓ Priority 24/7 Support",
                  },
                  styles: {
                    desktop: {
                      fontSize: "14px",
                      color: "#a1a1aa",
                      lineHeight: "1.8",
                      whiteSpace: "pre-line",
                    },
                  },
                  children: [],
                },
                {
                  id: generateId(),
                  type: "button",
                  name: "Pro Tier CTA",
                  props: { content: "Upgrade to Pro →" },
                  styles: {
                    desktop: {
                      padding: "12px",
                      backgroundColor: "#6366f1",
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: "600",
                      borderRadius: "8px",
                      border: "none",
                      cursor: "pointer",
                      width: "100%",
                      textAlign: "center",
                    },
                  },
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    }),
  },
  {
    id: "block-cta",
    name: "Call to Action Banner",
    category: "cta",
    description: "High-contrast conversion banner with gradient backdrop",
    generate: () => ({
      id: generateId(),
      type: "section",
      name: "CTA Banner Section",
      props: { tag: "div" },
      styles: {
        desktop: {
          padding: "70px 24px",
          backgroundColor: "#09090b",
          display: "flex",
          justifyContent: "center",
          width: "100%",
        },
      },
      children: [
        {
          id: generateId(),
          type: "container",
          name: "CTA Box",
          props: { tag: "div" },
          styles: {
            desktop: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "20px",
              padding: "48px 32px",
              backgroundColor: "linear-gradient(135deg, #1e1b4b 0%, #09090b 100%)",
              borderRadius: "20px",
              border: "1px solid #3730a3",
              maxWidth: "1000px",
              width: "100%",
            },
            mobile: {
              padding: "36px 20px",
            },
          },
          children: [
            {
              id: generateId(),
              type: "heading",
              name: "CTA Headline",
              props: { content: "Ready to Supercharge Your Web Workflow?", tag: "h2" },
              styles: {
                desktop: {
                  fontSize: "36px",
                  fontWeight: "800",
                  color: "#ffffff",
                  letterSpacing: "-0.03em",
                },
                mobile: { fontSize: "24px" },
              },
              children: [],
            },
            {
              id: generateId(),
              type: "text",
              name: "CTA Subtitle",
              props: {
                content:
                  "Join thousands of developers and designers building production-grade sites visually.",
              },
              styles: {
                desktop: { fontSize: "16px", color: "#c7d2fe", maxWidth: "600px" },
              },
              children: [],
            },
            {
              id: generateId(),
              type: "button",
              name: "CTA Final Button",
              props: { content: "Get Started in 30 Seconds" },
              styles: {
                desktop: {
                  padding: "14px 36px",
                  backgroundColor: "#6366f1",
                  color: "#ffffff",
                  fontSize: "15px",
                  fontWeight: "700",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                },
              },
              children: [],
            },
          ],
        },
      ],
    }),
  },
  {
    id: "block-footer",
    name: "Modern Footer",
    category: "footer",
    description: "Structured footer with brand notes, category links, and copyright",
    generate: () => ({
      id: generateId(),
      type: "section",
      name: "Footer Section",
      props: { tag: "div" },
      styles: {
        desktop: {
          padding: "60px 24px 36px 24px",
          backgroundColor: "#050507",
          borderTop: "1px solid #1f1f23",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        },
      },
      children: [
        {
          id: generateId(),
          type: "container",
          name: "Footer Content",
          props: { tag: "div" },
          styles: {
            desktop: {
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "1140px",
              backgroundColor: "transparent",
              border: "none",
              padding: "0px",
              marginBottom: "40px",
            },
            mobile: {
              flexDirection: "column",
              gap: "32px",
            },
          },
          children: [
            {
              id: generateId(),
              type: "container",
              name: "Brand Column",
              props: { tag: "div" },
              styles: {
                desktop: {
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  backgroundColor: "transparent",
                  border: "none",
                  padding: "0px",
                  maxWidth: "320px",
                },
              },
              children: [
                {
                  id: generateId(),
                  type: "heading",
                  name: "Footer Brand",
                  props: { content: "⚡ VascoUI Studio", tag: "h3" },
                  styles: {
                    desktop: { fontSize: "18px", fontWeight: "700", color: "#ffffff" },
                  },
                  children: [],
                },
                {
                  id: generateId(),
                  type: "text",
                  name: "Footer Tagline",
                  props: {
                    content:
                      "Next-generation visual web building with native React, Tailwind CSS, and Turso Edge database.",
                  },
                  styles: {
                    desktop: { fontSize: "13px", color: "#71717a", lineHeight: "1.6" },
                  },
                  children: [],
                },
              ],
            },
            {
              id: generateId(),
              type: "container",
              name: "Footer Links",
              props: { tag: "div" },
              styles: {
                desktop: {
                  display: "flex",
                  flexDirection: "row",
                  gap: "48px",
                  backgroundColor: "transparent",
                  border: "none",
                  padding: "0px",
                },
                mobile: {
                  flexDirection: "column",
                  gap: "20px",
                },
              },
              children: [
                {
                  id: generateId(),
                  type: "text",
                  name: "Col 1",
                  props: {
                    content: "Product\n\nFeatures\nIntegrations\nPricing\nChangelog",
                  },
                  styles: {
                    desktop: {
                      fontSize: "13px",
                      color: "#a1a1aa",
                      lineHeight: "2",
                      whiteSpace: "pre-line",
                    },
                  },
                  children: [],
                },
                {
                  id: generateId(),
                  type: "text",
                  name: "Col 2",
                  props: {
                    content: "Resources\n\nDocumentation\nGuides\nAPI Reference\nCommunity",
                  },
                  styles: {
                    desktop: {
                      fontSize: "13px",
                      color: "#a1a1aa",
                      lineHeight: "2",
                      whiteSpace: "pre-line",
                    },
                  },
                  children: [],
                },
              ],
            },
          ],
        },
        {
          id: generateId(),
          type: "text",
          name: "Copyright Text",
          props: { content: "© 2026 VascoUI. All rights reserved." },
          styles: {
            desktop: {
              fontSize: "12px",
              color: "#52525b",
              textAlign: "center",
              borderTop: "1px solid #18181b",
              paddingTop: "24px",
              width: "100%",
            },
          },
          children: [],
        },
      ],
    }),
  },
];
