import { motion } from 'framer-motion';
import { Heart, Eye, Sparkles, Trash2 } from 'lucide-react';
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
  ui_ux: 'bg-electric-blue text-primary-foreground',
  poster: 'bg-lavender text-primary-foreground',
  illustration: 'bg-mint text-primary-foreground',
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative overflow-hidden rounded-2xl bg-card shadow-card"
    >
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={design.image_url}
          alt={design.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent"
        />
      </div>

      {/* Category badge */}
      <div className="absolute top-4 left-4">
        <Badge className={`${categoryColors[design.category]} px-3 py-1`}>
          {categoryLabels[design.category]}
        </Badge>
      </div>

      {/* Actions overlay */}
      {showActions && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute top-4 right-4 flex gap-2"
        >
          {onRequestAI && (
            <Button
              size="icon"
              variant="glass"
              onClick={() => onRequestAI(design.id)}
              className="h-9 w-9"
            >
              <Sparkles className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              size="icon"
              variant="glass"
              onClick={() => onDelete(design.id)}
              className="h-9 w-9 hover:bg-destructive/20 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </motion.div>
      )}

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-lg mb-2 line-clamp-1">
          {design.title}
        </h3>
        
        {design.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {design.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Heart className="h-4 w-4 text-coral" fill="currentColor" />
              {design.like_count || 0}
            </span>
          </div>
          
          <span>
            {new Date(design.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
