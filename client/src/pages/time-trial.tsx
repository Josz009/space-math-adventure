import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Timer } from '@/components/game/Timer';
import { MathProblem } from '@/components/game/MathProblem';
import { generateMathProblem } from '@/lib/math';
import { TopicSelector } from '@/components/game/TopicSelector';

interface GameState {
  score: number;
  problemsSolved: number;
  topic: string | null;
  grade: number | null;
}

const TIME_LIMIT = 60; // 60 seconds for the time trial

export default function TimeTrial() {
  const [, navigate] = useLocation();
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    problemsSolved: 0,
    topic: null,
    grade: null,
  });
  const [problem, setProblem] = useState(generateMathProblem(1));
  const [showTopicSelector, setShowTopicSelector] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleTopicSelect = (topic: string, grade: number) => {
    setGameState(prev => ({ ...prev, topic, grade }));
    setShowTopicSelector(false);
    setProblem(generateMathProblem(1, topic as any));
    setIsPlaying(true);
  };

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      setGameState(prev => ({
        ...prev,
        score: prev.score + 100,
        problemsSolved: prev.problemsSolved + 1,
      }));
      setProblem(generateMathProblem(1, gameState.topic as any));
    }
  };

  const handleTimeUp = () => {
    setIsPlaying(false);
    setShowResults(true);
  };

  const handlePlayAgain = () => {
    setGameState(prev => ({
      ...prev,
      score: 0,
      problemsSolved: 0,
    }));
    setProblem(generateMathProblem(1, gameState.topic as any));
    setShowResults(false);
    setIsPlaying(true);
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
    <div className="min-h-screen bg-gradient-to-b from-indigo-600 to-purple-600 p-8">
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
              Score: {gameState.score}
            </div>
            <div className="bg-white rounded-lg px-4 py-2">
              Problems: {gameState.problemsSolved}
            </div>
          </div>
        </div>

        {isPlaying && <Timer duration={TIME_LIMIT} onTimeUp={handleTimeUp} />}

        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="game"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <CardContent className="p-8">
                  <MathProblem
                    problem={problem}
                    onAnswer={handleAnswer}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ) : showResults ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-4xl font-bold mb-4">Time's Up! 🎮</h2>
                  <div className="space-y-4 mb-8">
                    <p className="text-2xl">Final Score: {gameState.score}</p>
                    <p className="text-2xl">Problems Solved: {gameState.problemsSolved}</p>
                    <p className="text-xl">
                      Average Time per Problem: {(TIME_LIMIT / Math.max(1, gameState.problemsSolved)).toFixed(1)} seconds
                    </p>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <Button onClick={handlePlayAgain}>
                      Play Again
                    </Button>
                    <Button variant="outline" onClick={() => navigate("/")}>
                      Back to Menu
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
