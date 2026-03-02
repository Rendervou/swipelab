import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Heart, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookmarkButton } from '@/components/designer/BookmarkButton';

interface Design {
  id: string;
  title: string;
  image_url: string;
  category: string;
  description?: string;
  created_at: string;
  user_id: string;
  profiles?: {
    name: string | null;
    avatar_url: string | null;
  };
  likes_count?: number;
  views_count?: number;
}

interface DesignGridProps {
  limit?: number;
  category?: string;
}

export const DesignGrid = ({ limit = 12, category }: DesignGridProps) => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    fetchDesigns();
  }, [category, limit]);

  const fetchDesigns = async () => {
    setLoading(true);

    let query = supabase
      .from('designs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (category && category !== 'all') {
      query = query.eq('category', category as any);
    }

    const { data: allDesigns, error } = await query;

    if (error) {
      console.error('Error fetching designs:', error);
      setLoading(false);
      return;
    }

    // Fetch profiles for designs
    const userIds = [...new Set(allDesigns?.map(d => d.user_id) || [])];
    
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, avatar_url')
        .in('id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      // Get like counts for designs
      const designIds = allDesigns?.map(d => d.id) || [];
      const { data: likeCounts } = await supabase
        .from('swipes')
        .select('design_id')
        .in('design_id', designIds)
        .eq('type', 'like');

      const likeCountMap = new Map<string, number>();
      likeCounts?.forEach(s => {
        likeCountMap.set(s.design_id, (likeCountMap.get(s.design_id) || 0) + 1);
      });
      
      const designsWithData = allDesigns?.map(d => ({
        ...d,
        profiles: profileMap.get(d.user_id) || { name: null, avatar_url: null },
        likes_count: likeCountMap.get(d.id) || 0,
        views_count: Math.floor(Math.random() * 5000) + 500, // Placeholder for views
      })) as Design[];
      
      setDesigns(designsWithData);
    } else {
      setDesigns([]);
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[4/3] w-full rounded-xl" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (designs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Belum ada desain untuk ditampilkan.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {designs.map((design, index) => (
        <motion.div
          key={design.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="group"
          onMouseEnter={() => setHoveredId(design.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          {/* Image container */}
          <Link to={`/design/${design.id}`} className="block">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
              <img
                src={design.image_url}
                alt={design.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              
              {/* Overlay on hover */}
              <motion.div
                initial={false}
                animate={{ opacity: hoveredId === design.id ? 1 : 0 }}
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-between p-4"
              >
                <h3 className="text-white font-medium text-sm truncate flex-1 mr-2">
                  {design.title}
                </h3>
                <div className="flex items-center gap-2" onClick={(e) => e.preventDefault()}>
                  <BookmarkButton 
                    designId={design.id}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm text-white"
                  />
                </div>
              </motion.div>
            </div>
          </Link>

          {/* Designer info */}
          <div className="mt-3 flex items-center justify-between">
            <Link to={`/designer/${design.user_id}`} className="flex items-center gap-2 min-w-0 hover:opacity-80">
              <Avatar className="h-7 w-7">
                <AvatarImage src={design.profiles?.avatar_url || undefined} />
                <AvatarFallback className="text-xs bg-secondary">
                  {design.profiles?.name?.charAt(0)?.toUpperCase() || 'D'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground truncate">
                {design.profiles?.name || 'Designer'}
              </span>
            </Link>
            <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
              <span className="flex items-center gap-1">
                <Heart className="h-3.5 w-3.5" />
                {design.likes_count || 0}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {design.views_count?.toLocaleString() || 0}
              </span>
            </div>
          </div>
        </motion.div>

      ))}
    </div>
  );
};
