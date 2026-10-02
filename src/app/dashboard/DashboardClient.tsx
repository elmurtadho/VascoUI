"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Project } from "@/db/schema";
import { UserButton } from "@clerk/nextjs";
import { useTheme } from "@/context/ThemeContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Sparkles,
  Plus,
  Trash2,
  ExternalLink,
  Layers,
  Clock,
  FolderOpen,
  Loader2,
  Code2,
  Wand2,
  ArrowRight,
  Bot,
} from "lucide-react";
import { createProjectAction, deleteProjectAction } from "@/app/actions/project";

interface DashboardClientProps {
  initialProjects: Project[];
  userEmail?: string | null;
}

export const DashboardClient: React.FC<DashboardClientProps> = ({
  initialProjects,
  userEmail,
}) => {
  const router = useRouter();
  const { isDark } = useTheme();
  const [projectsList, setProjectsList] = useState<Project[]>(initialProjects);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreateProject = async () => {
    setIsCreating(true);
    try {
      const res = await createProjectAction("Untitled Project");
      if (res.success && res.id) {
        router.push(`/project/${res.id}`);
      }
    } catch (err) {
      console.error("Failed to create project:", err);
      setIsCreating(false);
    }
  };

  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this project?")) return;

    setDeletingId(id);
    try {
      const res = await deleteProjectAction(id);
      if (res.success) {
        setProjectsList((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete project:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const getNodeCount = (canvasData: string) => {
    try {
      const parsed = JSON.parse(canvasData);
      if (Array.isArray(parsed)) return parsed.length;
      if (parsed && typeof parsed === "object") return Object.keys(parsed).length;
      return 0;
    } catch {
      return 0;
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDark ? "bg-[#09090b] text-zinc-100" : "bg-[#f8fafc] text-zinc-900"
      }`}
    >
      {/* Top Bar */}
      <header
        className={`sticky top-0 z-50 w-full border-b transition-colors duration-200 backdrop-blur-xl ${
          isDark
            ? "border-white/[0.08] bg-[#09090b]/80"
            : "border-zinc-200 bg-white/80 shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo & Breadcrumb */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
                <Sparkles className="w-4 h-4" />
              </div>
              <span
                className={`font-extrabold text-base tracking-tight ${
                  isDark ? "text-white" : "text-zinc-900"
                }`}
              >
                VASCO
              </span>
            </Link>
            <span className={isDark ? "text-zinc-600" : "text-zinc-300"}>/</span>
            <span
              className={`text-xs font-semibold ${
                isDark ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              Workspace Dashboard
            </span>
          </div>

          {/* User Controls & Theme Toggle */}
          <div className="flex items-center gap-3">
            {/* GLOBAL THEME TOGGLE */}
            <ThemeToggle />

            {userEmail && (
              <span
                className={`hidden sm:inline text-xs font-mono ${
                  isDark ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                {userEmail}
              </span>
            )}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: `w-8 h-8 rounded-xl ring-2 ${
                    isDark ? "ring-white/10" : "ring-zinc-200"
                  }`,
                },
              }}
            />
          </div>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                isDark ? "text-white" : "text-zinc-900"
              }`}
            >
              Projects
            </h1>
            <p
              className={`text-xs sm:text-sm mt-1 ${
                isDark ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              Create, design, and manage your AI-native responsive websites.
            </p>
          </div>

          <button
            onClick={handleCreateProject}
            disabled={isCreating}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold shadow-lg transition disabled:opacity-50 cursor-pointer ${
              isDark
                ? "bg-white hover:bg-zinc-200 text-black shadow-white/5"
                : "bg-zinc-900 hover:bg-zinc-800 text-white shadow-zinc-900/10"
            }`}
          >
            {isCreating ? (
              <>
                <Loader2
                  className={`w-4 h-4 animate-spin ${
                    isDark ? "text-black" : "text-white"
                  }`}
                />
                <span>Creating Project...</span>
              </>
            ) : (
              <>
                <Plus
                  className={`w-4 h-4 ${
                    isDark ? "text-black" : "text-white"
                  }`}
                />
                <span>Create New Project</span>
              </>
            )}
          </button>
        </div>

        {/* Projects Grid */}
        {projectsList.length === 0 ? (
          <div
            className={`flex flex-col items-center justify-center p-16 rounded-2xl border border-dashed text-center my-8 ${
              isDark
                ? "border-white/[0.08] bg-[#121214]"
                : "border-zinc-300 bg-white shadow-sm"
            }`}
          >
            <div
              className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-4 ${
                isDark
                  ? "bg-white/5 border-white/[0.08] text-zinc-400"
                  : "bg-zinc-50 border-zinc-200 text-zinc-500"
              }`}
            >
              <FolderOpen className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h3
              className={`text-base font-semibold mb-1 ${
                isDark ? "text-white" : "text-zinc-900"
              }`}
            >
              No projects yet
            </h3>
            <p
              className={`text-xs max-w-sm mb-6 leading-relaxed ${
                isDark ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              Create your first project to experience the AI-prompt layout engine and live responsive builder.
            </p>
            <button
              onClick={handleCreateProject}
              disabled={isCreating}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold shadow-lg transition ${
                isDark
                  ? "bg-white hover:bg-zinc-200 text-black"
                  : "bg-zinc-900 hover:bg-zinc-800 text-white"
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Project</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsList.map((project) => (
              <div
                key={project.id}
                onClick={() => router.push(`/project/${project.id}`)}
                className={`group relative flex flex-col rounded-2xl border p-5 transition-all shadow-lg cursor-pointer select-none ${
                  isDark
                    ? "border-white/[0.08] bg-[#121214] hover:border-indigo-500/40 hover:bg-[#18181b]"
                    : "border-zinc-200 bg-white hover:border-indigo-500/40 hover:bg-zinc-50 shadow-sm"
                }`}
              >
                {/* Card Canvas Thumbnail Representation */}
                <div
                  className={`w-full h-36 rounded-xl border flex flex-col items-center justify-center p-4 mb-4 relative overflow-hidden group-hover:scale-[1.01] transition-transform ${
                    isDark
                      ? "bg-[#09090b] border-white/[0.08]"
                      : "bg-[#f4f4f5] border-zinc-200"
                  }`}
                  style={{
                    backgroundImage: isDark
                      ? "radial-gradient(circle, rgba(255, 255, 255, 0.08) 1px, transparent 1px)"
                      : "radial-gradient(circle, rgba(0, 0, 0, 0.09) 1px, transparent 1px)",
                    backgroundSize: "14px 14px",
                  }}
                >
                  {/* Status Badge in corner */}
                  <div className="absolute top-2.5 right-2.5 z-10">
                    {project.isGenerated ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm">
                        <Sparkles className="w-2.5 h-2.5 text-emerald-500" />
                        Ready
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-sm">
                        <Bot className="w-2.5 h-2.5 text-amber-500" />
                        AI Draft
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-2 text-center pointer-events-none">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-500 border border-indigo-500/30 flex items-center justify-center">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[11px] font-semibold ${
                        isDark ? "text-zinc-300" : "text-zinc-700"
                      }`}
                    >
                      Visual Canvas
                    </span>
                    <span
                      className={`text-[10px] font-mono ${
                        isDark ? "text-zinc-500" : "text-zinc-400"
                      }`}
                    >
                      {getNodeCount(project.canvasData)} DOM Nodes
                    </span>
                  </div>

                  {/* Hover action overlay pill */}
                  <div className="absolute inset-0 bg-indigo-950/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                    <span
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg ${
                        isDark
                          ? "bg-white text-black"
                          : "bg-zinc-900 text-white"
                      }`}
                    >
                      <span>{project.isGenerated ? "Open Canvas" : "Setup with AI"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Project Info */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3
                    className={`font-bold text-base truncate group-hover:text-indigo-400 transition ${
                      isDark ? "text-white" : "text-zinc-900"
                    }`}
                  >
                    {project.name || "Untitled Project"}
                  </h3>
                  <button
                    onClick={(e) => handleDeleteProject(project.id, e)}
                    disabled={deletingId === project.id}
                    title="Delete project"
                    className={`p-1.5 rounded-lg transition ${
                      isDark
                        ? "text-zinc-500 hover:text-red-400 hover:bg-white/5"
                        : "text-zinc-400 hover:text-red-500 hover:bg-zinc-100"
                    }`}
                  >
                    {deletingId === project.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Prompt Excerpt if available */}
                {project.prompt ? (
                  <p
                    className={`text-xs line-clamp-2 italic mb-3 ${
                      isDark ? "text-zinc-400" : "text-zinc-600"
                    }`}
                  >
                    &ldquo;{project.prompt}&rdquo;
                  </p>
                ) : (
                  <p
                    className={`text-xs italic mb-3 ${
                      isDark ? "text-zinc-600" : "text-zinc-400"
                    }`}
                  >
                    No prompt specified &bull; Ready for design
                  </p>
                )}

                {/* Metadata Footer */}
                <div
                  className={`mt-auto pt-3 border-t flex items-center justify-between text-[11px] ${
                    isDark
                      ? "border-white/[0.06] text-zinc-500"
                      : "border-zinc-100 text-zinc-400"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {project.updatedAt
                        ? new Date(project.updatedAt).toLocaleDateString()
                        : "Recently"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Layers className="w-3 h-3 text-indigo-500" />
                    <span>Turso Edge DB</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
