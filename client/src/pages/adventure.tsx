import { useState, useEffect } from 'react';
import { GameCanvas } from '@/components/game/GameCanvas';
import { MathProblem } from '@/components/game/MathProblem';
import { RewardBadge } from '@/components/game/RewardBadge';
import { generateMathProblem, calculateDifficulty } from '@/lib/math';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

export default function Adventure() {
  const [, navigate] = useLocation();
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [problem, setProblem] = useState(generateMathProblem(1));
  const [performance, setPerformance] = useState({ correct: 0, total: 0 });
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    const difficulty = calculateDifficulty(performance);
    setProblem(generateMathProblem(difficulty));
  }, [performance]);

  const handleAnswer = (correct: boolean) => {
    setPerformance(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }));

    if (correct) {
      setScore(prev => prev + 100);
      if (score > 0 && score % 500 === 0) {
        setLevel(prev => prev + 1);
        setShowReward(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-blue-900 p-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <Button variant="outline" onClick={() => navigate("/")}>
            ← Back to Home
          </Button>
          <div className="flex gap-4">
            <div className="bg-white rounded-lg px-4 py-2">
              Level: {level}
            </div>
            <div className="bg-white rounded-lg px-4 py-2">
              Score: {score}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <Progress value={(performance.correct / Math.max(1, performance.total)) * 100} />
        </div>

        <GameCanvas onAnswer={handleAnswer}>
          <MathProblem 
            problem={problem}
            onAnswer={handleAnswer}
          />
        </GameCanvas>

        {showReward && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          >
            <div className="bg-white p-8 rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-4">Level Up!</h2>
              <RewardBadge
                type="level"
                description={`Reached Level ${level}`}
                unlocked
              />
              <Button
                className="mt-4"
                onClick={() => setShowReward(false)}
              >
                Continue
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
