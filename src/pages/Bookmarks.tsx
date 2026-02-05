import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { DesignCard } from '@/components/design/DesignCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Bookmark, ArrowRight } from 'lucide-react';

interface Design {
  id: string;
  title: string;
  image_url: string;
  category: string;
  description?: string;
  created_at: string;
  like_count?: number;
}

const Bookmarks = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    }
  }, [user]);

  const fetchBookmarks = async () => {
    if (!user) return;

    const { data: bookmarksData, error } = await supabase
      .from('bookmarks')
      .select(`
        design_id,
        designs (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookmarks:', error);
      setLoading(false);
      return;
    }

    // Extract designs and fetch like counts
    const designsWithLikes = await Promise.all(
      (bookmarksData || []).map(async (bookmark: any) => {
        const design = bookmark.designs;
        const { count } = await supabase
          .from('swipes')
          .select('*', { count: 'exact', head: true })
          .eq('design_id', design.id)
          .eq('type', 'like');

        return { ...design, like_count: count || 0 };
      })
    );

    setDesigns(designsWithLikes);
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16 text-center">
          <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h1 className="text-xl font-bold mb-2">{t('bookmarks.signInRequired')}</h1>
          <Link to="/login">
            <Button>{t('auth.signIn')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold mb-2">
            {t('bookmarks.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('bookmarks.description')}
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />
            ))}
          </div>
        ) : designs.length === 0 ? (
          <div className="text-center py-16">
            <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="font-semibold text-lg mb-2">{t('bookmarks.empty')}</h3>
            <p className="text-muted-foreground mb-6">
              {t('bookmarks.emptyDesc')}
            </p>
            <Link to="/">
              <Button variant="gradient" className="gap-2">
                {t('bookmarks.explore')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {designs.map((design, index) => (
              <motion.div
                key={design.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <DesignCard design={design} />
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Bookmarks;
