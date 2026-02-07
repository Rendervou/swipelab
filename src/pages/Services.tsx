import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Search, Plus, Star, Clock, RefreshCw, Loader2, Sparkles } from 'lucide-react';
import swipelabLogo from '@/assets/swipelab-logo.png';

interface Service {
  id: string;
  designer_id: string;
  title: string;
  description: string;
  category: string;
  basic_price: number | null;
  standard_price: number | null;
  premium_price: number | null;
  basic_delivery_days: number | null;
  portfolio_images: string[];
  views_count: number;
  orders_count: number;
  designer?: {
    id: string;
    name: string;
    avatar_url: string;
  };
  avg_rating?: number;
}

const categories = [
  'all',
  'ui_ux_design',
  'graphic_design',
  'illustration',
  'branding',
  'web_design',
  'mobile_design',
  'motion_graphics',
  'other',
];

const Services = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchServices();
  }, [selectedCategory]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('designer_services')
        .select(`
          *,
          designer:profiles!designer_id(id, name, avatar_url)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory as any);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Get average ratings for each service
      const servicesWithRatings = await Promise.all(
        (data || []).map(async (service: any) => {
          const { data: testimonials } = await supabase
            .from('service_testimonials')
            .select('rating')
            .eq('service_id', service.id);

          const avgRating = testimonials?.length
            ? testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length
            : 0;

          return { ...service, avg_rating: avgRating };
        })
      );

      setServices(servicesWithRatings);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((service) =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (price: number | null) => {
    if (!price) return '-';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold">
            {t('services.title')}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            {t('services.description')}
          </p>
          
          {user && (
            <Button 
              variant="gradient" 
              onClick={() => navigate('/services/create')}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              {t('services.createNew')}
            </Button>
          )}
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={t('common.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat === 'all' ? t('common.all') : t(`category.${cat}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredServices.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Sparkles className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold mb-2">{t('services.noServices')}</h3>
            {user && (
              <Button 
                variant="gradient" 
                onClick={() => navigate('/services/create')}
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('services.addService')}
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => navigate(`/services/${service.id}`)}
                >
                  {/* Portfolio Image */}
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {service.portfolio_images?.[0] ? (
                      <img
                        src={service.portfolio_images[0]}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Sparkles className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                    )}
                    <Badge className="absolute top-3 left-3">
                      {t(`category.${service.category}`)}
                    </Badge>
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      {service.avg_rating ? (
                        <div className="flex items-center gap-1 text-sm shrink-0">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span>{service.avg_rating.toFixed(1)}</span>
                        </div>
                      ) : null}
                    </div>
                  </CardHeader>

                  <CardContent className="pb-3">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {service.description}
                    </p>
                    {service.basic_delivery_days && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{service.basic_delivery_days} {t('services.days')}</span>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-3 border-t flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={service.designer?.avatar_url || ''} />
                        <AvatarFallback>
                          {service.designer?.name?.charAt(0) || 'D'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium truncate max-w-[100px]">
                        {service.designer?.name}
                      </span>
                    </div>
                    {service.basic_price && (
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{t('services.startingFrom')}</p>
                        <p className="font-semibold text-primary">
                          {formatPrice(service.basic_price)}
                        </p>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Services;
