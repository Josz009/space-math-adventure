import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

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

  const handleAnswer = (option: string) => {
    setSelected(option);
    const correct = option === problem.answer;
    setTimeout(() => {
      onAnswer(correct);
      setSelected(null);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-8">
        <motion.h3 
          className="text-3xl font-bold text-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {problem.question}
        </motion.h3>

        <div className="grid grid-cols-2 gap-4">
          <AnimatePresence>
            {problem.options.map((option, index) => (
              <motion.div
                key={option}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  className={`w-full h-20 text-xl ${
                    selected === option
                      ? option === problem.answer
                        ? 'bg-green-500'
                        : 'bg-red-500'
                      : ''
                  }`}
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
  );
}
