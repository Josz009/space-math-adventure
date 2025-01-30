import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlienMentor } from './AlienMentor';

interface TutorialStep {
  explanation: string;
  visualComponent: JSX.Element;
}

interface TutorialAnimationProps {
  topic: string;
  onComplete: () => void;
  difficulty: number;
}

export function TutorialAnimation({ topic, onComplete, difficulty }: TutorialAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const additionTutorial: TutorialStep[] = [
    {
      explanation: "Let's learn how to add numbers using visual groups!",
      visualComponent: (
        <motion.div className="flex items-center justify-center gap-8">
          <motion.div 
            className="flex gap-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="w-8 h-8 bg-blue-400 rounded-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
              />
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold"
          >
            +
          </motion.div>
          <motion.div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-8 h-8 bg-green-400 rounded-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 + 1 }}
              />
            ))}
          </motion.div>
        </motion.div>
      )
    },
    {
      explanation: "Now watch as we combine the groups together!",
      visualComponent: (
        <motion.div className="flex items-center justify-center">
          <motion.div className="flex gap-2">
            {[...Array(7)].map((_, i) => (
              <motion.div
                key={i}
                className={`w-8 h-8 ${i < 4 ? 'bg-blue-400' : 'bg-green-400'} rounded-full`}
                initial={i < 4 ? { x: -100 } : { x: 100 }}
                animate={{ x: 0 }}
                transition={{ delay: i * 0.2, type: "spring" }}
              />
            ))}
          </motion.div>
        </motion.div>
      )
    }
  ];

  const multiplicationTutorial: TutorialStep[] = [
    {
      explanation: "Multiplication is like making equal groups!",
      visualComponent: (
        <motion.div className="flex flex-col gap-4">
          {[...Array(3)].map((_, row) => (
            <motion.div
              key={row}
              className="flex gap-2 justify-center"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: row * 0.5 }}
            >
              {[...Array(4)].map((_, col) => (
                <motion.div
                  key={col}
                  className="w-8 h-8 bg-purple-400 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: row * 0.5 + col * 0.2 }}
                />
              ))}
            </motion.div>
          ))}
        </motion.div>
      )
    },
    {
      explanation: "In this example: 3 rows × 4 objects = 12 total objects",
      visualComponent: (
        <motion.div className="flex flex-col items-center gap-4">
          <motion.div className="flex flex-col gap-4">
            {[...Array(3)].map((_, row) => (
              <motion.div
                key={row}
                className="flex gap-2 justify-center"
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ delay: row * 0.5, duration: 0.5 }}
              >
                {[...Array(4)].map((_, col) => (
                  <motion.div
                    key={col}
                    className="w-8 h-8 bg-purple-400 rounded-full"
                  />
                ))}
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="text-2xl font-bold"
          >
            = 12
          </motion.div>
        </motion.div>
      )
    }
  ];

  const divisionTutorial: TutorialStep[] = [
    {
      explanation: "Division is sharing objects into equal groups!",
      visualComponent: (
        <motion.div className="flex flex-col items-center gap-8">
          <motion.div className="flex gap-2">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="w-8 h-8 bg-yellow-400 rounded-full"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              />
            ))}
          </motion.div>
        </motion.div>
      )
    },
    {
      explanation: "Let's divide 12 objects into 3 equal groups!",
      visualComponent: (
        <motion.div className="flex flex-col gap-8">
          {[...Array(3)].map((_, row) => (
            <motion.div
              key={row}
              className="flex gap-2 justify-center"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: row * 0.5 }}
            >
              {[...Array(4)].map((_, col) => (
                <motion.div
                  key={col}
                  className="w-8 h-8 bg-yellow-400 rounded-full"
                />
              ))}
            </motion.div>
          ))}
        </motion.div>
      )
    }
  ];

  // Select tutorial based on topic
  const tutorials = {
    addition: additionTutorial,
    multiplication: multiplicationTutorial,
    division: divisionTutorial,
    // Add more tutorials for other operations
  };

  const currentTutorial = tutorials[topic as keyof typeof tutorials] || additionTutorial;

  const nextStep = () => {
    if (currentStep < currentTutorial.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsComplete(true);
      setTimeout(onComplete, 1000);
    }
  };

  return (
    <Card className="p-8 max-w-2xl mx-auto">
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="text-center text-xl font-semibold text-gray-700 mb-8">
              {currentTutorial[currentStep].explanation}
            </div>

            <div className="min-h-[200px] flex items-center justify-center">
              {currentTutorial[currentStep].visualComponent}
            </div>

            <div className="flex justify-center mt-8">
              <Button
                onClick={nextStep}
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
              >
                {currentStep < currentTutorial.length - 1 ? "Next Step" : "Got it!"}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2">
          <AlienMentor
            mood="thinking"
            isVisible={!isComplete}
            onMessage={(msg) => console.log(msg)}
          />
        </div>
      </div>
    </Card>
  );
}