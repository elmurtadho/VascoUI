"use client";

import React, { useEffect, useState, useCallback } from "react";
import { BuilderLayout } from "@/components/builder/BuilderLayout";
import { useBuilderStore } from "@/lib/store/useBuilderStore";
import { getProjectAction, saveProjectAction } from "./actions/project";
import { Loader2 } from "lucide-react";

export default function BuilderPage() {
  const {
    projectId,
    projectName,
    nodes,
    loadProject,
    setSaving,
    undo,
    redo,
    deleteNode,
    selectedNodeId,
  } = useBuilderStore();

  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Keyboard shortcuts listener (Undo, Redo, Delete)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        redo();
      } else if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedNodeId
      ) {
        e.preventDefault();
        deleteNode(selectedNodeId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, deleteNode, selectedNodeId]);

  // Load project from Turso database on initial mount
  useEffect(() => {
    async function initProject() {
      try {
        const res = await getProjectAction(projectId);
        if (res.success && res.data) {
          const parsedNodes = JSON.parse(res.data.canvasData);
          if (Array.isArray(parsedNodes) && parsedNodes.length > 0) {
            loadProject(parsedNodes, res.data.id, res.data.name);
          }
        }
      } catch (err) {
        console.warn("Could not fetch remote project, using default template:", err);
      } finally {
        setIsLoading(false);
      }
    }

    initProject();
  }, [projectId, loadProject]);

  // Handle saving to Turso Edge database
  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const canvasJson = JSON.stringify(nodes);
      const res = await saveProjectAction(projectId, projectName, canvasJson);
      if (res.success) {
        showToast("Project saved to Turso Edge Database!");
      } else {
        showToast(`Save failed: ${res.error || "Unknown error"}`);
      }
    } catch (err) {
      showToast(
        `Save failed: ${err instanceof Error ? err.message : "Error connecting to Turso"}`
      );
    } finally {
      setSaving(false);
    }
  }, [nodes, projectId, projectName, setSaving]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-zinc-950 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
        <span className="text-xs font-medium text-zinc-400">
          Loading Vasco Sleek Builder...
        </span>
      </div>
    );
  }

  return (
    <>
      <BuilderLayout onSave={handleSave} />

      {/* Floating Status Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700/80 text-white text-xs font-medium shadow-2xl animate-in slide-in-from-bottom-3 fade-in duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}
