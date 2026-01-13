import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { SwipeCard } from '@/components/swipe/SwipeCard';
import { EmptyFeed } from '@/components/swipe/EmptyFeed';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Filter } from 'lucide-react';
import { toast } from 'sonner';

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

const categories = [
  { value: 'all', label: 'All' },
  { value: 'ui_ux', label: 'UI/UX' },
  { value: 'poster', label: 'Poster' },
  { value: 'illustration', label: 'Illustration' },
];

const Feed = () => {
  const { user } = useAuth();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchDesigns();
  }, [user, filter]);

  const fetchDesigns = async () => {
    if (!user) return;

    setLoading(true);

    // Get designs the user hasn't swiped on
    let query = supabase
      .from('designs')
      .select('*')
      .neq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('category', filter as any);
    }

    const { data: allDesigns, error: designsError } = await query;

    if (designsError) {
      console.error('Error fetching designs:', designsError);
      setLoading(false);
      return;
    }

    // Get user's swipes
    const { data: swipes } = await supabase
      .from('swipes')
      .select('design_id')
      .eq('user_id', user.id);

    const swipedIds = new Set(swipes?.map(s => s.design_id) || []);
    
    // Filter out already swiped designs and fetch profiles
    const unseenDesigns = (allDesigns || []).filter(d => !swipedIds.has(d.id));
    
    // Fetch profiles for these designs
    const userIds = [...new Set(unseenDesigns.map(d => d.user_id))];
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
    setLoading(false);
  };

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (!user || designs.length === 0) return;

    const currentDesign = designs[0];
    const swipeType = direction === 'right' ? 'like' : 'skip';

    // Optimistically remove from UI
    setDesigns(prev => prev.slice(1));

    // Record the swipe
    const { error } = await supabase.from('swipes').insert({
      user_id: user.id,
      design_id: currentDesign.id,
      type: swipeType,
    });

    if (error) {
      console.error('Error recording swipe:', error);
      toast.error('Failed to record swipe');
      // Restore the card if failed
      setDesigns(prev => [currentDesign, ...prev]);
    } else if (direction === 'right') {
      toast.success('Liked! 💜');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6 md:py-12">
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
    </div>
  );
};

export default Feed;
