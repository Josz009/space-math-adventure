import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import { Progress } from '@db/schema';

interface AnalyticsPanelProps {
  progress: Progress[];
}

export function AnalyticsPanel({ progress }: AnalyticsPanelProps) {
  // Calculate performance trends with null checks
  const performanceTrends = progress.map(p => ({
    date: new Date(p.updatedAt!).toLocaleDateString(),
    accuracy: p.correctAnswers && p.totalAttempts 
      ? (p.correctAnswers / p.totalAttempts) * 100 
      : 0,
    averageTime: p.averageResponseTime ? p.averageResponseTime / 1000 : 0, // Convert to seconds
    score: p.score || 0,
  }));

  // Calculate topic performance with null checks
  const topicPerformance = progress.reduce((acc: Record<string, { correct: number, total: number }>, p) => {
    const performance = p.topicPerformance as Record<string, { correct: number, total: number }> | null;
    if (performance) {
      Object.entries(performance).forEach(([topic, stats]) => {
        if (!acc[topic]) {
          acc[topic] = { correct: 0, total: 0 };
        }
        acc[topic].correct += stats.correct;
        acc[topic].total += stats.total;
      });
    }
    return acc;
  }, {});

  const topicData = Object.entries(topicPerformance).map(([topic, stats]) => ({
    topic,
    accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
  }));

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                stroke="#8884d8" 
                name="Accuracy %" 
              />
              <Line 
                type="monotone" 
                dataKey="averageTime" 
                stroke="#82ca9d" 
                name="Avg. Time (s)" 
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#ffc658" 
                name="Score" 
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Topic Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={topicData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="topic" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Accuracy"
                dataKey="accuracy"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Difficulty Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#8884d8" name="Score" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}