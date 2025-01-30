import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  isParent: boolean("is_parent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  gameMode: text("game_mode").notNull(),
  level: integer("level").default(1),
  score: integer("score").default(0),
  correctAnswers: integer("correct_answers").default(0),
  totalAttempts: integer("total_attempts").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  type: text("type").notNull(),
  description: text("description").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

export const mathProblems = pgTable("math_problems", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  difficulty: integer("difficulty").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  options: text("options").array(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Progress = typeof progress.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type MathProblem = typeof mathProblems.$inferSelect;
