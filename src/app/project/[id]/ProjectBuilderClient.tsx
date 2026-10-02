"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Project } from "@/db/schema";
import { useBuilderStore } from "@/store/useBuilderStore";
import { saveProjectAction } from "@/app/actions/project";
import { BuilderLayout } from "@/components/builder/BuilderLayout";
import { Loader2 } from "lucide-react";

interface ProjectBuilderClientProps {
  project: Project;
}

export default function ProjectBuilderClient({ project }: ProjectBuilderClientProps) {
  const [hydrated, setHydrated] = useState(false);
  const { loadProject, setSaving, setProjectName } = useBuilderStore();
  const isSavingRef = useRef(false);

  useEffect(() => {
    try {
      if (project.canvasData) {
        const parsed = JSON.parse(project.canvasData);
        loadProject(parsed, project.id, project.name);
      } else {
        setProjectName(project.name);
      }
    } catch (err) {
      console.error("Failed to parse canvas data:", err);
      setProjectName(project.name);
    } finally {
      setHydrated(true);
    }
  }, [project.id, project.name, project.canvasData, loadProject, setProjectName]);

  const handleSave = useCallback(async () => {
    if (isSavingRef.current) return;
    isSavingRef.current = true;
    setSaving(true);
    try {
      const currentNodes = useBuilderStore.getState().nodes;
      const currentName = useBuilderStore.getState().projectName || project.name;
      const serialized = JSON.stringify(currentNodes);
      await saveProjectAction(project.id, currentName, serialized);
    } catch (error) {
      console.error("Failed to save project:", error);
    } finally {
      setSaving(false);
      isSavingRef.current = false;
    }
  }, [project.id, project.name, setSaving]);

  // Global Ctrl+S shortcut to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  if (!hydrated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-[#050505] text-zinc-100 gap-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <span className="text-sm font-medium text-zinc-400">Loading Vasco Canvas...</span>
      </div>
    );
  }

  return <BuilderLayout onSave={handleSave} />;
}
