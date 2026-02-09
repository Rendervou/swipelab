import { motion } from 'framer-motion';
import { Heart, Sparkles, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface Design {
  id: string;
  title: string;
  image_url: string;
  category: string;
  description?: string;
  created_at: string;
  like_count?: number;
}

interface DesignCardProps {
  design: Design;
  showActions?: boolean;
  onDelete?: (id: string) => void;
  onRequestAI?: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  ui_ux: 'bg-electric-blue/90 text-primary-foreground',
  poster: 'bg-lavender/90 text-primary-foreground',
  illustration: 'bg-mint/90 text-primary-foreground',
};

const categoryLabels: Record<string, string> = {
  ui_ux: 'UI/UX',
  poster: 'Poster',
  illustration: 'Illustration',
};

export const DesignCard = ({ design, showActions, onDelete, onRequestAI }: DesignCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative overflow-hidden rounded-2xl bg-card cursor-pointer"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden relative">
        <motion.img
          src={design.image_url}
          alt={design.title}
          className="h-full w-full object-cover"
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
        
        {/* Hover overlay with gradient */}
        <motion.div
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent"
        />

        {/* Hover info */}
        <motion.div
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-4 left-4 right-4"
        >
          <h3 className="font-display font-semibold text-lg text-primary-foreground line-clamp-1">
            {design.title}
          </h3>
          {design.description && (
            <p className="text-sm text-primary-foreground/70 line-clamp-1 mt-1">
              {design.description}
            </p>
          )}
        </motion.div>
      </div>

      {/* Category badge */}
      <motion.div 
        className="absolute top-3 left-3"
        animate={{ scale: isHovered ? 0.9 : 1, opacity: isHovered ? 0.8 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <Badge className={`${categoryColors[design.category]} px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm`}>
          {categoryLabels[design.category]}
        </Badge>
      </motion.div>

      {/* Actions overlay */}
      {showActions && (
        <motion.div
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
          transition={{ duration: 0.2 }}
          className="absolute top-3 right-3 flex gap-1.5"
        >
          {onRequestAI && (
            <Button
              size="icon"
              variant="glass"
              onClick={(e) => { e.stopPropagation(); onRequestAI(design.id); }}
              className="h-8 w-8 rounded-full"
            >
              <Sparkles className="h-3.5 w-3.5" />
            </Button>
          )}
          {onDelete && (
            <Button
              size="icon"
              variant="glass"
              onClick={(e) => { e.stopPropagation(); onDelete(design.id); }}
              className="h-8 w-8 rounded-full hover:bg-destructive/20 hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </motion.div>
      )}

      {/* Bottom bar */}
      <div className="p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Heart className="h-3.5 w-3.5 text-coral" fill="hsl(var(--coral))" />
          <span className="font-medium">{design.like_count || 0}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {new Date(design.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>
    </motion.div>
  );
};
