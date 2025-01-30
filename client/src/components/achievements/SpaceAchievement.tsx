import { motion } from 'framer-motion';
import { Globe2 as Planet, Stars, Rocket, Medal, Trophy, Star, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpaceAchievementProps {
  type: 'planet' | 'constellation' | 'rocket' | 'star' | 'galaxy' | 'supernova';
  name: string;
  description: string;
  unlocked: boolean;
  progress?: number;
}

const ACHIEVEMENT_ICONS = {
  planet: Planet,
  constellation: Stars,
  rocket: Rocket,
  star: Star,
  galaxy: Medal,
  supernova: Trophy
};

const ACHIEVEMENT_COLORS = {
  planet: 'from-blue-500 to-green-500',
  constellation: 'from-purple-500 to-blue-500',
  rocket: 'from-orange-500 to-red-500',
  star: 'from-yellow-500 to-orange-500',
  galaxy: 'from-indigo-500 to-purple-500',
  supernova: 'from-pink-500 to-purple-500'
};

export function SpaceAchievement({ 
  type, 
  name, 
  description, 
  unlocked, 
  progress = 0 
}: SpaceAchievementProps) {
  const Icon = ACHIEVEMENT_ICONS[type];

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className={cn(
        "relative p-6 rounded-lg border-2",
        unlocked 
          ? "border-transparent bg-gradient-to-br shadow-lg" 
          : "border-gray-200 bg-gray-50",
        unlocked && ACHIEVEMENT_COLORS[type]
      )}
    >
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className={cn(
            "p-3 rounded-full",
            unlocked 
              ? "bg-white/20" 
              : "bg-gray-100"
          )}>
            <Icon className={cn(
              "w-8 h-8",
              unlocked 
                ? "text-white" 
                : "text-gray-400"
            )} />
          </div>
          <div>
            <h3 className={cn(
              "font-bold",
              unlocked 
                ? "text-white" 
                : "text-gray-700"
            )}>
              {name}
            </h3>
            <p className={cn(
              "text-sm",
              unlocked 
                ? "text-white/80" 
                : "text-gray-500"
            )}>
              {description}
            </p>
          </div>
        </div>

        {progress > 0 && progress < 100 && (
          <div className="w-full bg-black/10 rounded-full h-2">
            <div 
              className="h-full bg-white rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {unlocked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2"
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}