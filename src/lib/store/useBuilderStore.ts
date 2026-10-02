import { create } from "zustand";
import { BuilderNode, Device, NodeCustomProps, NodeType } from "@/types/builder";
import {
  cloneNode,
  createDefaultNode,
  initialTemplateNodes,
  insertNodeIntoTree,
  removeNodeFromTree,
  updateNodeInTree,
} from "@/lib/builder/utils";

const MAX_HISTORY = 30;

interface BuilderState {
  // Canvas State
  nodes: BuilderNode[];
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  currentDevice: Device;
  previewMode: boolean;

  // Project Info
  projectId: string;
  projectName: string;
  isSaving: boolean;
  lastSavedAt: Date | null;

  // History for Undo/Redo
  history: BuilderNode[][];
  future: BuilderNode[][];

  // Actions
  setDevice: (device: Device) => void;
  selectNode: (id: string | null) => void;
  setHoveredNode: (id: string | null) => void;
  setPreviewMode: (preview: boolean) => void;
  setProjectName: (name: string) => void;
  setSaving: (saving: boolean) => void;
  setLastSavedAt: (date: Date) => void;

  // Tree Manipulation
  addNode: (type: NodeType, parentId?: string | null, index?: number) => void;
  insertRawNode: (node: BuilderNode, parentId?: string | null, index?: number) => void;
  moveNode: (nodeId: string, targetParentId: string | null, targetIndex?: number) => void;
  updateNodeProps: (id: string, props: Partial<NodeCustomProps>) => void;
  updateNodeStyles: (
    id: string,
    newStyles: Partial<React.CSSProperties>,
    targetDevice?: Device
  ) => void;
  deleteNode: (id: string) => void;
  duplicateNode: (id: string) => void;

  // History actions
  undo: () => void;
  redo: () => void;

  // Storage / Project load
  loadProject: (nodes: BuilderNode[], id?: string, name?: string) => void;
  resetCanvas: () => void;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  nodes: initialTemplateNodes,
  selectedNodeId: null,
  hoveredNodeId: null,
  currentDevice: "desktop",
  previewMode: false,

  projectId: "default_project",
  projectName: "Untitled Page",
  isSaving: false,
  lastSavedAt: null,

  history: [],
  future: [],

  setDevice: (device) => set({ currentDevice: device }),
  selectNode: (id) => set({ selectedNodeId: id }),
  setHoveredNode: (id) => set({ hoveredNodeId: id }),
  setPreviewMode: (preview) =>
    set({ previewMode: preview, selectedNodeId: preview ? null : get().selectedNodeId }),
  setProjectName: (name) => set({ projectName: name }),
  setSaving: (saving) => set({ isSaving: saving }),
  setLastSavedAt: (date) => set({ lastSavedAt: date }),

  addNode: (type, parentId = null, index) => {
    const { nodes, history } = get();
    const newNode = createDefaultNode(type);
    const updatedNodes = insertNodeIntoTree(nodes, newNode, parentId, index);

    set({
      nodes: updatedNodes,
      selectedNodeId: newNode.id,
      history: [...history.slice(-MAX_HISTORY), nodes],
      future: [],
    });
  },

  insertRawNode: (newNode, parentId = null, index) => {
    const { nodes, history } = get();
    const updatedNodes = insertNodeIntoTree(nodes, newNode, parentId, index);

    set({
      nodes: updatedNodes,
      selectedNodeId: newNode.id,
      history: [...history.slice(-MAX_HISTORY), nodes],
      future: [],
    });
  },

  moveNode: (nodeId, targetParentId = null, targetIndex) => {
    const { nodes, history } = get();
    if (nodeId === targetParentId) return; // Cannot drop into self

    // Remove from old position
    const { newNodes, removed } = removeNodeFromTree(nodes, nodeId);
    if (!removed) return;

    // Insert into target position
    const finalNodes = insertNodeIntoTree(newNodes, removed, targetParentId, targetIndex);

    set({
      nodes: finalNodes,
      selectedNodeId: nodeId,
      history: [...history.slice(-MAX_HISTORY), nodes],
      future: [],
    });
  },

  updateNodeProps: (id, newProps) => {
    const { nodes, history } = get();
    const updatedNodes = updateNodeInTree(nodes, id, (node) => ({
      ...node,
      props: { ...node.props, ...newProps },
    }));

    set({
      nodes: updatedNodes,
      history: [...history.slice(-MAX_HISTORY), nodes],
      future: [],
    });
  },

  updateNodeStyles: (id, newStyles, targetDevice) => {
    const { nodes, currentDevice, history } = get();
    const device = targetDevice || currentDevice;

    const updatedNodes = updateNodeInTree(nodes, id, (node) => {
      const existingDeviceStyles = node.styles[device] || {};
      return {
        ...node,
        styles: {
          ...node.styles,
          [device]: {
            ...existingDeviceStyles,
            ...newStyles,
          },
        },
      };
    });

    set({
      nodes: updatedNodes,
      history: [...history.slice(-MAX_HISTORY), nodes],
      future: [],
    });
  },

  deleteNode: (id) => {
    const { nodes, selectedNodeId, history } = get();
    const { newNodes } = removeNodeFromTree(nodes, id);

    set({
      nodes: newNodes,
      selectedNodeId: selectedNodeId === id ? null : selectedNodeId,
      history: [...history.slice(-MAX_HISTORY), nodes],
      future: [],
    });
  },

  duplicateNode: (id) => {
    const { nodes, history } = get();
    let clonedItem: BuilderNode | null = null;

    function findAndClone(list: BuilderNode[]): BuilderNode[] {
      const res: BuilderNode[] = [];
      for (const item of list) {
        res.push(item);
        if (item.id === id) {
          clonedItem = cloneNode(item, item.parentId || null);
          res.push(clonedItem);
        } else if (item.children && item.children.length > 0) {
          item.children = findAndClone(item.children);
        }
      }
      return res;
    }

    const updatedNodes = findAndClone(JSON.parse(JSON.stringify(nodes)));

    set({
      nodes: updatedNodes,
      selectedNodeId: clonedItem ? (clonedItem as BuilderNode).id : id,
      history: [...history.slice(-MAX_HISTORY), nodes],
      future: [],
    });
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

  loadProject: (loadedNodes, id, name) => {
    set({
      nodes: loadedNodes,
      selectedNodeId: null,
      history: [],
      future: [],
      ...(id ? { projectId: id } : {}),
      ...(name ? { projectName: name } : {}),
    });
  },

  resetCanvas: () => {
    const { nodes, history } = get();
    set({
      nodes: [],
      selectedNodeId: null,
      history: [...history.slice(-MAX_HISTORY), nodes],
      future: [],
    });
  },
}));
