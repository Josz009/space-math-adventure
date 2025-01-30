import { motion, AnimatePresence } from 'framer-motion';
import { SpaceAchievement } from './SpaceAchievement';
import { SPACE_ACHIEVEMENTS } from '@/lib/achievements';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

interface AchievementsPanelProps {
  unlockedAchievements: string[];
  stats: {
    problemsSolved: number;
    consecutiveCorrect: number;
    score: number;
    topicStats: Record<string, number>;
  };
}

export function AchievementsPanel({ unlockedAchievements, stats }: AchievementsPanelProps) {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Space Achievements</h2>
      <ScrollArea className="h-[500px] pr-4">
        <div className="grid gap-4">
          <AnimatePresence>
            {SPACE_ACHIEVEMENTS.map((achievement) => {
              const isUnlocked = unlockedAchievements.includes(achievement.id);

              // Calculate progress for achievements
              let progress = 0;
              if (!isUnlocked) {
                const { condition } = achievement;
                const currentValue = (() => {
                  switch (condition.type) {
                    case 'problems_solved':
                      return condition.topic 
                        ? (stats.topicStats[condition.topic] || 0)
                        : stats.problemsSolved;
                    case 'consecutive_correct':
                      return stats.consecutiveCorrect;
                    case 'score':
                      return stats.score;
                    default:
                      return 0;
                  }
                })();

                progress = Math.min(100, (currentValue / condition.threshold) * 100);
              }

              return (
                <motion.div
                  key={achievement.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <SpaceAchievement
                    type={achievement.type}
                    name={achievement.name}
                    description={achievement.description}
                    unlocked={isUnlocked}
                    progress={isUnlocked ? undefined : progress}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </Card>
  );
}