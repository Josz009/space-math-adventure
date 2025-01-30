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
      <div className="relative w-24 h-16">
        {/* Engine flames */}
        {powered && (
          <motion.div
            className="absolute -left-8 top-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <div className="w-12 h-8">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-yellow-500 to-transparent rounded-l-full blur-sm animate-pulse" />
              <div className="absolute inset-1 bg-gradient-to-r from-yellow-300 via-orange-400 to-transparent rounded-l-full blur-xs" />
            </div>
          </motion.div>
        )}

        {/* Main body of the spaceship */}
        <div className="absolute inset-0">
          {/* Body base */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-300 via-slate-400 to-slate-600 rounded-xl transform rotate-90">
            {/* Cockpit window */}
            <div className="absolute top-1/4 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2">
              <div className="w-full h-full bg-gradient-to-br from-sky-300 via-sky-400 to-sky-600 rounded-full border-2 border-slate-600" />
              <div className="absolute inset-1 bg-gradient-to-tl from-transparent via-white/30 to-white/60 rounded-full" />
            </div>

            {/* Wing accents */}
            <div className="absolute top-0 right-0 w-4 h-12 bg-gradient-to-r from-slate-500 to-slate-700 rounded-tr-xl" />
            <div className="absolute bottom-0 right-0 w-4 h-12 bg-gradient-to-r from-slate-500 to-slate-700 rounded-br-xl" />

            {/* Engine exhausts */}
            <div className="absolute top-1/4 left-2 w-3 h-3 bg-slate-800 rounded-full" />
            <div className="absolute bottom-1/4 left-2 w-3 h-3 bg-slate-800 rounded-full" />
          </div>

          {/* Side wings */}
          <div className="absolute top-0 left-1/2 w-8 h-4 -translate-x-1/2 -translate-y-2 bg-gradient-to-t from-slate-400 to-slate-600 rounded-t-lg" />
          <div className="absolute bottom-0 left-1/2 w-8 h-4 -translate-x-1/2 translate-y-2 bg-gradient-to-b from-slate-400 to-slate-600 rounded-b-lg" />
        </div>

        {/* Highlight effects */}
        <div className="absolute inset-y-2 right-4 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full blur-sm" />
      </div>
    </motion.div>
  );
}