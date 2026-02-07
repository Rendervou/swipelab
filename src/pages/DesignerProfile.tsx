import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { DesignCard } from '@/components/design/DesignCard';
import { FollowButton } from '@/components/designer/FollowButton';
import { AvailabilityBadge } from '@/components/designer/AvailabilityBadge';
import { HireRequestModal } from '@/components/designer/HireRequestModal';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  MapPin,
  DollarSign,
  Image,
  MessageCircle,
  Briefcase,
} from 'lucide-react';

interface DesignerProfileData {
  id: string;
  name: string | null;
  bio: string | null;
  avatar_url: string | null;
  skills: string[] | null;
  available_for_hire: boolean | null;
  hourly_rate: string | null;
  location: string | null;
}

interface Design {
  id: string;
  title: string;
  image_url: string;
  category: string;
  description?: string;
  created_at: string;
  like_count?: number;
}

const DesignerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [profile, setProfile] = useState<DesignerProfileData | null>(null);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    followers: 0,
    following: 0,
    likes: 0,
  });
  const [hireModalOpen, setHireModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProfile();
      fetchDesigns();
      fetchStats();
    }
  }, [id]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
    } else {
      setProfile(data);
    }
    setLoading(false);
  };

  const fetchDesigns = async () => {
    const { data: designsData } = await supabase
      .from('designs')
      .select('*')
      .eq('user_id', id)
      .order('created_at', { ascending: false });

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
  };

  const fetchStats = async () => {
    if (!id) return;

    const { count: followersCount } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', id);

    const { count: followingCount } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', id);

    const { data: userDesigns } = await supabase
      .from('designs')
      .select('id')
      .eq('user_id', id);

    let totalLikes = 0;
    if (userDesigns) {
      for (const design of userDesigns) {
        const { count } = await supabase
          .from('swipes')
          .select('*', { count: 'exact', head: true })
          .eq('design_id', design.id)
          .eq('type', 'like');
        totalLikes += count || 0;
      }
    }

    setStats({
      followers: followersCount || 0,
      following: followingCount || 0,
      likes: totalLikes,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <Skeleton className="h-40 w-40 rounded-full" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full max-w-md" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">{t('designerProfile.notFound')}</h1>
          <Link to="/">
            <Button>{t('common.backToHome')}</Button>
          </Link>
        </main>
      </div>
    );
  }

  const isOwnProfile = user?.id === id;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 md:py-12">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-8 mb-12"
        >
          <div className="flex-shrink-0">
            <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-primary/20">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-4xl font-semibold">
                {profile.name?.charAt(0).toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-start gap-3">
              <h1 className="font-display text-3xl font-bold">
                {profile.name || 'Designer'}
              </h1>
              <AvailabilityBadge
                available={profile.available_for_hire || false}
                size="md"
              />
            </div>

            {profile.bio && (
              <p className="text-muted-foreground max-w-2xl">{profile.bio}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {profile.location}
                </span>
              )}
              {profile.hourly_rate && (
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {profile.hourly_rate}/hr
                </span>
              )}
            </div>

            {profile.skills && profile.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center gap-6 pt-2">
              <div className="text-center">
                <p className="font-display text-xl font-bold">{stats.followers}</p>
                <p className="text-xs text-muted-foreground">{t('designerProfile.followers')}</p>
              </div>
              <div className="text-center">
                <p className="font-display text-xl font-bold">{stats.following}</p>
                <p className="text-xs text-muted-foreground">{t('designerProfile.following')}</p>
              </div>
              <div className="text-center">
                <p className="font-display text-xl font-bold">{stats.likes}</p>
                <p className="text-xs text-muted-foreground">{t('designerProfile.likes')}</p>
              </div>
              <div className="text-center">
                <p className="font-display text-xl font-bold">{designs.length}</p>
                <p className="text-xs text-muted-foreground">{t('designerProfile.designs')}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {isOwnProfile ? (
                <Link to="/profile">
                  <Button variant="outline">{t('designerProfile.editProfile')}</Button>
                </Link>
              ) : (
                <>
                  <FollowButton designerId={id!} />
                  {profile.available_for_hire && (
                    <Button
                      variant="gradient"
                      onClick={() => setHireModalOpen(true)}
                    >
                      <Briefcase className="h-4 w-4" />
                      {t('designerProfile.hireMe')}
                    </Button>
                  )}
                  <Link to={`/messages?user=${id}`}>
                    <Button variant="outline">
                      <MessageCircle className="h-4 w-4" />
                      {t('designerProfile.message')}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Designs */}
        <section>
          <h2 className="font-display text-xl font-semibold mb-6">
            {t('designerProfile.designCount').replace('{count}', String(designs.length))}
          </h2>

          {designs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t('designerProfile.noDesigns')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {designs.map((design) => (
                <DesignCard key={design.id} design={design} />
              ))}
            </div>
          )}
        </section>
      </main>

      <HireRequestModal
        open={hireModalOpen}
        onOpenChange={setHireModalOpen}
        designerId={id!}
        designerName={profile.name || 'Designer'}
      />
    </div>
  );
};

export default DesignerProfile;
