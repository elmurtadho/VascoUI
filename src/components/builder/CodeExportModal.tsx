"use client";

import React, { useState } from "react";
import { useBuilderStore } from "@/lib/store/useBuilderStore";
import { generateReactCode, generateHtmlCode } from "@/lib/builder/utils";
import { X, Copy, Check, Download, Upload, Code2, FileCode, Braces } from "lucide-react";

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { nodes, projectName, loadProject } = useBuilderStore();
  const [activeTab, setActiveTab] = useState<"react" | "html" | "json" | "import">("react");
  const [copied, setCopied] = useState(false);
  const [importJsonText, setImportJsonText] = useState("");
  const [importError, setImportError] = useState<string | null>(null);

  if (!isOpen) return null;

  const reactCode = generateReactCode(nodes);
  const htmlCode = generateHtmlCode(nodes);
  const jsonCode = JSON.stringify(nodes, null, 2);

  const getCurrentCode = () => {
    switch (activeTab) {
      case "react":
        return reactCode;
      case "html":
        return htmlCode;
      case "json":
        return jsonCode;
      default:
        return "";
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getCurrentCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    const code = getCurrentCode();
    const ext = activeTab === "react" ? "tsx" : activeTab === "html" ? "html" : "json";
    const mime =
      activeTab === "react"
        ? "text/typescript"
        : activeTab === "html"
        ? "text/html"
        : "application/json";

    const blob = new Blob([code], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${projectName.toLowerCase().replace(/\s+/g, "-") || "project"}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      if (!Array.isArray(parsed)) {
        throw new Error("Invalid format: Root must be an array of nodes.");
      }
      loadProject(parsed);
      onClose();
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Invalid JSON");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        setImportJsonText(content);
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          loadProject(parsed);
          onClose();
        } else {
          setImportError("JSON must contain an array of BuilderNodes.");
        }
      } catch (err) {
        setImportError(err instanceof Error ? err.message : "Error reading file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="flex flex-col w-full max-w-3xl max-h-[85vh] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Export & Import Studio Code
              </h3>
              <p className="text-xs text-zinc-400">
                Generate clean code or import existing canvas project data
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeTab !== "import" && (
              <>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white transition"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Format Selector Tabs */}
        <div className="flex items-center px-6 pt-3 border-b border-zinc-800/80 bg-zinc-950/40 gap-2">
          <button
            onClick={() => setActiveTab("react")}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 text-xs font-medium transition ${
              activeTab === "react"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>React (Next.js)</span>
          </button>
          <button
            onClick={() => setActiveTab("html")}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 text-xs font-medium transition ${
              activeTab === "html"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>HTML & CSS</span>
          </button>
          <button
            onClick={() => setActiveTab("json")}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 text-xs font-medium transition ${
              activeTab === "json"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Braces className="w-3.5 h-3.5" />
            <span>JSON State</span>
          </button>
          <button
            onClick={() => setActiveTab("import")}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 text-xs font-medium transition ${
              activeTab === "import"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import JSON</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 bg-zinc-950 font-mono text-xs text-zinc-300 leading-relaxed select-text">
          {activeTab === "import" ? (
            <div className="flex flex-col gap-3 font-sans">
              <p className="text-xs text-zinc-400">
                Paste JSON tree data or upload a `.json` backup file to restore onto the canvas:
              </p>

              <textarea
                rows={10}
                value={importJsonText}
                onChange={(e) => {
                  setImportJsonText(e.target.value);
                  setImportError(null);
                }}
                placeholder="[ { id: '...', type: 'section', ... } ]"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 font-mono text-xs text-white placeholder-zinc-600 focus:border-indigo-500 outline-none"
              />

              {importError && (
                <div className="p-2.5 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-xs">
                  {importError}
                </div>
              )}

              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium cursor-pointer transition">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload .json File</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={handleImport}
                  disabled={!importJsonText.trim()}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold transition"
                >
                  Load to Canvas
                </button>
              </div>
            </div>
          ) : (
            <pre className="whitespace-pre">
              <code>{getCurrentCode()}</code>
            </pre>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-zinc-800 bg-zinc-950/60 text-xs text-zinc-500">
          <span>{nodes.length} root elements • Production-grade export</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg text-zinc-400 hover:text-zinc-200 text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
