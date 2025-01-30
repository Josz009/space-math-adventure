import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { TopicSelector } from '@/components/game/TopicSelector';
import { generatePuzzle, type GeneratedPuzzle } from '@/lib/puzzleGenerator';

interface PuzzleState {
  topic: string | null;
  grade: number | null;
  score: number;
  puzzlesSolved: number;
}

export default function Puzzle() {
  const [, navigate] = useLocation();
  const [gameState, setGameState] = useState<PuzzleState>({
    topic: null,
    grade: null,
    score: 0,
    puzzlesSolved: 0
  });

  const [currentPuzzle, setCurrentPuzzle] = useState<GeneratedPuzzle | null>(null);
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showTopicSelector, setShowTopicSelector] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  const generateNewPuzzle = useCallback((topic: string, grade: number) => {
    try {
      const newPuzzle = generatePuzzle(topic, grade);
      setCurrentPuzzle(newPuzzle);
    } catch (error) {
      console.error('Error generating puzzle:', error);
      // Fallback to a simple addition puzzle if generation fails
      setCurrentPuzzle({
        id: Date.now().toString(),
        type: topic,
        question: 'What is 2 + 2?',
        answer: '4',
        hint: 'Add the numbers',
        image: '➕'
      });
    }
  }, []);

  const handleTopicSelect = useCallback((topic: string, grade: number) => {
    setGameState(prev => ({ ...prev, topic, grade }));
    setShowTopicSelector(false);
    generateNewPuzzle(topic, grade);
  }, [generateNewPuzzle]);

  const handleSubmit = useCallback(() => {
    if (!currentPuzzle || !gameState.topic || !gameState.grade) return;

    const currentAnswer = answer.trim();
    const correctAnswer = currentPuzzle.answer;

    if (currentAnswer === correctAnswer) {
      // Show celebration first
      setShowCelebration(true);

      // Update score and puzzles solved
      setGameState(prev => ({
        ...prev,
        score: prev.score + 100,
        puzzlesSolved: prev.puzzlesSolved + 1
      }));

      // Clear input and hide hint
      setAnswer('');
      setShowHint(false);

      // Generate next puzzle after a delay
      setTimeout(() => {
        setShowCelebration(false);
        generateNewPuzzle(gameState.topic!, gameState.grade!);
      }, 1000);
    } else {
      setAnswer('');
    }
  }, [answer, currentPuzzle, gameState.topic, gameState.grade, generateNewPuzzle]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }, [handleSubmit]);

  if (!gameState.topic || !gameState.grade) {
    return (
      <AnimatePresence mode="sync">
        {showTopicSelector && (
          <TopicSelector
            onSelect={handleTopicSelect}
            onClose={() => navigate("/")}
          />
        )}
      </AnimatePresence>
    );
  }

  if (!currentPuzzle) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-purple-600 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
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
              Puzzles Solved: {gameState.puzzlesSolved}
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            <motion.div 
              key={currentPuzzle.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center mb-8"
            >
              <span className="text-6xl mb-4 block">
                {currentPuzzle.image}
              </span>
              <h2 className="text-2xl font-bold">
                Puzzle #{gameState.puzzlesSolved + 1}
              </h2>
            </motion.div>

            <p className="text-lg mb-6">
              {currentPuzzle.question}
            </p>

            <div className="space-y-4">
              <Input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Your answer..."
                className="text-lg"
              />

              <div className="flex gap-4">
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Submit Answer
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setShowHint(true)}
                  className="w-full"
                >
                  Need a Hint?
                </Button>
              </div>

              <AnimatePresence mode="sync">
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4 bg-purple-100 rounded-lg"
                  >
                    <p className="text-purple-700">
                      Hint: {currentPuzzle.hint}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        <AnimatePresence mode="sync">
          {showCelebration && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            >
              <div className="bg-white p-8 rounded-lg text-center">
                <h2 className="text-4xl mb-4">🎉</h2>
                <p className="text-2xl font-bold text-green-600">Correct!</p>
                <p className="text-lg text-gray-600">+100 points</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}