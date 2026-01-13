import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: 'coral' | 'mint' | 'lavender' | 'gold' | 'electric-blue';
  delay?: number;
}

const colorClasses = {
  coral: 'bg-coral/10 text-coral',
  mint: 'bg-mint/10 text-mint',
  lavender: 'bg-lavender/10 text-lavender',
  gold: 'bg-gold/10 text-gold',
  'electric-blue': 'bg-electric-blue/10 text-electric-blue',
};

export const StatCard = ({ label, value, icon: Icon, color, delay = 0 }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl bg-card p-6 shadow-card"
    >
      <div className="flex items-center gap-4">
        <div className={`rounded-xl p-3 ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-display text-2xl font-bold">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};
