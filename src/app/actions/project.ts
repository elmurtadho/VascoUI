"use server";

import { db, client } from "@/db";
import { projects, Project } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { initialNormalizedNodes } from "@/store/useBuilderStore";

let tableInitialized = false;

async function ensureTableExists() {
  if (tableInitialized) return;
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        prompt TEXT,
        is_generated INTEGER NOT NULL DEFAULT 0,
        canvas_data TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);
    try {
      await client.execute(`ALTER TABLE projects ADD COLUMN prompt TEXT;`);
    } catch {
      // Column already exists
    }
    try {
      await client.execute(`ALTER TABLE projects ADD COLUMN is_generated INTEGER NOT NULL DEFAULT 0;`);
    } catch {
      // Column already exists
    }
    tableInitialized = true;
  } catch (err) {
    console.error("Error ensuring projects table exists:", err);
  }
}

export async function createProjectAction(
  name: string = "New AI Project",
  prompt?: string
) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  await ensureTableExists();

  const id = "proj_" + Math.random().toString(36).substring(2, 10);
  const now = new Date();

  await db.insert(projects).values({
    id,
    userId,
    name,
    prompt: prompt || null,
    isGenerated: false,
    canvasData: JSON.stringify(initialNormalizedNodes),
    createdAt: now,
    updatedAt: now,
  });

  revalidatePath("/dashboard");
  return { success: true, id };
}

export async function saveProjectAction(
  id: string,
  name: string,
  canvasData: string,
  isGenerated?: boolean,
  prompt?: string
) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  await ensureTableExists();
  const now = new Date();

  try {
    const existing = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userId)));

    const updateFields: Record<string, unknown> = {
      name,
      canvasData,
      updatedAt: now,
    };

    if (typeof isGenerated === "boolean") {
      updateFields.isGenerated = isGenerated;
    }
    if (typeof prompt === "string") {
      updateFields.prompt = prompt;
    }

    if (existing.length === 0) {
      // Insert new project if it doesn't exist yet
      await db.insert(projects).values({
        id,
        userId,
        name,
        prompt: prompt || null,
        isGenerated: isGenerated ?? false,
        canvasData,
        createdAt: now,
        updatedAt: now,
      });
    } else {
      // Update existing
      await db
        .update(projects)
        .set(updateFields)
        .where(and(eq(projects.id, id), eq(projects.userId, userId)));
    }

    revalidatePath(`/project/${id}`);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("saveProjectAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save project",
    };
  }
}

export async function updateProjectAiAction(
  id: string,
  prompt: string,
  canvasData: string
) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  await ensureTableExists();
  const now = new Date();

  try {
    await db
      .update(projects)
      .set({
        prompt,
        isGenerated: true,
        canvasData,
        updatedAt: now,
      })
      .where(and(eq(projects.id, id), eq(projects.userId, userId)));

    revalidatePath(`/project/${id}`);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("updateProjectAiAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update project",
    };
  }
}

export async function deleteProjectAction(id: string) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  await ensureTableExists();

  try {
    await db
      .delete(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userId)));

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("deleteProjectAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete project",
    };
  }
}

export async function getUserProjectsAction(): Promise<{
  success: boolean;
  data: Project[];
  error?: string;
}> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, data: [], error: "Unauthorized" };
  }

  await ensureTableExists();

  try {
    const userProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.updatedAt));

    return { success: true, data: userProjects };
  } catch (error) {
    console.error("getUserProjectsAction error:", error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : "Failed to fetch projects",
    };
  }
}

export async function getProjectByIdAction(id: string): Promise<{
  success: boolean;
  data: Project | null;
  error?: string;
}> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, data: null, error: "Unauthorized" };
  }

  await ensureTableExists();

  try {
    const result = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userId)));

    if (result.length === 0) {
      return { success: false, data: null, error: "Project not found" };
    }

    return { success: true, data: result[0] };
  } catch (error) {
    console.error("getProjectByIdAction error:", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch project",
    };
  }
}
