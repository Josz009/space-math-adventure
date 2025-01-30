import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { TopicSelector } from '@/components/game/TopicSelector';

interface PuzzleState {
  topic: string | null;
  grade: number | null;
  score: number;
  currentPuzzle: number;
}

const PUZZLES = [
  {
    id: 1,
    type: 'multiplication',
    question: 'What is 6 × 7?',
    answer: '42',
    hint: 'Think of 6 groups of 7 objects',
    image: '🎲'
  },
  {
    id: 2,
    type: 'multiplication',
    question: 'In a classroom, there are 4 rows with 8 desks in each row. How many desks are there in total?',
    answer: '32',
    hint: 'Multiply the number of rows by the number of desks in each row',
    image: '🪑'
  },
  {
    id: 3,
    type: 'multiplication',
    question: 'A baker has 9 trays with 5 cookies on each tray. How many cookies are there in total?',
    answer: '45',
    hint: 'Multiply the number of trays by the number of cookies on each tray',
    image: '🍪'
  },
  {
    id: 4,
    type: 'multiplication',
    question: 'What is 8 × 6?',
    answer: '48',
    hint: 'Think of it as 8 groups of 6 things',
    image: '📦'
  },
  {
    id: 5,
    type: 'multiplication',
    question: 'A sticker book has 7 pages with 6 stickers on each page. How many stickers are in the book?',
    answer: '42',
    hint: 'Multiply the number of pages by the number of stickers per page',
    image: '⭐'
  }
];

export default function Puzzle() {
  const [, navigate] = useLocation();
  const [gameState, setGameState] = useState<PuzzleState>({
    topic: null,
    grade: null,
    score: 0,
    currentPuzzle: 0
  });
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showTopicSelector, setShowTopicSelector] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleTopicSelect = (topic: string, grade: number) => {
    setGameState(prev => ({ ...prev, topic, grade }));
    setShowTopicSelector(false);
  };

  const handleSubmit = () => {
    const currentAnswer = answer.trim();
    const correctAnswer = PUZZLES[gameState.currentPuzzle].answer;

    if (currentAnswer === correctAnswer) {
      // Show celebration first
      setShowCelebration(true);

      // Update score
      setGameState(prev => ({
        ...prev,
        score: prev.score + 100
      }));

      // Clear input and hide hint
      setAnswer('');
      setShowHint(false);

      // Wait for celebration animation, then move to next puzzle
      setTimeout(() => {
        setShowCelebration(false);
        setGameState(prev => ({
          ...prev,
          currentPuzzle: prev.currentPuzzle < PUZZLES.length - 1 
            ? prev.currentPuzzle + 1 
            : prev.currentPuzzle
        }));
      }, 1000);
    } else {
      setAnswer('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
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

  const currentPuzzle = PUZZLES[gameState.currentPuzzle];

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
          <div className="bg-white rounded-lg px-4 py-2">
            Score: {gameState.score}
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
                Puzzle #{gameState.currentPuzzle + 1}
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

              <AnimatePresence>
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

        <AnimatePresence>
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