import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { AchievementsPanel } from '@/components/achievements/AchievementsPanel';
import { AnalyticsPanel } from '@/components/analytics/AnalyticsPanel';
import { Progress, Achievement } from '@db/schema';

export default function ParentDashboard() {
  const [, navigate] = useLocation();

  const { data: progress = [] } = useQuery<Progress[]>({
    queryKey: ['/api/progress/1'], // Hardcoded user ID for demo
  });

  const { data: achievements = [] } = useQuery<Achievement[]>({
    queryKey: ['/api/achievements/1'], // Hardcoded user ID for demo
  });

  // Calculate statistics for achievements panel
  const stats = {
    problemsSolved: progress.reduce((sum, p) => sum + (p.problemsSolved ?? 0), 0),
    consecutiveCorrect: Math.max(...progress.map(p => p.streakCount ?? 0)),
    score: progress.reduce((sum, p) => sum + (p.score ?? 0), 0),
    topicStats: progress.reduce((acc, p) => {
      const topic = p.gameMode;
      const solved = p.problemsSolved ?? 0;
      acc[topic] = (acc[topic] ?? 0) + solved;
      return acc;
    }, {} as Record<string, number>)
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button variant="outline" onClick={() => navigate("/")}>
            ← Back to Home
          </Button>
          <h1 className="text-3xl font-bold">Parent Dashboard</h1>
        </div>

        <div className="grid gap-8">
          {/* Analytics Section */}
          <AnalyticsPanel progress={progress} />

          {/* Achievements Section */}
          <div className="grid lg:grid-cols-2 gap-8">
            <AchievementsPanel 
              unlockedAchievements={achievements.map(a => a.type)}
              stats={stats}
            />
          </div>
        </div>
      </div>
    </div>
  );
}