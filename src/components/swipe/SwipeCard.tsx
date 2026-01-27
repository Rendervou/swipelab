import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Heart, X, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface Design {
  id: string;
  title: string;
  image_url: string;
  category: string;
  description?: string;
  created_at: string;
  profiles?: {
    name: string | null;
    avatar_url: string | null;
  };
}

interface SwipeCardProps {
  design: Design;
  onSwipe: (direction: 'left' | 'right') => void;
  isTop: boolean;
}

const categoryColors: Record<string, string> = {
  ui_ux: 'bg-electric-blue text-primary-foreground',
  poster: 'bg-lavender text-primary-foreground',
  illustration: 'bg-mint text-primary-foreground',
};

const categoryLabels: Record<string, string> = {
  ui_ux: 'UI/UX',
  poster: 'Poster',
  illustration: 'Illustration',
};

export const SwipeCard = ({ design, onSwipe, isTop }: SwipeCardProps) => {
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
  
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-20, 0, 20]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const skipOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      setExitDirection('right');
      onSwipe('right');
    } else if (info.offset.x < -threshold) {
      setExitDirection('left');
      onSwipe('left');
    }
  };

  const handleButtonSwipe = (direction: 'left' | 'right') => {
    setExitDirection(direction);
    onSwipe(direction);
  };

  if (!isTop) {
    return (
      <motion.div
        className="absolute inset-0 swipe-card"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 0.95, y: 20 }}
        style={{ zIndex: 0 }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-3xl">
          <img
            src={design.image_url}
            alt={design.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 swipe-card cursor-grab active:cursor-grabbing"
      style={{ x, rotate, zIndex: 1 }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      initial={{ scale: 1, y: 0 }}
      animate={
        exitDirection === 'left'
          ? { x: -500, rotate: -20, opacity: 0 }
          : exitDirection === 'right'
          ? { x: 500, rotate: 20, opacity: 0 }
          : { scale: 1, y: 0 }
      }
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Card content */}
      <div className="relative h-full w-full overflow-hidden rounded-3xl">
        <img
          src={design.image_url}
          alt={design.title}
          className="h-full w-full object-cover"
          draggable={false}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        
        {/* Like indicator */}
        <motion.div
          className="absolute top-8 right-8 flex h-20 w-20 items-center justify-center rounded-full border-4 border-mint bg-mint/20 backdrop-blur-sm"
          style={{ opacity: likeOpacity }}
        >
          <Heart className="h-10 w-10 text-mint" fill="currentColor" />
        </motion.div>
        
        {/* Skip indicator */}
        <motion.div
          className="absolute top-8 left-8 flex h-20 w-20 items-center justify-center rounded-full border-4 border-destructive bg-destructive/20 backdrop-blur-sm"
          style={{ opacity: skipOpacity }}
        >
          <X className="h-10 w-10 text-destructive" />
        </motion.div>
        
        {/* Category badge */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2">
          <Badge className={`${categoryColors[design.category]} px-4 py-1 text-sm font-medium`}>
            {categoryLabels[design.category]}
          </Badge>
        </div>
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-10 w-10 border-2 border-white/30">
              <AvatarImage src={design.profiles?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/50 text-white text-sm">
                {design.profiles?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{design.profiles?.name || 'Anonymous'}</span>
          </div>
          
          <h3 className="font-display text-2xl font-bold mb-2">{design.title}</h3>
          
          {design.description && (
            <p className="text-white/80 text-sm line-clamp-2">
              {design.description}
            </p>
          )}
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleButtonSwipe('left')}
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-muted-foreground/30 bg-card shadow-card hover:border-destructive hover:bg-destructive/10 transition-colors"
        >
          <X className="h-7 w-7 text-muted-foreground hover:text-destructive" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleButtonSwipe('right')}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-primary shadow-glow"
        >
          <Heart className="h-9 w-9 text-white" fill="currentColor" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-muted-foreground/30 bg-card shadow-card hover:border-gold hover:bg-gold/10 transition-colors"
        >
          <Sparkles className="h-7 w-7 text-gold" />
        </motion.button>
      </div>
    </motion.div>
  );
};
