import { useState } from 'react';
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
    type: 'sequence',
    question: 'What comes next in the sequence: 2, 4, 6, 8, __?',
    answer: '10',
    hint: 'Look for the pattern of adding numbers',
    image: '🔢'
  },
  {
    id: 2,
    type: 'word',
    question: 'If five pencils cost $1.00, how many pencils can you buy for $3.00?',
    answer: '15',
    hint: 'Use multiplication',
    image: '✏️'
  },
  // Add more puzzles as needed
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
    if (answer === PUZZLES[gameState.currentPuzzle].answer) {
      setShowCelebration(true);
      setGameState(prev => ({ ...prev, score: prev.score + 100 }));
      setTimeout(() => {
        setShowCelebration(false);
        if (gameState.currentPuzzle < PUZZLES.length - 1) {
          setGameState(prev => ({ ...prev, currentPuzzle: prev.currentPuzzle + 1 }));
        }
      }, 2000);
    }
    setAnswer('');
    setShowHint(false);
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
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-center mb-8"
            >
              <span className="text-6xl mb-4 block">
                {PUZZLES[gameState.currentPuzzle].image}
              </span>
              <h2 className="text-2xl font-bold">
                Puzzle #{gameState.currentPuzzle + 1}
              </h2>
            </motion.div>

            <p className="text-lg mb-6">
              {PUZZLES[gameState.currentPuzzle].question}
            </p>

            <div className="space-y-4">
              <Input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
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
                      Hint: {PUZZLES[gameState.currentPuzzle].hint}
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