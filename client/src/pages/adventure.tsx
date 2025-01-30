import { useState, useEffect } from 'react';
import { GameCanvas } from '@/components/game/GameCanvas';
import { MathProblem } from '@/components/game/MathProblem';
import { RewardBadge } from '@/components/game/RewardBadge';
import { TopicSelector } from '@/components/game/TopicSelector';
import { generateMathProblem, calculateDifficulty } from '@/lib/math';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

interface GameState {
  level: number;
  score: number;
  topic: string | null;
  grade: number | null;
}

export default function Adventure() {
  const [, navigate] = useLocation();
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    score: 0,
    topic: null,
    grade: null
  });
  const [problem, setProblem] = useState(generateMathProblem(1));
  const [performance, setPerformance] = useState({ correct: 0, total: 0 });
  const [showReward, setShowReward] = useState(false);
  const [showTopicSelector, setShowTopicSelector] = useState(true);

  useEffect(() => {
    const difficulty = calculateDifficulty(performance);
    if (gameState.topic) {
      setProblem(generateMathProblem(difficulty, gameState.topic));
    }
  }, [performance, gameState.topic]);

  const handleTopicSelect = (topic: string, grade: number) => {
    setGameState(prev => ({ ...prev, topic, grade }));
    setShowTopicSelector(false);
    // Generate first problem with the selected topic
    setProblem(generateMathProblem(1, topic));
  };

  const handleAnswer = (correct: boolean) => {
    setPerformance(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }));

    if (correct) {
      setGameState(prev => ({ ...prev, score: prev.score + 100 }));
      if (gameState.score > 0 && gameState.score % 500 === 0) {
        setGameState(prev => ({ ...prev, level: prev.level + 1 }));
        setShowReward(true);
      }
    }
  };

  if (!gameState.topic || !gameState.grade) {
    return (
      <AnimatePresence>
        {showTopicSelector && (
          <TopicSelector
            onSelect={handleTopicSelect}
            onClose={() => navigate("/")}
          />
        )}
      </AnimatePresence>
    );
  }

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
              Level: {gameState.level}
            </div>
            <div className="bg-white rounded-lg px-4 py-2">
              Score: {gameState.score}
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

        <AnimatePresence>
          {showReward && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            >
              <div className="bg-white p-8 rounded-lg text-center">
                <h2 className="text-2xl font-bold mb-4">Level Up!</h2>
                <RewardBadge
                  type="level"
                  description={`Reached Level ${gameState.level}`}
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
        </AnimatePresence>
      </motion.div>
    </div>
  );
}