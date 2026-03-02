import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Eye, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/layout/Header';
import { AnnotationCanvas } from '@/components/annotations/AnnotationCanvas';
import { AnnotationPanel } from '@/components/annotations/AnnotationPanel';
import { BookmarkButton } from '@/components/designer/BookmarkButton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface DesignData {
  id: string;
  title: string;
  image_url: string;
  category: string;
  description: string | null;
  created_at: string;
  user_id: string;
}

interface ProfileData {
  name: string | null;
  avatar_url: string | null;
}

interface Annotation {
  id: string;
  annotation_type: 'pin' | 'box';
  x_percent: number;
  y_percent: number;
  width_percent: number | null;
  height_percent: number | null;
  comment: string;
  visibility: 'public' | 'private';
  created_at: string;
  user_id: string;
  profile?: ProfileData;
}

const categoryLabels: Record<string, string> = {
  ui_ux: 'UI/UX',
  poster: 'Poster',
  illustration: 'Illustration',
};

const DesignDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [design, setDesign] = useState<DesignData | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [likesCount, setLikesCount] = useState(0);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);
  const [annotationMode, setAnnotationMode] = useState<'view' | 'pin' | 'box'>('view');

  useEffect(() => {
    if (id) {
      fetchDesign();
      fetchAnnotations();
    }
  }, [id]);

  const fetchDesign = async () => {
    if (!id) return;
    setLoading(true);

    const { data: designData, error } = await supabase
      .from('designs')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !designData) {
      setLoading(false);
      return;
    }

    setDesign(designData);

    // Fetch profile & likes in parallel
    const [profileRes, likesRes] = await Promise.all([
      supabase.from('profiles').select('name, avatar_url').eq('id', designData.user_id).single(),
      supabase.from('swipes').select('id', { count: 'exact', head: true }).eq('design_id', id).eq('type', 'like'),
    ]);

    if (profileRes.data) setProfile(profileRes.data);
    setLikesCount(likesRes.count || 0);
    setLoading(false);
  };

  const fetchAnnotations = async () => {
    if (!id) return;
    const { data } = await supabase
      .from('design_annotations')
      .select('*')
      .eq('design_id', id)
      .order('created_at', { ascending: true });

    if (data) {
      // Fetch profiles for annotations
      const userIds = [...new Set(data.map((a: any) => a.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, avatar_url')
        .in('id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      setAnnotations(
        data.map((a: any) => ({
          ...a,
          profile: profileMap.get(a.user_id) || { name: null, avatar_url: null },
        }))
      );
    }
  };

  const handleAddAnnotation = async (annotation: {
    type: 'pin' | 'box';
    x: number;
    y: number;
    width?: number;
    height?: number;
    comment: string;
    visibility: 'public' | 'private';
  }) => {
    if (!user || !id) return;

    const { error } = await supabase.from('design_annotations').insert({
      design_id: id,
      user_id: user.id,
      annotation_type: annotation.type,
      x_percent: annotation.x,
      y_percent: annotation.y,
      width_percent: annotation.width || null,
      height_percent: annotation.height || null,
      comment: annotation.comment,
      visibility: annotation.visibility,
    });

    if (!error) {
      fetchAnnotations();
      setAnnotationMode('view');
    }
  };

  const handleDeleteAnnotation = async (annotationId: string) => {
    const { error } = await supabase
      .from('design_annotations')
      .delete()
      .eq('id', annotationId);

    if (!error) {
      setAnnotations(prev => prev.filter(a => a.id !== annotationId));
      if (selectedAnnotation === annotationId) setSelectedAnnotation(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
            </div>
            <Skeleton className="h-96 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!design) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-display font-bold">{t('common.notFound')}</h1>
          <Link to="/">
            <Button variant="outline" className="mt-4 rounded-full">
              {t('common.backToHome')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-6 md:py-8">
        {/* Back + title */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-xl md:text-2xl font-bold truncate">{design.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <Badge variant="secondary" className="text-xs">
                {categoryLabels[design.category] || design.category}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {new Date(design.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BookmarkButton designId={design.id} />
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Heart className="h-4 w-4" />
              {likesCount}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Canvas area */}
          <div className="lg:col-span-2">
            <AnnotationCanvas
              imageUrl={design.image_url}
              annotations={annotations}
              mode={annotationMode}
              selectedAnnotation={selectedAnnotation}
              onSelectAnnotation={setSelectedAnnotation}
              onAddAnnotation={handleAddAnnotation}
              isAuthenticated={!!user}
            />
          </div>

          {/* Side panel */}
          <div className="space-y-6">
            {/* Designer info */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-5"
            >
              <Link to={`/designer/${design.user_id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <Avatar className="h-11 w-11">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {profile?.name?.charAt(0)?.toUpperCase() || 'D'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{profile?.name || 'Designer'}</p>
                  <p className="text-xs text-muted-foreground">Lihat profil</p>
                </div>
              </Link>
              {design.description && (
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  {design.description}
                </p>
              )}
            </motion.div>

            {/* Annotation panel */}
            <AnnotationPanel
              annotations={annotations}
              annotationMode={annotationMode}
              onSetMode={setAnnotationMode}
              selectedAnnotation={selectedAnnotation}
              onSelectAnnotation={setSelectedAnnotation}
              onDeleteAnnotation={handleDeleteAnnotation}
              isAuthenticated={!!user}
              currentUserId={user?.id}
              designOwnerId={design.user_id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignDetail;
