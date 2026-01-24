import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Bookmark, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
  designId: string;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  onBookmarkChange?: (isBookmarked: boolean) => void;
}

export const BookmarkButton = ({
  designId,
  className,
  size = 'icon',
  onBookmarkChange,
}: BookmarkButtonProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (user && designId) {
      checkBookmarkStatus();
    } else {
      setChecking(false);
    }
  }, [user, designId]);

  const checkBookmarkStatus = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('design_id', designId)
        .single();

      setIsBookmarked(!!data);
    } catch {
      setIsBookmarked(false);
    } finally {
      setChecking(false);
    }
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please login to save designs');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      if (isBookmarked) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('design_id', designId);

        if (error) throw error;
        setIsBookmarked(false);
        onBookmarkChange?.(false);
        toast.success('Removed from saved');
      } else {
        const { error } = await supabase.from('bookmarks').insert({
          user_id: user.id,
          design_id: designId,
        });

        if (error) throw error;
        setIsBookmarked(true);
        onBookmarkChange?.(true);
        toast.success('Saved!');
      }
    } catch (error: any) {
      console.error('Bookmark error:', error);
      toast.error('Failed to update bookmark');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <Button variant="ghost" size={size} className={className} disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size={size}
      className={cn(
        'transition-colors',
        isBookmarked && 'text-primary',
        className
      )}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Bookmark
          className={cn('h-4 w-4', isBookmarked && 'fill-current')}
        />
      )}
    </Button>
  );
};
