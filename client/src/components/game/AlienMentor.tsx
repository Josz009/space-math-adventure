import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface AlienMentorProps {
  onMessage?: (message: string) => void;
  mood?: 'happy' | 'thinking' | 'excited' | 'encouraging';
  isVisible?: boolean;
  className?: string;
  onClick?: () => void;
}

const MENTOR_PHRASES = {
  happy: [
    "Excellent work, young astronaut! 🌟",
    "You're mastering math at lightspeed! ⭐",
    "That's out of this world! 🚀",
  ],
  thinking: [
    "Hmm, let's solve this cosmic puzzle together...",
    "Remember your space training...",
    "Take your time, the stars aren't going anywhere!",
  ],
  excited: [
    "Wow! You're solving problems faster than a supernova! ✨",
    "Another mathematical discovery! 🌌",
    "You're becoming a true Math Explorer! 🎯",
  ],
  encouraging: [
    "Don't worry, even black holes were hard to understand at first!",
    "Keep trying! Every great astronaut started somewhere.",
    "You're getting closer to the solution! I can feel it!",
  ],
};

export function AlienMentor({ onMessage, mood = 'happy', isVisible = true, className = '', onClick }: AlienMentorProps) {
  const [currentPhrase, setCurrentPhrase] = useState('');
  const [antennaeActive, setAntennaeActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (mood) {
      const phrases = MENTOR_PHRASES[mood];
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      setCurrentPhrase(randomPhrase);
      onMessage?.(randomPhrase);

      // Animate antennae when speaking
      setAntennaeActive(true);
      const timeout = setTimeout(() => setAntennaeActive(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [mood, onMessage]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, x: 50 }}
          animate={{ scale: 1, x: 0 }}
          exit={{ scale: 0, x: 50 }}
          className={`fixed right-8 w-64 ${className}`}
          style={{ top: '50%', transform: 'translateY(-50%)' }}
          onClick={onClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Speech Bubble */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white rounded-lg p-4 mb-4 shadow-lg relative"
          >
            <div className="absolute right-0 top-1/2 transform translate-x-1/2 rotate-45 w-4 h-4 bg-white" />
            <p className="text-gray-800">{currentPhrase}</p>
          </motion.div>

          {/* Alien Character */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            animate={isHovered ? {
              rotate: [-5, 5, -5],
              transition: { duration: 2, repeat: Infinity }
            } : {}}
            className="relative w-32 h-32 mx-auto cursor-pointer"
          >
            {/* Body */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full shadow-lg"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Eyes */}
            <div className="absolute top-1/4 left-1/4 w-full h-full flex space-x-4">
              <motion.div
                className="w-6 h-6 bg-black rounded-full"
                animate={isHovered ? {
                  scale: [1, 1.5, 1],
                  transition: { duration: 0.5 }
                } : {
                  scale: [1, 1.2, 1],
                  transition: { duration: 2, repeat: Infinity }
                }}
              />
              <motion.div
                className="w-6 h-6 bg-black rounded-full"
                animate={isHovered ? {
                  scale: [1, 1.5, 1],
                  transition: { duration: 0.5 }
                } : {
                  scale: [1, 1.2, 1],
                  transition: { duration: 2, repeat: Infinity }
                }}
              />
            </div>

            {/* Antennae */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex space-x-8">
              <motion.div
                className="w-1 h-8 bg-emerald-400 origin-bottom"
                animate={antennaeActive ? {
                  rotateZ: [-15, 15, -15],
                } : isHovered ? {
                  rotateZ: [-5, 5, -5],
                  transition: { duration: 1, repeat: Infinity }
                } : {}}
              >
                <motion.div 
                  className="w-2 h-2 rounded-full bg-emerald-300 -translate-x-[2px]"
                  animate={isHovered ? {
                    scale: [1, 1.5, 1],
                    transition: { duration: 1, repeat: Infinity }
                  } : {}}
                />
              </motion.div>
              <motion.div
                className="w-1 h-8 bg-emerald-400 origin-bottom"
                animate={antennaeActive ? {
                  rotateZ: [15, -15, 15],
                } : isHovered ? {
                  rotateZ: [5, -5, 5],
                  transition: { duration: 1, repeat: Infinity }
                } : {}}
              >
                <motion.div 
                  className="w-2 h-2 rounded-full bg-emerald-300 -translate-x-[2px]"
                  animate={isHovered ? {
                    scale: [1, 1.5, 1],
                    transition: { duration: 1, repeat: Infinity }
                  } : {}}
                />
              </motion.div>
            </div>

            {/* Mouth */}
            <motion.div
              className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-black rounded-full"
              animate={mood === 'happy' || isHovered ? {
                scaleY: [1, 2, 1],
                y: [0, -2, 0],
              } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}