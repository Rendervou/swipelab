import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AvailabilityBadgeProps {
  available: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const AvailabilityBadge = ({ 
  available, 
  className,
  size = 'sm' 
}: AvailabilityBadgeProps) => {
  if (!available) return null;

  return (
    <Badge
      className={cn(
        'bg-mint/20 text-mint border-mint/30 hover:bg-mint/30',
        size === 'sm' && 'text-xs px-2 py-0.5',
        size === 'md' && 'text-sm px-3 py-1',
        className
      )}
      variant="outline"
    >
      <span className="w-2 h-2 rounded-full bg-mint mr-1.5 animate-pulse" />
      Available for Hire
    </Badge>
  );
};
