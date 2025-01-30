import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export default function ParentDashboard() {
  const [, navigate] = useLocation();
  
  const { data: progress } = useQuery({
    queryKey: ['/api/progress/1'], // Hardcoded user ID for demo
  });

  const { data: achievements } = useQuery({
    queryKey: ['/api/achievements/1'], // Hardcoded user ID for demo
  });

  const progressData = progress?.map((p: any) => ({
    date: new Date(p.updatedAt).toLocaleDateString(),
    score: p.score,
    accuracy: (p.correctAnswers / p.totalAttempts) * 100,
  }));

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button variant="outline" onClick={() => navigate("/")}>
            ← Back to Home
          </Button>
          <h1 className="text-3xl font-bold">Parent Dashboard</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
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

          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements?.map((achievement: any) => (
                  <div 
                    key={achievement.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                      {achievement.type === 'level' && '⭐'}
                      {achievement.type === 'streak' && '🔥'}
                      {achievement.type === 'accuracy' && '🎯'}
                    </div>
                    <div>
                      <h3 className="font-bold">{achievement.type}</h3>
                      <p className="text-sm text-gray-600">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
