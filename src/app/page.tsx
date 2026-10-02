import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
import {
  Sparkles,
  ArrowRight,
  Monitor,
  Tablet,
  Smartphone,
  Layers,
  Database,
  Code2,
  Sliders,
  CheckCircle2,
  Zap,
  ShieldCheck,
  MousePointer2,
} from "lucide-react";

export default function MarketingLandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-indigo-500 selection:text-white flex flex-col font-sans">
      {/* Background Subtle Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-[35%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 blur-[130px] rounded-full" />
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#050505]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">
                VASCO
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-indigo-300">
                STUDIO
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition">
              Features
            </a>
            <a href="#mockup" className="hover:text-white transition">
              Interface Preview
            </a>
            <a href="#workflow" className="hover:text-white transition">
              Workflow
            </a>
            <a
              href="https://github.com/elmurtadho/VascoUI"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition"
            >
              GitHub
            </a>
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/40 transition">
                  Get Started Free
                </button>
              </SignUpButton>
            </Show>

            <Show when="signed-in">
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 transition"
              >
                <span>Go to Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 rounded-xl ring-2 ring-white/10",
                  },
                }}
              />
            </Show>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 z-10">
        {/* HERO SECTION */}
        <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 px-6 max-w-6xl mx-auto flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-indigo-300 mb-8 backdrop-blur-md shadow-inner">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span>Vasco Studio 2.0 with Edge Persistence</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl mb-6">
            Design visually. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200 bg-clip-text text-transparent">
              Ship instantly.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed mb-10 font-normal">
            The professional visual page builder engineered with Next.js App
            Router, Zustand tree state, LibSQL Turso edge database, and zero-code
            friction.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Show when="signed-out">
              <SignUpButton mode="modal">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition-all">
                  <span>Start Building Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold bg-[#0a0a0a] hover:bg-zinc-900 text-zinc-300 hover:text-white border border-white/10 transition">
                  Sign In to Projects
                </button>
              </SignInButton>
            </Show>

            <Show when="signed-in">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition-all"
              >
                <span>Open Your Projects Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Show>
          </div>

          {/* Key metrics / trust pills */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Full Breakpoint Cascades</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Sub-10ms Turso Edge DB</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Raw Next.js JSX Export</span>
            </div>
          </div>
        </section>

        {/* BUILDER UI MOCKUP SECTION */}
        <section id="mockup" className="relative max-w-6xl mx-auto px-6 pb-28">
          <div className="relative rounded-2xl border border-white/10 bg-[#0a0a0a] p-3 shadow-2xl shadow-indigo-950/40 overflow-hidden">
            {/* Window Chrome Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#050505] rounded-t-xl mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 text-[11px] font-mono text-zinc-500">
                  vasco-studio://project/landing-page-v2
                </span>
              </div>

              {/* Viewport switcher mock */}
              <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-0.5 rounded-lg">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600 text-white text-[10px] font-medium">
                  <Monitor className="w-3 h-3" />
                  <span>Desktop (1240px)</span>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 text-zinc-400 text-[10px] font-medium">
                  <Tablet className="w-3 h-3" />
                  <span>Tablet</span>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 text-zinc-400 text-[10px] font-medium">
                  <Smartphone className="w-3 h-3" />
                  <span>Mobile</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Turso Edge Synced</span>
                </div>
              </div>
            </div>

            {/* Mock 3-Pane Interface */}
            <div className="grid grid-cols-12 gap-3 h-[460px] rounded-b-xl overflow-hidden font-mono text-xs">
              {/* Left Mock Palette */}
              <div className="col-span-3 bg-[#050505] border border-white/10 rounded-xl p-3 flex flex-col gap-2.5">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Palette & Blocks</span>
                </div>
                {["Section Block", "Flex Container", "3-Col Grid", "Hero Heading", "Action Button", "Media Image"].map(
                  (item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#0a0a0a] border border-white/5 text-[11px] text-zinc-300 hover:border-indigo-500/50 hover:text-white transition cursor-grab"
                    >
                      <span className="font-sans font-medium">{item}</span>
                      <span className="text-[10px] text-zinc-600 font-mono">+ drag</span>
                    </div>
                  )
                )}
              </div>

              {/* Center Canvas Mock */}
              <div
                className="col-span-6 bg-[#050505] border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
                  backgroundSize: "18px 18px",
                }}
              >
                {/* Floating element selector badge */}
                <div className="w-full max-w-sm rounded-xl border-2 border-indigo-500 bg-[#0a0a0a] p-4 shadow-xl relative animate-in fade-in duration-300">
                  <div className="absolute -top-6 left-3 px-2 py-0.5 rounded-t text-[10px] font-bold bg-indigo-600 text-white flex items-center gap-1">
                    <span>Heading [H1]</span>
                    <span className="opacity-70 text-[9px]">desktop: 52px</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1.5 font-sans">
                    Design Visually.
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    Recursive DOM hierarchy with real-time responsive style cascades.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <div className="px-3 py-1 rounded-md bg-indigo-600 text-white text-[11px] font-sans font-semibold">
                      Primary Action
                    </div>
                    <div className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-300 text-[11px] font-sans">
                      Secondary
                    </div>
                  </div>
                </div>

                {/* Mouse cursor pointer graphic */}
                <div className="absolute top-[45%] right-[28%] flex items-center gap-1 pointer-events-none">
                  <MousePointer2 className="w-5 h-5 text-indigo-400 fill-indigo-400 drop-shadow-lg" />
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-600 text-white font-sans font-semibold shadow">
                    Inspector Active
                  </span>
                </div>
              </div>

              {/* Right Mock Inspector */}
              <div className="col-span-3 bg-[#050505] border border-white/10 rounded-xl p-3 flex flex-col gap-2.5 overflow-hidden">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Visual Inspector</span>
                </div>

                <div className="p-2 rounded-lg bg-[#0a0a0a] border border-white/5 text-[11px] space-y-2">
                  <div className="flex justify-between text-zinc-400">
                    <span>Display</span>
                    <span className="text-indigo-400 font-bold">flex (col)</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Font Size</span>
                    <span className="text-zinc-200">52px</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Padding</span>
                    <span className="text-zinc-200">90px 24px</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Background</span>
                    <span className="text-zinc-200">#050505</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Border Radius</span>
                    <span className="text-zinc-200">14px</span>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-[10px] text-indigo-300 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Updates save to styles.desktop in real-time</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CORE FEATURES SECTION */}
        <section id="features" className="py-24 border-t border-white/10 bg-[#0a0a0a]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                Engineered for Modern Web Builders
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                Everything you need to build stunning responsive pages, manage database persistence, and export production code.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-8 rounded-2xl bg-[#050505] border border-white/10 hover:border-indigo-500/40 transition flex flex-col gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition">
                  <Monitor className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Responsive Breakpoint Engine
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Seamlessly toggle between Desktop, Tablet, and Mobile. Styles cascade automatically from desktop base down to mobile overrides.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-2xl bg-[#050505] border border-white/10 hover:border-indigo-500/40 transition flex flex-col gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Turso Edge Database
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Instant auto-save to Turso libSQL edge replicas with Drizzle ORM. Your projects are stored globally close to your users.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-2xl bg-[#050505] border border-white/10 hover:border-indigo-500/40 transition flex flex-col gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-emerald-600/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
                  <Code2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Clean React & JSX Export
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Zero vendor lock-in. Generate production-ready Next.js React JSX or standalone HTML with 1-click copy and file download.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WORKFLOW / CALL TO ACTION BANNER */}
        <section id="workflow" className="py-24 max-w-5xl mx-auto px-6">
          <div className="relative rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/40 to-[#0a0a0a] p-10 sm:p-14 text-center overflow-hidden shadow-2xl">
            <div className="max-w-2xl mx-auto flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-600/40">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
                Start Crafting Your Next Website
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed mb-8 max-w-xl">
                Create unlimited responsive pages, inspect visual properties, and deploy directly to production.
              </p>

              <Show when="signed-out">
                <SignUpButton mode="modal">
                  <button className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition-all">
                    <span>Create Your Free Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </SignUpButton>
              </Show>

              <Show when="signed-in">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition-all"
                >
                  <span>Go to Your Projects Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Show>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#050505] py-10 px-6 z-10 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white">VASCO STUDIO</span>
            <span>— Visual Web Builder</span>
          </div>
          <div>© {new Date().getFullYear()} Vasco Studio. Built with Next.js, Clerk & Turso.</div>
        </div>
      </footer>
    </div>
  );
}
