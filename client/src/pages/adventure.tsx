import { useState, useEffect, useCallback } from 'react';
import { GameCanvas } from '@/components/game/GameCanvas';
import { MathProblem } from '@/components/game/MathProblem';
import { RewardBadge } from '@/components/game/RewardBadge';
import { TopicSelector } from '@/components/game/TopicSelector';
import { generateMathProblem, calculateDifficulty } from '@/lib/math';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

type GamePhase = 'QUESTIONS' | 'DODGING' | 'NEW_WORLD';

interface GameState {
  level: number;
  score: number;
  topic: string | null;
  grade: number | null;
  correctAnswers: number;
  totalCorrectAnswers: number;
  wrongAnswers: number;
}

export default function Adventure() {
  const [, navigate] = useLocation();
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    score: 0,
    topic: null,
    grade: null,
    correctAnswers: 0,
    totalCorrectAnswers: 0,
    wrongAnswers: 0
  });
  const [gamePhase, setGamePhase] = useState<GamePhase>('QUESTIONS');
  const [problem, setProblem] = useState(generateMathProblem(1));
  const [performance, setPerformance] = useState({ correct: 0, total: 0 });
  const [showReward, setShowReward] = useState(false);
  const [showTopicSelector, setShowTopicSelector] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const difficulty = calculateDifficulty(performance);
    if (gameState.topic && gamePhase === 'QUESTIONS') {
      setProblem(generateMathProblem(difficulty, gameState.topic as any));
    }
  }, [performance, gameState.topic, gamePhase]);

  const handleTopicSelect = (topic: string, grade: number) => {
    setGameState(prev => ({ ...prev, topic, grade }));
    setShowTopicSelector(false);
    setProblem(generateMathProblem(1, topic as any));
    setShowInstructions(true);
  };

  const handleAnswer = useCallback((correct: boolean) => {
    setPerformance(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }));

    if (correct) {
      setGameState(prev => {
        const newCorrectAnswers = prev.correctAnswers + 1;
        const newTotalCorrectAnswers = prev.totalCorrectAnswers + 1;
        const newScore = prev.score + 100;

        // After 5 correct answers, switch to dodging phase
        if (newCorrectAnswers === 5) {
          setTimeout(() => {
            setGamePhase('DODGING');
            setShowInstructions(true);
          }, 1000);
        }

        // After 15 total correct answers, show new world
        if (newTotalCorrectAnswers === 15) {
          setTimeout(() => {
            setGamePhase('NEW_WORLD');
            setShowReward(true);
          }, 1000);
        }

        return {
          ...prev,
          score: newScore,
          correctAnswers: newCorrectAnswers % 5, // Reset after 5
          totalCorrectAnswers: newTotalCorrectAnswers
        };
      });
    } else {
      setGameState(prev => ({
        ...prev,
        wrongAnswers: prev.wrongAnswers + 1
      }));
    }
  }, []);

  const handleDodgeComplete = useCallback((survived: boolean) => {
    if (survived) {
      setGamePhase('QUESTIONS');
      setGameState(prev => ({
        ...prev,
        level: prev.level + 1,
        score: prev.score + 500,
        wrongAnswers: 0 // Reset wrong answers counter
      }));
    } else {
      // If hit by asteroid, reset current progress but keep total
      setGameState(prev => ({
        ...prev,
        correctAnswers: 0,
        wrongAnswers: prev.wrongAnswers + 1
      }));
      setGamePhase('QUESTIONS');
    }
    setShowInstructions(true);
  }, []);

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
            {gamePhase === 'QUESTIONS' && (
              <div className="bg-white rounded-lg px-4 py-2">
                Progress: {gameState.correctAnswers}/5
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <Progress 
            value={(gameState.correctAnswers / 5) * 100} 
            className="h-2 bg-purple-200"
          />
        </div>

        <GameCanvas 
          onAnswer={handleAnswer} 
          gamePhase={gamePhase}
          onDodgeComplete={handleDodgeComplete}
          wrongAnswers={gameState.wrongAnswers}
          speed={Math.min(2, 1 + (gameState.totalCorrectAnswers / 10))}
        >
          {gamePhase === 'QUESTIONS' && (
            <MathProblem 
              problem={problem}
              onAnswer={handleAnswer}
            />
          )}
        </GameCanvas>

        <AnimatePresence>
          {showInstructions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 p-6 rounded-lg shadow-xl max-w-md text-center"
            >
              {gamePhase === 'QUESTIONS' ? (
                <>
                  <h3 className="text-xl font-bold mb-2">Answer Questions!</h3>
                  <p className="text-gray-700">
                    Get 5 correct answers to power up your spaceship. 
                    Each wrong answer will make the asteroids bigger!
                  </p>
                </>
              ) : gamePhase === 'DODGING' ? (
                <>
                  <h3 className="text-xl font-bold mb-2">Dodge Asteroids!</h3>
                  <p className="text-gray-700">
                    Use arrow keys to move your spaceship. 
                    Survive the asteroid field to continue!
                  </p>
                </>
              ) : null}
              <Button 
                className="mt-4"
                onClick={() => setShowInstructions(false)}
              >
                Got it!
              </Button>
            </motion.div>
          )}

          {showReward && gamePhase === 'NEW_WORLD' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            >
              <div className="bg-white p-8 rounded-lg text-center">
                <h2 className="text-2xl font-bold mb-4">New World Unlocked! 🌟</h2>
                <RewardBadge
                  type="level"
                  description={`Completed World ${gameState.level}`}
                  unlocked
                />
                <Button
                  className="mt-4"
                  onClick={() => {
                    setShowReward(false);
                    setGamePhase('QUESTIONS');
                    setShowInstructions(true);
                  }}
                >
                  Continue to Next World
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}