import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AchievementUnlockAnimationProps {
  achievement: {
    type: 'planet' | 'constellation' | 'rocket' | 'star' | 'galaxy' | 'supernova';
    name: string;
    description: string;
  } | null;
  onComplete?: () => void;
}

export function AchievementUnlockAnimation({ 
  achievement, 
  onComplete 
}: AchievementUnlockAnimationProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (achievement) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onComplete]);

  if (!achievement) return null;

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <div className="relative">
            {/* Background glow effect */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                times: [0, 0.5, 1],
                repeat: Infinity
              }}
              className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-xl"
            />

            {/* Achievement card */}
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              className="relative bg-white rounded-lg p-8 text-center shadow-xl"
            >
              {/* Trophy icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-4 inline-block"
              >
                <div className="relative">
                  <Trophy className="w-16 h-16 text-yellow-500" />
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity
                    }}
                    className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl"
                  />
                </div>
              </motion.div>

              {/* Achievement text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-2xl font-bold mb-2">Achievement Unlocked!</h2>
                <h3 className="text-xl text-purple-600 mb-2">{achievement.name}</h3>
                <p className="text-gray-600">{achievement.description}</p>
              </motion.div>

              {/* Decorative stars */}
              {showConfetti && (
                <>
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ 
                        scale: 0,
                        x: 0,
                        y: 0,
                        rotate: 0
                      }}
                      animate={{ 
                        scale: [1, 0],
                        x: Math.cos(i * 30) * 100,
                        y: Math.sin(i * 30) * 100,
                        rotate: 360
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.1,
                        ease: "easeOut"
                      }}
                      className="absolute left-1/2 top-1/2"
                    >
                      <Star className={cn(
                        "w-6 h-6",
                        i % 2 === 0 ? "text-yellow-500" : "text-purple-500"
                      )} />
                    </motion.div>
                  ))}
                </>
              )}

              {/* Sparkles */}
              <motion.div
                className="absolute -right-4 -top-4"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              >
                <Sparkles className="w-8 h-8 text-yellow-500" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
