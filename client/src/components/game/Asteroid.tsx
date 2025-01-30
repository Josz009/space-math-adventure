import { motion } from 'framer-motion';

interface AsteroidProps {
  size: number;
  position: { x: number; y: number };
  rotation?: number;
}

export function Asteroid({ size, position, rotation = 0 }: AsteroidProps) {
  return (
    <motion.div
      className="absolute"
      style={{
        width: size,
        height: size,
      }}
      initial={{
        x: position.x + 100,
        y: position.y,
        rotate: rotation,
      }}
      animate={{
        x: -200,
        rotate: rotation + 360,
      }}
      transition={{
        duration: 8,
        ease: "linear",
      }}
    >
      <div className="w-full h-full relative">
        <div className="absolute inset-0 bg-gray-700 rounded-full opacity-80" />
        <div className="absolute inset-2 bg-gray-600 rounded-full" />
        <div className="absolute inset-4 bg-gray-500 rounded-full" />
      </div>
    </motion.div>
  );
}
