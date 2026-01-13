import { motion } from 'framer-motion';
import { Sparkles, Upload, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface EmptyFeedProps {
  hasFilter: boolean;
  onClearFilter?: () => void;
}

export const EmptyFeed = ({ hasFilter, onClearFilter }: EmptyFeedProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center px-6 py-12"
    >
      <div className="relative mb-8">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="h-32 w-32 rounded-3xl bg-gradient-secondary flex items-center justify-center shadow-lg"
        >
          <Sparkles className="h-16 w-16 text-primary-foreground" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -right-2 -top-2 h-8 w-8 rounded-full bg-gold flex items-center justify-center"
        >
          <span className="text-lg">✨</span>
        </motion.div>
      </div>

      <h2 className="font-display text-2xl font-bold mb-3">
        {hasFilter ? "No designs in this category" : "You've seen them all!"}
      </h2>
      
      <p className="text-muted-foreground max-w-sm mb-8">
        {hasFilter 
          ? "Try selecting a different category or clear the filter to see all designs."
          : "You've swiped through all available designs. Check back later for new uploads or share your own work!"
        }
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        {hasFilter && onClearFilter && (
          <Button variant="outline" onClick={onClearFilter}>
            <RefreshCw className="h-4 w-4" />
            Clear Filter
          </Button>
        )}
        
        <Link to="/upload">
          <Button variant="gradient">
            <Upload className="h-4 w-4" />
            Upload Your Design
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};
