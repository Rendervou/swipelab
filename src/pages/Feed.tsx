import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { SwipeCard } from '@/components/swipe/SwipeCard';
import { EmptyFeed } from '@/components/swipe/EmptyFeed';
import { FeedbackModal } from '@/components/swipe/FeedbackModal';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Filter, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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

interface FeedbackCriteria {
  id: string;
  label: string;
  question: string;
  value: number;
}

const categories = [
  { value: 'all', label: 'All' },
  { value: 'ui_ux', label: 'UI/UX' },
  { value: 'poster', label: 'Poster' },
  { value: 'illustration', label: 'Illustration' },
];

const GUEST_SWIPE_LIMIT = 5;
const GUEST_SWIPE_KEY = 'guest_swipe_count';

const Feed = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [guestSwipeCount, setGuestSwipeCount] = useState(0);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [pendingSkipDesign, setPendingSkipDesign] = useState<Design | null>(null);

  // Load guest swipe count from localStorage
  useEffect(() => {
    if (!user) {
      const savedCount = localStorage.getItem(GUEST_SWIPE_KEY);
      if (savedCount) {
        setGuestSwipeCount(parseInt(savedCount, 10));
      }
    }
  }, [user]);

  useEffect(() => {
    fetchDesigns();
  }, [user, filter]);

  const fetchDesigns = async () => {
    setLoading(true);

    // Build query for designs
    let query = supabase
      .from('designs')
      .select('*')
      .order('created_at', { ascending: false });

    // If logged in, exclude user's own designs
    if (user) {
      query = query.neq('user_id', user.id);
    }

    if (filter !== 'all') {
      query = query.eq('category', filter as any);
    }

    const { data: allDesigns, error: designsError } = await query;

    if (designsError) {
      if (import.meta.env.DEV) {
        console.error('Error fetching designs:', designsError);
      }
      setLoading(false);
      return;
    }

    let unseenDesigns = allDesigns || [];

    // If logged in, filter out already swiped designs
    if (user) {
      const { data: swipes } = await supabase
        .from('swipes')
        .select('design_id')
        .eq('user_id', user.id);

      const swipedIds = new Set(swipes?.map(s => s.design_id) || []);
      unseenDesigns = unseenDesigns.filter(d => !swipedIds.has(d.id));
    }

    // Fetch profiles for these designs
    const userIds = [...new Set(unseenDesigns.map(d => d.user_id))];
    
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, avatar_url')
        .in('id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
      
      const designsWithProfiles = unseenDesigns.map(d => ({
        ...d,
        profiles: profileMap.get(d.user_id) || { name: null, avatar_url: null }
      })) as Design[];
      
      setDesigns(designsWithProfiles);
    } else {
      setDesigns([]);
    }
    
    setLoading(false);
  };

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (designs.length === 0) return;

    const currentDesign = designs[0];

    // Guest user handling
    if (!user) {
      const newCount = guestSwipeCount + 1;
      
      // Check if guest has reached swipe limit
      if (newCount > GUEST_SWIPE_LIMIT) {
        setShowLoginDialog(true);
        return;
      }

      // Update guest swipe count
      setGuestSwipeCount(newCount);
      localStorage.setItem(GUEST_SWIPE_KEY, newCount.toString());

      // Optimistically remove from UI
      setDesigns(prev => prev.slice(1));

      if (direction === 'right') {
        toast.success('Liked! 💜');
      }

      // Show login prompt when reaching the limit
      if (newCount === GUEST_SWIPE_LIMIT) {
        setTimeout(() => {
          setShowLoginDialog(true);
        }, 500);
      }
      return;
    }

    // Authenticated user handling
    if (direction === 'left') {
      // Show feedback modal for skip
      setPendingSkipDesign(currentDesign);
      setShowFeedbackModal(true);
      return;
    }

    // Handle right swipe (like)
    setDesigns(prev => prev.slice(1));
    const { error } = await supabase.from('swipes').insert({
      user_id: user.id,
      design_id: currentDesign.id,
      type: 'like',
    });

    if (error) {
      if (import.meta.env.DEV) {
        console.error('Error recording swipe:', error);
      }
      toast.error('Failed to record swipe');
      setDesigns(prev => [currentDesign, ...prev]);
    } else {
      toast.success('Liked! 💜');
    }
  };

  const handleFeedbackSubmit = async (feedback: { criteria: FeedbackCriteria[]; comment: string }) => {
    if (!pendingSkipDesign || !user) return;

    // Find criteria values
    const visualClarity = feedback.criteria.find(c => c.id === 'visual_clarity')?.value || 3;
    const layoutHierarchy = feedback.criteria.find(c => c.id === 'layout_hierarchy')?.value || 3;
    const colorHarmony = feedback.criteria.find(c => c.id === 'color_harmony')?.value || 3;
    const creativity = feedback.criteria.find(c => c.id === 'creativity')?.value || 3;

    // Insert feedback
    const { error: feedbackError } = await supabase.from('design_feedback').insert({
      design_id: pendingSkipDesign.id,
      user_id: user.id,
      visual_clarity: visualClarity,
      layout_hierarchy: layoutHierarchy,
      color_harmony: colorHarmony,
      creativity: creativity,
      comment: feedback.comment || null,
    });

    if (feedbackError) {
      if (import.meta.env.DEV) {
        console.error('Error submitting feedback:', feedbackError);
      }
      toast.error('Failed to submit feedback');
    } else {
      toast.success('Thanks for your feedback! 📝');
    }

    // Record skip swipe
    await supabase.from('swipes').insert({
      user_id: user.id,
      design_id: pendingSkipDesign.id,
      type: 'skip',
    });

    // Remove from UI
    setDesigns(prev => prev.filter(d => d.id !== pendingSkipDesign.id));
    setShowFeedbackModal(false);
    setPendingSkipDesign(null);
  };

  const handleFeedbackClose = async () => {
    if (!pendingSkipDesign || !user) {
      setShowFeedbackModal(false);
      setPendingSkipDesign(null);
      return;
    }

    // Record skip without feedback
    await supabase.from('swipes').insert({
      user_id: user.id,
      design_id: pendingSkipDesign.id,
      type: 'skip',
    });

    // Remove from UI
    setDesigns(prev => prev.filter(d => d.id !== pendingSkipDesign.id));
    setShowFeedbackModal(false);
    setPendingSkipDesign(null);
  };

  const remainingGuestSwipes = GUEST_SWIPE_LIMIT - guestSwipeCount;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6 md:py-12">
        {/* Guest banner */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-lg bg-primary/10 border border-primary/20 p-4"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="font-medium text-foreground">
                  👋 Kamu sedang melihat sebagai tamu
                </p>
                <p className="text-sm text-muted-foreground">
                  {remainingGuestSwipes > 0 
                    ? `Sisa ${remainingGuestSwipes} swipe gratis. Login untuk swipe tanpa batas!`
                    : 'Kamu sudah mencapai batas swipe. Login untuk melanjutkan!'
                  }
                </p>
              </div>
              <Button onClick={() => navigate('/login')} size="sm">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            </div>
          </motion.div>
        )}

        {/* Filter bar */}
        <div className="mb-8 flex items-center gap-4 overflow-x-auto pb-2">
          <Filter className="h-5 w-5 text-muted-foreground shrink-0" />
          <div className="flex gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={filter === cat.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(cat.value)}
                className="shrink-0"
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Card stack */}
        <div className="flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading designs...</p>
            </div>
          ) : designs.length === 0 ? (
            <EmptyFeed 
              hasFilter={filter !== 'all'} 
              onClearFilter={() => setFilter('all')} 
            />
          ) : (
            <div className="relative h-[65vh] w-full max-w-md">
              {/* Background cards */}
              {designs.slice(1, 3).map((design, index) => (
                <SwipeCard
                  key={design.id}
                  design={design}
                  onSwipe={() => {}}
                  isTop={false}
                />
              ))}
              
              {/* Top card */}
              <SwipeCard
                key={designs[0].id}
                design={designs[0]}
                onSwipe={handleSwipe}
                isTop={true}
              />
            </div>
          )}
        </div>

        {/* Stats */}
        {designs.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-24 text-sm text-muted-foreground"
          >
            {designs.length} design{designs.length !== 1 ? 's' : ''} left to explore
          </motion.p>
        )}
      </main>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>🎉 Kamu suka design-design ini!</DialogTitle>
            <DialogDescription>
              Kamu sudah swipe {GUEST_SWIPE_LIMIT} design. Untuk melanjutkan melihat dan menyimpan design favoritmu, silakan login atau buat akun gratis.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowLoginDialog(false)}>
              Nanti saja
            </Button>
            <Button onClick={() => navigate('/register')}>
              Daftar Gratis
            </Button>
            <Button variant="secondary" onClick={() => navigate('/login')}>
              Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback Modal */}
      {pendingSkipDesign && (
        <FeedbackModal
          open={showFeedbackModal}
          onClose={handleFeedbackClose}
          design={pendingSkipDesign}
          onSubmit={handleFeedbackSubmit}
        />
      )}
    </div>
  );
};

export default Feed;
