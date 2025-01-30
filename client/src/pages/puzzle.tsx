import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';

const PUZZLES = [
  {
    id: 1,
    type: 'sequence',
    question: 'What comes next in the sequence: 2, 4, 6, 8, __?',
    answer: '10',
    hint: 'Look for the pattern of adding numbers',
  },
  {
    id: 2,
    type: 'word',
    question: 'If five pencils cost $1.00, how many pencils can you buy for $3.00?',
    answer: '15',
    hint: 'Use multiplication',
  },
  // Add more puzzles as needed
];

export default function Puzzle() {
  const [, navigate] = useLocation();
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);

  const handleSubmit = () => {
    if (answer === PUZZLES[currentPuzzle].answer) {
      setScore(prev => prev + 100);
      if (currentPuzzle < PUZZLES.length - 1) {
        setCurrentPuzzle(prev => prev + 1);
      }
    }
    setAnswer('');
    setShowHint(false);
  };

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
            Score: {score}
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6">
              Puzzle #{currentPuzzle + 1}
            </h2>
            
            <p className="text-lg mb-6">
              {PUZZLES[currentPuzzle].question}
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
                  className="w-full"
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

              {showHint && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-4 bg-purple-100 rounded-lg"
                >
                  <p className="text-purple-700">
                    Hint: {PUZZLES[currentPuzzle].hint}
                  </p>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
