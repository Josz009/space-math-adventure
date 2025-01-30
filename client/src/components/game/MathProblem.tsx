import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { AlienMentor } from './AlienMentor';

interface MathProblemProps {
  problem: {
    question: string;
    options: string[];
    answer: string;
  };
  onAnswer: (correct: boolean) => void;
}

export function MathProblem({ problem, onAnswer }: MathProblemProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [mentorMood, setMentorMood] = useState<'thinking' | 'happy' | 'excited' | 'encouraging'>('thinking');
  const [showMentor, setShowMentor] = useState(true);
  const [mentorMessage, setMentorMessage] = useState<string>('');

  useEffect(() => {
    // Reset mentor state when problem changes
    setSelected(null);
    setMentorMood('thinking');
    setShowMentor(true);
  }, [problem]);

  const handleAnswer = (option: string) => {
    setSelected(option);
    const correct = option === problem.answer;

    // Update mentor mood based on answer
    setMentorMood(correct ? 'excited' : 'encouraging');

    setTimeout(() => {
      onAnswer(correct);
      setSelected(null);
      // Brief pause before showing next problem's thinking mood
      setTimeout(() => setMentorMood('thinking'), 500);
    }, 1000);
  };

  const handleMentorClick = () => {
    // Give a hint or encouragement when clicked
    if (!selected) {
      setMentorMood('encouraging');
      setTimeout(() => setMentorMood('thinking'), 2000);
    }
  };

  return (
    <div className="relative flex items-center justify-center gap-8">
      <Card className="w-full max-w-2xl backdrop-blur-lg bg-white/90">
        <CardContent className="p-8">
          <motion.div 
            className="text-center mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <motion.h3 
              className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              {problem.question}
            </motion.h3>
          </motion.div>

          <div className="grid grid-cols-2 gap-6">
            <AnimatePresence mode="sync">
              {problem.options.map((option, index) => (
                <motion.div
                  key={option}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    delay: index * 0.1 
                  }}
                >
                  <Button
                    className={`w-full h-24 text-2xl font-bold transition-all duration-300 ${
                      selected === option
                        ? option === problem.answer
                          ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                          : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
                    } transform hover:scale-105 hover:shadow-lg`}
                    onClick={() => handleAnswer(option)}
                    disabled={selected !== null}
                  >
                    {option}
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Mentor positioned to the right */}
      <AlienMentor
        mood={mentorMood}
        isVisible={showMentor}
        onMessage={setMentorMessage}
        onClick={handleMentorClick}
        className="relative right-0 top-0 transform-none"
      />
    </div>
  );
}