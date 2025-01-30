import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { users, progress, achievements, mathProblems } from "@db/schema";
import { eq } from "drizzle-orm";
import { MultiplayerServer } from "./websocket";

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  // Initialize WebSocket server for multiplayer
  new MultiplayerServer(httpServer);

  // Get user progress
  app.get("/api/progress/:userId", async (req, res) => {
    const userProgress = await db.query.progress.findMany({
      where: eq(progress.userId, parseInt(req.params.userId)),
    });
    res.json(userProgress);
  });

  // Update progress
  app.post("/api/progress", async (req, res) => {
    const { userId, gameMode, score, correctAnswers, totalAttempts } = req.body;

    const result = await db
      .insert(progress)
      .values({
        userId,
        gameMode,
        score,
        correctAnswers,
        totalAttempts,
      })
      .returning();

    res.json(result[0]);
  });

  // Get achievements
  app.get("/api/achievements/:userId", async (req, res) => {
    const userAchievements = await db.query.achievements.findMany({
      where: eq(achievements.userId, parseInt(req.params.userId)),
    });
    res.json(userAchievements);
  });

  // Unlock achievement
  app.post("/api/achievements", async (req, res) => {
    const { userId, type, description } = req.body;

    const result = await db
      .insert(achievements)
      .values({ userId, type, description })
      .returning();

    res.json(result[0]);
  });

  // Get math problems
  app.get("/api/problems", async (req, res) => {
    const { difficulty } = req.query;
    const problems = await db.query.mathProblems.findMany({
      where: difficulty ? eq(mathProblems.difficulty, parseInt(difficulty as string)) : undefined,
    });
    res.json(problems);
  });

  return httpServer;
}