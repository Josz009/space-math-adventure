import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
}

export function Timer({ duration, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="fixed top-4 right-4 bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg"
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-purple-600'}`}
      >
        {timeLeft}
      </motion.div>
    </motion.div>
  );
}
