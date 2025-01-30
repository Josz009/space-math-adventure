import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface RewardBadgeProps {
  type: string;
  description: string;
  unlocked?: boolean;
}

export function RewardBadge({ type, description, unlocked = false }: RewardBadgeProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      <Card className={`p-4 text-center ${unlocked ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'opacity-50'}`}>
        <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-white flex items-center justify-center">
          {type === 'speed' && '⚡'}
          {type === 'accuracy' && '🎯'}
          {type === 'streak' && '🔥'}
          {type === 'level' && '⭐'}
        </div>
        <h3 className="font-bold mb-1">{type}</h3>
        <p className="text-sm">{description}</p>
      </Card>
    </motion.div>
  );
}
