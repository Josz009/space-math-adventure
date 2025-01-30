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
    try {
      const userProgress = await db.query.progress.findMany({
        where: eq(progress.userId, parseInt(req.params.userId)),
        orderBy: (progress, { desc }) => [desc(progress.updatedAt)],
      });
      res.json(userProgress);
    } catch (error) {
      console.error('Error fetching progress:', error);
      res.status(500).json({ error: 'Failed to fetch progress data' });
    }
  });

  // Update progress
  app.post("/api/progress", async (req, res) => {
    try {
      const { 
        userId, 
        gameMode, 
        score, 
        correctAnswers, 
        totalAttempts,
        averageResponseTime,
        problemsSolved,
        streakCount,
        lastProblemType,
        topicPerformance,
        errorPatterns,
      } = req.body;

      const result = await db
        .insert(progress)
        .values({
          userId,
          gameMode,
          score: score ?? 0,
          correctAnswers: correctAnswers ?? 0,
          totalAttempts: totalAttempts ?? 0,
          averageResponseTime: averageResponseTime ?? null,
          problemsSolved: problemsSolved ?? 0,
          streakCount: streakCount ?? 0,
          lastProblemType: lastProblemType ?? null,
          topicPerformance: topicPerformance ?? null,
          errorPatterns: errorPatterns ?? null,
          difficultyLevel: 1, // Default starting level
        })
        .returning();

      res.json(result[0]);
    } catch (error) {
      console.error('Error updating progress:', error);
      res.status(500).json({ error: 'Failed to update progress' });
    }
  });

  // Get achievements
  app.get("/api/achievements/:userId", async (req, res) => {
    try {
      const userAchievements = await db.query.achievements.findMany({
        where: eq(achievements.userId, parseInt(req.params.userId)),
      });
      res.json(userAchievements);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      res.status(500).json({ error: 'Failed to fetch achievements' });
    }
  });

  // Unlock achievement
  app.post("/api/achievements", async (req, res) => {
    try {
      const { userId, type, description } = req.body;

      const result = await db
        .insert(achievements)
        .values({ userId, type, description })
        .returning();

      res.json(result[0]);
    } catch (error) {
      console.error('Error unlocking achievement:', error);
      res.status(500).json({ error: 'Failed to unlock achievement' });
    }
  });

  // Get math problems
  app.get("/api/problems", async (req, res) => {
    try {
      const { difficulty } = req.query;
      const problems = await db.query.mathProblems.findMany({
        where: difficulty ? eq(mathProblems.difficulty, parseInt(difficulty as string)) : undefined,
      });
      res.json(problems);
    } catch (error) {
      console.error('Error fetching problems:', error);
      res.status(500).json({ error: 'Failed to fetch problems' });
    }
  });

  return httpServer;
}