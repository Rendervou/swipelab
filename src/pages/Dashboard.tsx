import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { DesignCard } from '@/components/design/DesignCard';
import { StatCard } from '@/components/stats/StatCard';
import { AIFeedbackCard } from '@/components/ai/AIFeedbackCard';
import { FeedbackSummary } from '@/components/dashboard/FeedbackSummary';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Heart, Eye, Sparkles, Image, Loader2, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface Design {
  id: string;
  title: string;
  image_url: string;
  category: string;
  description?: string;
  created_at: string;
  like_count?: number;
}

interface AIFeedback {
  id: string;
  design_id: string;
  strengths: string[];
  weaknesses: string[];
  ux_score: number;
  suggestion: string;
  designs?: { title: string };
}

interface DesignFeedbackSummary {
  design_id: string;
  design_title: string;
  design_image: string;
  total_reviews: number;
  avg_visual_clarity: number;
  avg_layout_hierarchy: number;
  avg_color_harmony: number;
  avg_creativity: number;
  comments: Array<{ comment: string; created_at: string }>;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [aiFeedbacks, setAiFeedbacks] = useState<AIFeedback[]>([]);
  const [feedbackSummaries, setFeedbackSummaries] = useState<DesignFeedbackSummary[]>([]);
  const [stats, setStats] = useState({
    totalDesigns: 0,
    totalLikes: 0,
    totalSwipes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    setLoading(true);

    // Fetch user's designs
    const { data: designsData } = await supabase
      .from('designs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Get like counts for each design
    if (designsData) {
      const designsWithLikes = await Promise.all(
        designsData.map(async (design) => {
          const { count } = await supabase
            .from('swipes')
            .select('*', { count: 'exact', head: true })
            .eq('design_id', design.id)
            .eq('type', 'like');
          
          return { ...design, like_count: count || 0 };
        })
      );
      setDesigns(designsWithLikes);
    }

    // Fetch AI feedbacks
    const { data: feedbacksData } = await supabase
      .from('ai_feedback')
      .select(`
        *,
        designs!inner (title, user_id)
      `)
      .eq('designs.user_id', user.id)
      .order('created_at', { ascending: false });

    if (feedbacksData) {
      const formattedFeedbacks = feedbacksData.map(fb => ({
        ...fb,
        strengths: Array.isArray(fb.strengths) ? fb.strengths : [],
        weaknesses: Array.isArray(fb.weaknesses) ? fb.weaknesses : [],
      }));
      setAiFeedbacks(formattedFeedbacks as any);
    }

    // Fetch community feedback for user's designs
    if (designsData && designsData.length > 0) {
      const designIds = designsData.map(d => d.id);
      const { data: feedbackData } = await supabase
        .from('design_feedback')
        .select('*')
        .in('design_id', designIds)
        .order('created_at', { ascending: false });

      if (feedbackData) {
        // Aggregate feedback by design
        const feedbackByDesign = new Map<string, DesignFeedbackSummary>();
        
        designsData.forEach(design => {
          const designFeedback = feedbackData.filter(f => f.design_id === design.id);
          if (designFeedback.length > 0) {
            const avgVisualClarity = designFeedback.reduce((sum, f) => sum + f.visual_clarity, 0) / designFeedback.length;
            const avgLayoutHierarchy = designFeedback.reduce((sum, f) => sum + f.layout_hierarchy, 0) / designFeedback.length;
            const avgColorHarmony = designFeedback.reduce((sum, f) => sum + f.color_harmony, 0) / designFeedback.length;
            const avgCreativity = designFeedback.reduce((sum, f) => sum + f.creativity, 0) / designFeedback.length;
            const comments = designFeedback
              .filter(f => f.comment)
              .map(f => ({ comment: f.comment!, created_at: f.created_at }));

            feedbackByDesign.set(design.id, {
              design_id: design.id,
              design_title: design.title,
              design_image: design.image_url,
              total_reviews: designFeedback.length,
              avg_visual_clarity: avgVisualClarity,
              avg_layout_hierarchy: avgLayoutHierarchy,
              avg_color_harmony: avgColorHarmony,
              avg_creativity: avgCreativity,
              comments,
            });
          }
        });

        setFeedbackSummaries(Array.from(feedbackByDesign.values()));
      }
    }

    // Calculate stats
    const { count: totalLikes } = await supabase
      .from('swipes')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'like')
      .in('design_id', (designsData || []).map(d => d.id));

    const { count: totalSwipes } = await supabase
      .from('swipes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    setStats({
      totalDesigns: designsData?.length || 0,
      totalLikes: totalLikes || 0,
      totalSwipes: totalSwipes || 0,
    });

    setLoading(false);
  };

  const handleDeleteDesign = async (designId: string) => {
    if (!confirm(t('common.delete') + '?')) return;

    const { error } = await supabase
      .from('designs')
      .delete()
      .eq('id', designId);

    if (error) {
      toast.error('Failed to delete design');
    } else {
      toast.success('Design deleted');
      setDesigns(prev => prev.filter(d => d.id !== designId));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
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
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            {t('dashboard.tagline')} <span className="text-gradient-primary">{t('hero.poweredBy')}</span>
          </h1>
          <p className="text-muted-foreground mb-8 max-w-xl">
            {t('dashboard.desc')}
          </p>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <StatCard
              label={t('dashboard.totalDesigns')}
              value={stats.totalDesigns}
              icon={Image}
              color="lavender"
              delay={0}
            />
            <StatCard
              label={t('dashboard.likesReceived')}
              value={stats.totalLikes}
              icon={Heart}
              color="coral"
              delay={0.1}
            />
            <StatCard
              label={t('dashboard.designsSwiped')}
              value={stats.totalSwipes}
              icon={Eye}
              color="mint"
              delay={0.2}
            />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="designs" className="space-y-6">
            <TabsList className="grid w-full max-w-2xl grid-cols-3">
              <TabsTrigger value="designs" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                {t('dashboard.myDesigns')}
              </TabsTrigger>
              <TabsTrigger value="community-feedback" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                {t('dashboard.communityFeedback')}
              </TabsTrigger>
              <TabsTrigger value="ai-feedback" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                {t('dashboard.aiFeedback')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="designs">
              {designs.length === 0 ? (
                <div className="text-center py-16 rounded-2xl border-2 border-dashed">
                  <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display text-xl font-semibold mb-2">{t('dashboard.noDesigns')}</h3>
                  <p className="text-muted-foreground mb-6">
                    {t('dashboard.uploadFirst')}
                  </p>
                  <Link to="/upload">
                    <Button variant="gradient">
                      <Upload className="h-4 w-4" />
                      {t('upload.submit')}
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {designs.map((design) => (
                    <DesignCard
                      key={design.id}
                      design={design}
                      showActions
                      onDelete={handleDeleteDesign}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="community-feedback">
              <FeedbackSummary feedbackData={feedbackSummaries} />
            </TabsContent>

            <TabsContent value="ai-feedback">
              {aiFeedbacks.length === 0 ? (
                <div className="text-center py-16 rounded-2xl border-2 border-dashed">
                  <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display text-xl font-semibold mb-2">{t('dashboard.noAiFeedback')}</h3>
                  <p className="text-muted-foreground mb-6">
                    {t('dashboard.requestAi')}
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {aiFeedbacks.map((feedback) => (
                    <AIFeedbackCard
                      key={feedback.id}
                      feedback={feedback}
                      designTitle={(feedback.designs as any)?.title}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
