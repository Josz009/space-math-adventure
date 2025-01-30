import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

interface SpaceshipProps {
  position: number;
  powered?: boolean;
  x?: number;
}

export function Spaceship({ position, powered, x }: SpaceshipProps) {
  return (
    <motion.div
      className="absolute z-20"
      animate={{
        y: position,
        x: x ?? 32, // Default to 32px from left if not in dodge mode
        scale: powered ? 1.1 : 1,
      }}
      transition={{
        y: { type: "spring", stiffness: 100, damping: 10 },
        x: { type: "spring", stiffness: 100, damping: 10 },
        scale: { duration: 0.2 }
      }}
    >
      <div className="relative">
        {powered && (
          <motion.div
            className="absolute -right-8 w-16 h-8"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <div className="w-full h-full bg-gradient-to-l from-orange-500 via-yellow-500 to-transparent rounded-full blur-sm" />
          </motion.div>
        )}
        <Rocket className="w-16 h-16 text-white transform -rotate-90" />
      </div>
    </motion.div>
  );
}