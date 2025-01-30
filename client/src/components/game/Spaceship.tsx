import { motion } from 'framer-motion';

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
        x: x ?? 32,
        scale: powered ? 1.1 : 1,
      }}
      transition={{
        y: { type: "spring", stiffness: 100, damping: 10 },
        x: { type: "spring", stiffness: 100, damping: 10 },
        scale: { duration: 0.2 }
      }}
    >
      <div className="relative w-20 h-16">
        {/* Engine flames */}
        {powered && (
          <motion.div
            className="absolute -left-8 top-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <div className="w-10 h-8">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-yellow-500 to-transparent rounded-l-full blur-sm animate-pulse" />
              <div className="absolute inset-1 bg-gradient-to-r from-yellow-300 via-orange-400 to-transparent rounded-l-full blur-xs" />
            </div>
          </motion.div>
        )}

        {/* Main body */}
        <div className="absolute inset-0">
          {/* Rocket body */}
          <div className="absolute inset-0">
            {/* Nosecone */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-6 h-8 bg-gradient-to-b from-red-500 to-red-600 clip-path-triangle" />

            {/* Main fuselage */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-200 to-gray-400 rounded-xl">
              {/* Stripes */}
              <div className="absolute inset-x-0 top-1/4 h-2 bg-red-500" />
              <div className="absolute inset-x-0 bottom-1/4 h-2 bg-red-500" />
            </div>

            {/* Windows */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-6 h-6 bg-cyan-300 rounded-full border-2 border-gray-600">
              <div className="absolute inset-1 bg-gradient-to-br from-white/80 to-transparent rounded-full" />
            </div>

            {/* Fins */}
            <div className="absolute bottom-0 -left-2 w-4 h-8 bg-red-500 transform -rotate-45 origin-bottom-right" />
            <div className="absolute bottom-0 -right-2 w-4 h-8 bg-red-500 transform rotate-45 origin-bottom-left" />

            {/* Engine nozzle */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-4 bg-gradient-to-b from-gray-600 to-gray-800 rounded-b-lg" />
          </div>
        </div>

        <style jsx>{`
          .clip-path-triangle {
            clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          }
        `}</style>
      </div>
    </motion.div>
  );
}