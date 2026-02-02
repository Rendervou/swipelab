import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Star, Clock, RefreshCw, Check, ArrowLeft, Loader2, 
  MessageCircle, Sparkles, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { toast } from 'sonner';

interface Service {
  id: string;
  designer_id: string;
  title: string;
  description: string;
  category: string;
  basic_price: number | null;
  basic_description: string | null;
  basic_delivery_days: number | null;
  basic_revisions: number | null;
  standard_price: number | null;
  standard_description: string | null;
  standard_delivery_days: number | null;
  standard_revisions: number | null;
  premium_price: number | null;
  premium_description: string | null;
  premium_delivery_days: number | null;
  premium_revisions: number | null;
  portfolio_images: string[];
  faq: Array<{ question: string; answer: string }>;
  views_count: number;
  orders_count: number;
  designer?: {
    id: string;
    name: string;
    avatar_url: string;
    bio: string;
  };
}

interface Testimonial {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  client: {
    name: string;
    avatar_url: string;
  };
}

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'standard' | 'premium'>('basic');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchService();
      incrementViews();
    }
  }, [id]);

  const fetchService = async () => {
    try {
      const { data, error } = await supabase
        .from('designer_services')
        .select(`
          *,
          designer:profiles!designer_id(id, name, avatar_url, bio)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Parse FAQ if it's a string
      const parsedService = {
        ...data,
        faq: typeof data.faq === 'string' ? JSON.parse(data.faq) : data.faq || [],
      };

      setService(parsedService);

      // Fetch testimonials
      const { data: testimonialsData } = await supabase
        .from('service_testimonials')
        .select(`
          *,
          client:profiles!client_id(name, avatar_url)
        `)
        .eq('service_id', id)
        .order('created_at', { ascending: false });

      setTestimonials(testimonialsData || []);
    } catch (error) {
      console.error('Error fetching service:', error);
      toast.error('Failed to load service');
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async () => {
    if (!id) return;
    // View counting can be added later with a database function
  };

  const formatPrice = (price: number | null) => {
    if (!price) return '-';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleContact = () => {
    if (!user) {
      toast.error('Please login to contact the designer');
      navigate('/login');
      return;
    }
    navigate(`/messages?user=${service?.designer_id}`);
  };

  const avgRating = testimonials.length
    ? testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Service not found</h1>
          <Button onClick={() => navigate('/services')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Services
          </Button>
        </div>
      </div>
    );
  }

  const plans = [
    {
      key: 'basic' as const,
      name: t('services.basicPlan'),
      price: service.basic_price,
      description: service.basic_description,
      days: service.basic_delivery_days,
      revisions: service.basic_revisions,
    },
    {
      key: 'standard' as const,
      name: t('services.standardPlan'),
      price: service.standard_price,
      description: service.standard_description,
      days: service.standard_delivery_days,
      revisions: service.standard_revisions,
    },
    {
      key: 'premium' as const,
      name: t('services.premiumPlan'),
      price: service.premium_price,
      description: service.premium_description,
      days: service.premium_delivery_days,
      revisions: service.premium_revisions,
    },
  ].filter(p => p.price);

  const selectedPlanData = plans.find(p => p.key === selectedPlan) || plans[0];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/services')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')}
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <div className="aspect-video bg-muted rounded-xl overflow-hidden">
                {service.portfolio_images?.length > 0 ? (
                  <img
                    src={service.portfolio_images[currentImageIndex]}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Sparkles className="h-20 w-20 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              
              {service.portfolio_images?.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    onClick={() => setCurrentImageIndex(i => 
                      i === 0 ? service.portfolio_images.length - 1 : i - 1
                    )}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    onClick={() => setCurrentImageIndex(i => 
                      i === service.portfolio_images.length - 1 ? 0 : i + 1
                    )}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <div className="flex justify-center gap-2 mt-4">
                    {service.portfolio_images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          idx === currentImageIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </motion.div>

            {/* Title & Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Badge className="mb-3">{t(`category.${service.category}`)}</Badge>
              <h1 className="font-display text-3xl font-bold mb-4">{service.title}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={service.designer?.avatar_url || ''} />
                    <AvatarFallback>{service.designer?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{service.designer?.name}</p>
                    <button 
                      onClick={() => navigate(`/designer/${service.designer_id}`)}
                      className="text-sm text-primary hover:underline"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
                
                {avgRating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-primary text-primary" />
                    <span className="font-medium">{avgRating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({testimonials.length})</span>
                  </div>
                )}
              </div>

              <p className="text-muted-foreground whitespace-pre-wrap">{service.description}</p>
            </motion.div>

            {/* Tabs for FAQ & Testimonials */}
            <Tabs defaultValue="faq" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="faq">{t('services.faq')}</TabsTrigger>
                <TabsTrigger value="testimonials">{t('services.testimonials')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="faq" className="mt-6">
                {service.faq?.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {service.faq.map((item, idx) => (
                      <AccordionItem key={idx} value={`faq-${idx}`}>
                        <AccordionTrigger>{item.question}</AccordionTrigger>
                        <AccordionContent>{item.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No FAQ available</p>
                )}
              </TabsContent>
              
              <TabsContent value="testimonials" className="mt-6 space-y-4">
                {testimonials.length > 0 ? (
                  testimonials.map((testimonial) => (
                    <Card key={testimonial.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage src={testimonial.client?.avatar_url || ''} />
                            <AvatarFallback>{testimonial.client?.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium">{testimonial.client?.name}</p>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < testimonial.rating
                                        ? 'fill-primary text-primary'
                                        : 'text-muted-foreground/30'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-muted-foreground">{testimonial.comment}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">No testimonials yet</p>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Pricing */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24"
            >
              <Card>
                <CardHeader>
                  <div className="flex gap-2 mb-4">
                    {plans.map((plan) => (
                      <Button
                        key={plan.key}
                        variant={selectedPlan === plan.key ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedPlan(plan.key)}
                        className="flex-1"
                      >
                        {plan.name}
                      </Button>
                    ))}
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">
                      {formatPrice(selectedPlanData?.price || null)}
                    </p>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {selectedPlanData?.description || 'No description'}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span>{selectedPlanData?.days} {t('services.days')} delivery</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <RefreshCw className="h-5 w-5 text-muted-foreground" />
                      <span>{selectedPlanData?.revisions} {t('services.revisions')}</span>
                    </div>
                  </div>

                  <Button 
                    variant="gradient" 
                    className="w-full"
                    onClick={handleContact}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {t('services.orderNow')}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServiceDetail;
