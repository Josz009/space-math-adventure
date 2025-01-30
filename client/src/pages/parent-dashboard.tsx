import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { AchievementsPanel } from '@/components/achievements/AchievementsPanel';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Progress, Achievement } from '@db/schema';

interface ProgressData {
  date: string;
  score: number;
  accuracy: number;
}

export default function ParentDashboard() {
  const [, navigate] = useLocation();

  const { data: progress = [] } = useQuery<Progress[]>({
    queryKey: ['/api/progress/1'], // Hardcoded user ID for demo
  });

  const { data: achievements = [] } = useQuery<Achievement[]>({
    queryKey: ['/api/achievements/1'], // Hardcoded user ID for demo
  });

  const progressData: ProgressData[] = progress.map(p => ({
    date: new Date(p.updatedAt!).toLocaleDateString(),
    score: p.score,
    accuracy: (p.correctAnswers / Math.max(1, p.totalAttempts)) * 100,
  }));

  // Calculate statistics for achievements panel
  const stats = {
    problemsSolved: progress.reduce((sum, p) => sum + (p.problemsSolved || 0), 0),
    consecutiveCorrect: Math.max(...progress.map(p => p.correctAnswers || 0)),
    score: progress.reduce((sum, p) => sum + p.score, 0),
    topicStats: progress.reduce((acc, p) => {
      const topic = p.gameMode;
      acc[topic] = (acc[topic] || 0) + (p.problemsSolved || 0);
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

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Progress Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart width={500} height={300} data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#8884d8" 
                  name="Score" 
                />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#82ca9d" 
                  name="Accuracy %" 
                />
              </LineChart>
            </CardContent>
          </Card>

          <AchievementsPanel 
            unlockedAchievements={achievements.map(a => a.type)}
            stats={stats}
          />
        </div>
      </div>
    </div>
  );
}