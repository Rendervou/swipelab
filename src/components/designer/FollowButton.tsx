import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { UserPlus, UserCheck, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FollowButtonProps {
  designerId: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  onFollowChange?: (isFollowing: boolean) => void;
}

export const FollowButton = ({
  designerId,
  className,
  variant = 'outline',
  size = 'default',
  onFollowChange,
}: FollowButtonProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (user && designerId) {
      checkFollowStatus();
    } else {
      setChecking(false);
    }
  }, [user, designerId]);

  const checkFollowStatus = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', designerId)
        .single();

      setIsFollowing(!!data);
    } catch {
      setIsFollowing(false);
    } finally {
      setChecking(false);
    }
  };

  const handleClick = async () => {
    if (!user) {
      toast.error('Please login to follow designers');
      navigate('/login');
      return;
    }

    if (user.id === designerId) {
      toast.error("You can't follow yourself");
      return;
    }

    setLoading(true);

    try {
      if (isFollowing) {
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', designerId);

        if (error) throw error;
        setIsFollowing(false);
        onFollowChange?.(false);
        toast.success('Unfollowed');
      } else {
        const { error } = await supabase.from('follows').insert({
          follower_id: user.id,
          following_id: designerId,
        });

        if (error) throw error;
        setIsFollowing(true);
        onFollowChange?.(true);
        toast.success('Following!');
      }
    } catch (error: any) {
      console.error('Follow error:', error);
      toast.error('Failed to update follow status');
    } finally {
      setLoading(false);
    }
  };

  // Don't show follow button for own profile
  if (user?.id === designerId) return null;

  if (checking) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  return (
    <Button
      variant={isFollowing ? 'secondary' : variant}
      size={size}
      className={className}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        <>
          <UserCheck className="h-4 w-4" />
          {size !== 'icon' && 'Following'}
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          {size !== 'icon' && 'Follow'}
        </>
      )}
    </Button>
  );
};
