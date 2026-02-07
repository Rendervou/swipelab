import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShoppingBag, Plus, ExternalLink } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  category: string;
  basic_price: number | null;
  is_active: boolean | null;
  orders_count: number | null;
  views_count: number | null;
}

export const MyServicesSection = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchServices();
    }
  }, [user]);

  const fetchServices = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('designer_services')
      .select('id, title, category, basic_price, is_active, orders_count, views_count')
      .eq('designer_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setServices(data);
    }
    setLoading(false);
  };

  const getCategoryLabel = (category: string) => {
    return t(`category.${category}`) || category.replace(/_/g, ' ');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="grid gap-3">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-primary" />
          {t('profile.myServices')}
        </h2>
        <Link to="/services/create">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            {t('services.addService')}
          </Button>
        </Link>
      </div>

      {services.length === 0 ? (
        <Card className="p-6 text-center">
          <ShoppingBag className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-muted-foreground mb-2">
            {t('profile.noServices')}
          </p>
          <p className="text-sm text-muted-foreground/70 mb-4">
            {t('profile.createFirstService')}
          </p>
          <Link to="/services/create">
            <Button variant="gradient" size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              {t('services.createNew')}
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{service.title}</h3>
                      {service.is_active ? (
                        <Badge variant="default" className="text-xs">
                          {t('common.active')}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          {t('common.draft')}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getCategoryLabel(service.category)}
                      {service.basic_price && (
                        <span className="ml-2">
                          • Rp {service.basic_price.toLocaleString('id-ID')}+
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{service.views_count || 0} {t('common.views')}</span>
                      <span>{service.orders_count || 0} {t('common.orders')}</span>
                    </div>
                  </div>
                  <Link to={`/services/${service.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
          
          <div className="pt-2">
            <Link to="/services" className="text-sm text-primary hover:underline">
              {t('profile.manageServices')} →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
