import { z } from 'zod';

export const achievementSchema = z.object({
  id: z.string(),
  type: z.enum(['planet', 'constellation', 'rocket', 'star', 'galaxy', 'supernova']),
  name: z.string(),
  description: z.string(),
  condition: z.object({
    type: z.enum(['score', 'problems_solved', 'consecutive_correct', 'time_played']),
    threshold: z.number(),
    topic: z.string().optional(),
  }),
  unlockedAt: z.string().nullable(),
});

export type Achievement = z.infer<typeof achievementSchema>;

export const SPACE_ACHIEVEMENTS = [
  {
    id: 'first_planet',
    type: 'planet',
    name: 'First Planet Discovered',
    description: 'Complete your first 5 math problems correctly',
    condition: {
      type: 'problems_solved',
      threshold: 5,
    }
  },
  {
    id: 'constellation_explorer',
    type: 'constellation',
    name: 'Constellation Explorer',
    description: 'Achieve a streak of 10 correct answers',
    condition: {
      type: 'consecutive_correct',
      threshold: 10,
    }
  },
  {
    id: 'rocket_master',
    type: 'rocket',
    name: 'Rocket Master',
    description: 'Score 1000 points in total',
    condition: {
      type: 'score',
      threshold: 1000,
    }
  },
  {
    id: 'multiplication_star',
    type: 'star',
    name: 'Multiplication Star',
    description: 'Solve 20 multiplication problems correctly',
    condition: {
      type: 'problems_solved',
      threshold: 20,
      topic: 'multiplication'
    }
  },
  {
    id: 'division_galaxy',
    type: 'galaxy',
    name: 'Division Galaxy',
    description: 'Solve 20 division problems correctly',
    condition: {
      type: 'problems_solved',
      threshold: 20,
      topic: 'division'
    }
  },
  {
    id: 'math_supernova',
    type: 'supernova',
    name: 'Math Supernova',
    description: 'Complete 100 math problems across all topics',
    condition: {
      type: 'problems_solved',
      threshold: 100,
    }
  },
] as const;

export function checkAchievementUnlock(
  achievement: Achievement, 
  stats: {
    problemsSolved: number;
    consecutiveCorrect: number;
    score: number;
    topicStats: Record<string, number>;
  }
): boolean {
  const { condition } = achievement;
  
  switch (condition.type) {
    case 'problems_solved':
      if (condition.topic) {
        return (stats.topicStats[condition.topic] || 0) >= condition.threshold;
      }
      return stats.problemsSolved >= condition.threshold;
    
    case 'consecutive_correct':
      return stats.consecutiveCorrect >= condition.threshold;
    
    case 'score':
      return stats.score >= condition.threshold;
    
    default:
      return false;
  }
}
