import { motion } from 'framer-motion';

interface AsteroidProps {
  size: number;
  position: { x: number; y: number };
  rotation?: number;
  speed?: number;
}

export function Asteroid({ size, position, rotation = 0, speed = 1 }: AsteroidProps) {
  const asteroidColor = '#8B7355'; // Rocky brown color

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
        scale: 1,
      }}
      animate={{
        x: -200,
        rotate: rotation + 360,
        scale: [1, 1.1, 0.9, 1],
      }}
      transition={{
        duration: 8 / speed,
        ease: "linear",
        scale: {
          repeat: Infinity,
          duration: 2,
        },
      }}
    >
      {/* Main asteroid body with 3D effect */}
      <div className="w-full h-full relative">
        {/* Base shape with irregular edges */}
        <div 
          className="absolute inset-0 rounded-[40%_45%_42%_38%]"
          style={{
            background: `linear-gradient(135deg, 
              ${asteroidColor} 0%,
              #6B5345 40%,
              #4A3B32 70%,
              #2F2520 100%
            )`,
            boxShadow: `
              inset -4px -4px 8px rgba(0,0,0,0.5),
              inset 4px 4px 8px rgba(255,255,255,0.2),
              8px 8px 16px rgba(0,0,0,0.3)
            `,
          }}
        />

        {/* Crater effects */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size * 0.3,
              height: size * 0.3,
              left: `${20 + i * 25}%`,
              top: `${15 + i * 20}%`,
              background: 'rgba(0,0,0,0.3)',
              boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.5)',
            }}
          />
        ))}

        {/* Surface detail lines */}
        <div
          className="absolute inset-0 rounded-[40%_45%_42%_38%]"
          style={{
            background: `linear-gradient(45deg,
              transparent 0%,
              rgba(255,255,255,0.1) 45%,
              transparent 55%,
              rgba(0,0,0,0.1) 100%
            )`,
          }}
        />
      </div>
    </motion.div>
  );
}