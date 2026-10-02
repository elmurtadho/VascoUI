import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(), // Unique project identifier
  userId: text("user_id").notNull(), // Clerk User ID
  name: text("name").notNull(),
  prompt: text("prompt"), // Stored AI prompt instruction
  isGenerated: integer("is_generated", { mode: "boolean" })
    .notNull()
    .default(false), // Tracks if AI generation phase has completed
  canvasData: text("canvas_data").notNull(), // Normalized JSON node tree (Record<string, BuilderNode>)
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
