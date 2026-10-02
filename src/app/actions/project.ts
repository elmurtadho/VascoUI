"use server";

import { client, db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Ensure table exists dynamically on first query
let tableInitialized = false;

async function ensureTableExists() {
  if (tableInitialized) return;
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        canvas_data TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);
    tableInitialized = true;
  } catch (err) {
    console.error("Error ensuring projects table exists:", err);
  }
}

export async function saveProjectAction(
  id: string,
  name: string,
  canvasData: string
) {
  try {
    await ensureTableExists();
    const now = new Date();

    await db
      .insert(projects)
      .values({
        id,
        name,
        canvasData,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: projects.id,
        set: {
          name,
          canvasData,
          updatedAt: now,
        },
      });

    return {
      success: true,
      message: "Project successfully persisted to Turso edge database",
    };
  } catch (error) {
    console.error("saveProjectAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save project",
    };
  }
}

export async function getProjectAction(id: string) {
  try {
    await ensureTableExists();
    const result = await db.select().from(projects).where(eq(projects.id, id));
    if (result.length === 0) {
      return { success: false, data: null };
    }
    return { success: true, data: result[0] };
  } catch (error) {
    console.error("getProjectAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get project",
    };
  }
}

export async function listProjectsAction() {
  try {
    await ensureTableExists();
    const all = await db.select().from(projects);
    return { success: true, data: all };
  } catch (error) {
    console.error("listProjectsAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to list projects",
    };
  }
}
