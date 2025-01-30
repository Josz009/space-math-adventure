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
      <div className="relative w-32 h-24">
        {/* Engine flames */}
        {powered && (
          <motion.div
            className="absolute -left-12 top-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <div className="w-16 h-12">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-yellow-500 to-transparent rounded-l-full blur-sm animate-pulse" />
              <div className="absolute inset-1 bg-gradient-to-r from-yellow-300 via-orange-400 to-transparent rounded-l-full blur-xs" />
            </div>
          </motion.div>
        )}

        {/* Main body of the spaceship */}
        <div className="absolute inset-0">
          {/* Main hull */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 rounded-xl transform rotate-90">
            {/* Metallic overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/40 rounded-xl" />

            {/* Cockpit window */}
            <div className="absolute top-1/4 left-1/2 w-12 h-12 -translate-x-1/2 -translate-y-1/2">
              <div className="w-full h-full bg-gradient-to-br from-cyan-300 via-cyan-400 to-cyan-600 rounded-full border-4 border-blue-800/50">
                <div className="absolute inset-2 bg-gradient-to-tl from-transparent via-white/50 to-white/80 rounded-full" />
              </div>
            </div>

            {/* Wing structures */}
            <div className="absolute top-0 right-0 w-6 h-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-tr-xl transform -skew-y-12" />
            <div className="absolute bottom-0 right-0 w-6 h-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-br-xl transform skew-y-12" />

            {/* Engine nozzles */}
            <div className="absolute top-1/4 left-2 w-4 h-4 bg-gradient-to-r from-slate-600 to-slate-800 rounded-full ring-2 ring-blue-400/50" />
            <div className="absolute bottom-1/4 left-2 w-4 h-4 bg-gradient-to-r from-slate-600 to-slate-800 rounded-full ring-2 ring-blue-400/50" />
          </div>

          {/* Side fins */}
          <div className="absolute -top-3 left-1/2 w-12 h-6 -translate-x-1/2 bg-gradient-to-t from-blue-500 to-blue-700 rounded-t-lg transform -rotate-12">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
          <div className="absolute -bottom-3 left-1/2 w-12 h-6 -translate-x-1/2 bg-gradient-to-b from-blue-500 to-blue-700 rounded-b-lg transform rotate-12">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        </div>

        {/* Dynamic lighting effects */}
        <div className="absolute inset-y-4 right-6 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full blur-sm" />
        <div className="absolute inset-y-4 left-6 w-1/4 bg-gradient-to-l from-transparent via-blue-400/30 to-transparent rounded-full blur-sm" />
      </div>
    </motion.div>
  );
}