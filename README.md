# VascoUI — Visual Page Builder & Studio

A production-ready Visual UI Builder built with Next.js 14+ (App Router), Zustand, `@dnd-kit`, Tailwind CSS, and Turso Edge Database with Drizzle ORM.

## ✨ Features

- **Advanced Node Tree & Recursive Rendering**: Infinite nesting of elements (`Section`, `Container`, `Grid`, `Heading`, `Text`, `Button`, `Image`, `Card`).
- **Responsive Breakpoints System**: Switch between Desktop (1240px), Tablet (768px), and Mobile (375px) viewports with cascading responsive styles (`styles.desktop` → `styles.tablet` → `styles.mobile`).
- **Visual CSS Inspector**: Precision control over Flexbox, Grid, Typography, Colors, Spacing (padding & margin box model), Dimensions, and Borders.
- **Turso Edge Database Persistence**: Instant auto-save and hydration of the JSON node tree to Turso LibSQL via Next.js Server Actions.
- **Code Export**: Generate clean, ready-to-run React/Next.js JSX code with one-click copy and file download.
- **Interactive DOM Tree / Layers**: Real-time layer explorer with hierarchy collapse, component selection, duplicate, and deletion.
- **Undo / Redo & Keyboard Shortcuts**:
  - `Ctrl + Z` / `Cmd + Z`: Undo
  - `Ctrl + Y` / `Cmd + Shift + Z`: Redo
  - `Delete` / `Backspace`: Delete selected node

## 🛠 Tech Stack

- **Framework**: Next.js 16+ App Router, React 19, TypeScript
- **State Management**: Zustand
- **Drag & Drop**: `@dnd-kit/core`
- **Styling**: Tailwind CSS, Lucide Icons
- **Database**: Turso (LibSQL) + Drizzle ORM
- **Deployment**: Vercel CLI

## 🚀 Getting Started

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Configure environment variables (optional for local SQLite development):
```bash
cp .env.example .env.local
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
