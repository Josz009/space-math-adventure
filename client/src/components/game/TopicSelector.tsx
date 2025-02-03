import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Divide, X as Multiply, Percent, Sigma, Brain, Calculator } from 'lucide-react';

interface TopicSelectorProps {
  onSelect: (topic: string, grade: number) => void;
  onClose: () => void;
}

const topics = [
  { id: 'addition', name: 'Addition', icon: Plus },
  { id: 'subtraction', name: 'Subtraction', icon: Minus },
  { id: 'multiplication', name: 'Multiplication', icon: Multiply },
  { id: 'division', name: 'Division', icon: Divide },
  { id: 'decimals_addition', name: 'Decimal Addition', icon: Calculator },
  { id: 'decimals_subtraction', name: 'Decimal Subtraction', icon: Calculator },
  { id: 'mixed_operations', name: 'Mixed Operations', icon: Sigma },
  { id: 'percentages', name: 'Percentages', icon: Percent },
];

const grades = [3, 4, 5, 6];

export function TopicSelector({ onSelect, onClose }: TopicSelectorProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);

  const handleConfirm = () => {
    if (selectedTopic && selectedGrade) {
      onSelect(selectedTopic, selectedGrade);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <Card className="w-full max-w-2xl relative overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <CardContent className="p-6">
          <motion.h2 
            className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
          >
            Choose Your Challenge
          </motion.h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Select Topic:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {topics.map((topic) => {
                  const Icon = topic.icon;
                  return (
                    <motion.button
                      key={topic.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedTopic(topic.id)}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        selectedTopic === topic.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-200'
                      }`}
                    >
                      <Icon className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm font-medium">{topic.name}</p>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Select Grade:</h3>
              <div className="flex flex-wrap gap-4">
                {grades.map((grade) => (
                  <motion.button
                    key={grade}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedGrade(grade)}
                    className={`px-6 py-3 rounded-lg border-2 transition-colors ${
                      selectedGrade === grade
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-200'
                    }`}
                  >
                    <p className="text-lg font-medium">Grade {grade}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6 mt-6"
              onClick={handleConfirm}
              disabled={!selectedTopic || !selectedGrade}
            >
              Start Learning
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}