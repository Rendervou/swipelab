import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { FollowButton } from '@/components/designer/FollowButton';
import { AvailabilityBadge } from '@/components/designer/AvailabilityBadge';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Search,
  Filter,
  MapPin,
  Users,
  SlidersHorizontal,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Designer {
  id: string;
  name: string | null;
  bio: string | null;
  avatar_url: string | null;
  skills: string[] | null;
  available_for_hire: boolean | null;
  location: string | null;
  followers_count?: number;
  designs_count?: number;
}

const Designers = () => {
  const { t } = useLanguage();
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState('followers');

  useEffect(() => {
    fetchDesigners();
  }, [availableOnly, sortBy]);

  const fetchDesigners = async () => {
    setLoading(true);

    let query = supabase.from('profiles').select('*');

    if (availableOnly) {
      query = query.eq('available_for_hire', true);
    }

    const { data: profilesData, error } = await query;

    if (error) {
      console.error('Error fetching designers:', error);
      setLoading(false);
      return;
    }

    // Fetch additional stats for each designer
    const designersWithStats = await Promise.all(
      (profilesData || []).map(async (profile) => {
        // Followers count
        const { count: followersCount } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('following_id', profile.id);

        // Designs count
        const { count: designsCount } = await supabase
          .from('designs')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', profile.id);

        return {
          ...profile,
          followers_count: followersCount || 0,
          designs_count: designsCount || 0,
        };
      })
    );

    // Sort designers
    const sorted = [...designersWithStats].sort((a, b) => {
      if (sortBy === 'followers') {
        return (b.followers_count || 0) - (a.followers_count || 0);
      } else if (sortBy === 'designs') {
        return (b.designs_count || 0) - (a.designs_count || 0);
      }
      return 0;
    });

    setDesigners(sorted);
    setLoading(false);
  };

  // Filter designers by search query
  const filteredDesigners = designers.filter((designer) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    const nameMatch = designer.name?.toLowerCase().includes(query);
    const bioMatch = designer.bio?.toLowerCase().includes(query);
    const skillsMatch = designer.skills?.some((skill) =>
      skill.toLowerCase().includes(query)
    );
    const locationMatch = designer.location?.toLowerCase().includes(query);

    return nameMatch || bioMatch || skillsMatch || locationMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-3xl font-bold mb-2">
            {t('designers.title').split(' ')[0]} <span className="text-gradient-primary">{t('designers.title').split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {t('designers.desc')}
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('designers.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={availableOnly ? 'default' : 'outline'}
              onClick={() => setAvailableOnly(!availableOnly)}
              className="gap-2"
            >
              <Users className="h-4 w-4" />
              {t('designers.availableForHire')}
            </Button>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="followers">{t('designers.mostFollowers')}</SelectItem>
                <SelectItem value="designs">{t('designers.mostDesigns')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Designers Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-6 rounded-2xl border bg-card">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredDesigners.length === 0 ? (
          <div className="text-center py-16">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="font-semibold mb-2">{t('designers.noFound')}</h3>
            <p className="text-muted-foreground">
              {t('designers.adjustFilters')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDesigners.map((designer, index) => (
              <motion.div
                key={designer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/designer/${designer.id}`}>
                  <div className="p-6 rounded-2xl border bg-card hover:shadow-md transition-shadow group">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16 border-2 border-primary/10 group-hover:border-primary/30 transition-colors">
                        <AvatarImage src={designer.avatar_url || undefined} />
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl font-semibold">
                          {designer.name?.charAt(0).toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-display font-semibold truncate">
                            {designer.name || 'Designer'}
                          </h3>
                          <AvailabilityBadge
                            available={designer.available_for_hire || false}
                          />
                        </div>

                        {designer.bio && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {designer.bio}
                          </p>
                        )}

                        {designer.location && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                            <MapPin className="h-3 w-3" />
                            {designer.location}
                          </p>
                        )}

                        {/* Skills */}
                        {designer.skills && designer.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {designer.skills.slice(0, 3).map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="text-xs px-2 py-0"
                              >
                                {skill}
                              </Badge>
                            ))}
                            {designer.skills.length > 3 && (
                              <Badge
                                variant="secondary"
                                className="text-xs px-2 py-0"
                              >
                                +{designer.skills.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{designer.followers_count} {t('designers.followers')}</span>
                          <span>{designer.designs_count} {t('designers.designs')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Follow button */}
                    <div className="mt-4 flex justify-end" onClick={(e) => e.preventDefault()}>
                      <FollowButton designerId={designer.id} size="sm" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Designers;
