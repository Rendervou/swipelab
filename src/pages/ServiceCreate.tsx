import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { ArrowLeft, Loader2, Plus, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import swipelabLogo from '@/assets/swipelab-logo.png';

const serviceSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(50, 'Description must be at least 50 characters').max(2000),
  category: z.string().min(1, 'Please select a category'),
  basic_price: z.number().min(10000, 'Minimum price is Rp 10,000').optional(),
  basic_description: z.string().max(500).optional(),
  basic_delivery_days: z.number().min(1).max(365).optional(),
  basic_revisions: z.number().min(0).max(99).optional(),
  standard_price: z.number().min(10000).optional(),
  standard_description: z.string().max(500).optional(),
  standard_delivery_days: z.number().min(1).max(365).optional(),
  standard_revisions: z.number().min(0).max(99).optional(),
  premium_price: z.number().min(10000).optional(),
  premium_description: z.string().max(500).optional(),
  premium_delivery_days: z.number().min(1).max(365).optional(),
  premium_revisions: z.number().min(0).max(99).optional(),
});

type ServiceForm = z.infer<typeof serviceSchema>;

interface FAQItem {
  question: string;
  answer: string;
}

const categories = [
  'ui_ux_design',
  'graphic_design',
  'illustration',
  'branding',
  'web_design',
  'mobile_design',
  'motion_graphics',
  'other',
];

const ServiceCreate = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [faqItems, setFaqItems] = useState<FAQItem[]>([{ question: '', answer: '' }]);
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ServiceForm>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      basic_revisions: 1,
      standard_revisions: 2,
      premium_revisions: 5,
      basic_delivery_days: 7,
      standard_delivery_days: 5,
      premium_delivery_days: 3,
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !user) return;
    
    setUploadingImage(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('designs')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('designs')
        .getPublicUrl(fileName);

      setPortfolioImages(prev => [...prev, publicUrl]);
      toast.success('Image uploaded');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setPortfolioImages(prev => prev.filter((_, i) => i !== index));
  };

  const addFaqItem = () => {
    setFaqItems(prev => [...prev, { question: '', answer: '' }]);
  };

  const removeFaqItem = (index: number) => {
    setFaqItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateFaqItem = (index: number, field: 'question' | 'answer', value: string) => {
    setFaqItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const onSubmit = async (data: ServiceForm) => {
    if (!user) {
      toast.error('Please login first');
      return;
    }

    // Validate at least basic plan
    if (!data.basic_price) {
      toast.error('Please set at least a Basic plan price');
      return;
    }

    setLoading(true);

    try {
      const validFaq = faqItems.filter(item => item.question.trim() && item.answer.trim());

      const { error } = await supabase.from('designer_services').insert({
        designer_id: user.id,
        title: data.title,
        description: data.description,
        category: data.category as any,
        basic_price: data.basic_price,
        basic_description: data.basic_description || null,
        basic_delivery_days: data.basic_delivery_days,
        basic_revisions: data.basic_revisions,
        standard_price: data.standard_price || null,
        standard_description: data.standard_description || null,
        standard_delivery_days: data.standard_delivery_days || null,
        standard_revisions: data.standard_revisions || null,
        premium_price: data.premium_price || null,
        premium_description: data.premium_description || null,
        premium_delivery_days: data.premium_delivery_days || null,
        premium_revisions: data.premium_revisions || null,
        portfolio_images: portfolioImages,
        faq: validFaq as any,
      });

      if (error) throw error;

      toast.success('Service created successfully!');
      navigate('/services');
    } catch (error: any) {
      console.error('Error creating service:', error);
      toast.error(error.message || 'Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Please login first</h1>
          <Button onClick={() => navigate('/login')}>Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/services')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')}
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <img 
              src={swipelabLogo} 
              alt="SwipeLab" 
              className="h-8 dark:brightness-110 dark:contrast-110" 
            />
            <h1 className="font-display text-3xl font-bold">
              {t('services.createNew')}
            </h1>
          </div>
          <p className="text-muted-foreground">
            Buat jasa desain dan mulai dapatkan klien
          </p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t('services.serviceTitle')} *</Label>
                <Input
                  {...register('title')}
                  id="title"
                  placeholder="e.g., Professional UI/UX Design for Mobile Apps"
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">{t('services.category')} *</Label>
                <Select onValueChange={(value) => setValue('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {t(`category.${cat}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t('services.serviceDescription')} *</Label>
                <Textarea
                  {...register('description')}
                  id="description"
                  placeholder="Describe your service in detail..."
                  rows={5}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Images */}
          <Card>
            <CardHeader>
              <CardTitle>{t('services.portfolio')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {portfolioImages.map((url, idx) => (
                  <div key={idx} className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                <label className="aspect-video bg-muted rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                  {uploadingImage ? (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <ImageIcon className="h-6 w-6 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Add Image</span>
                    </>
                  )}
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Tiers */}
          <Card>
            <CardHeader>
              <CardTitle>Paket Harga</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Basic */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-semibold text-center">{t('services.basicPlan')} *</h3>
                  <div className="space-y-2">
                    <Label>Harga (Rp)</Label>
                    <Input
                      type="number"
                      {...register('basic_price', { valueAsNumber: true })}
                      placeholder="100000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Deskripsi</Label>
                    <Textarea
                      {...register('basic_description')}
                      placeholder="What's included..."
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Hari</Label>
                      <Input
                        type="number"
                        {...register('basic_delivery_days', { valueAsNumber: true })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Revisi</Label>
                      <Input
                        type="number"
                        {...register('basic_revisions', { valueAsNumber: true })}
                      />
                    </div>
                  </div>
                </div>

                {/* Standard */}
                <div className="space-y-4 p-4 border rounded-lg border-primary">
                  <h3 className="font-semibold text-center text-primary">{t('services.standardPlan')}</h3>
                  <div className="space-y-2">
                    <Label>Harga (Rp)</Label>
                    <Input
                      type="number"
                      {...register('standard_price', { valueAsNumber: true })}
                      placeholder="250000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Deskripsi</Label>
                    <Textarea
                      {...register('standard_description')}
                      placeholder="What's included..."
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Hari</Label>
                      <Input
                        type="number"
                        {...register('standard_delivery_days', { valueAsNumber: true })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Revisi</Label>
                      <Input
                        type="number"
                        {...register('standard_revisions', { valueAsNumber: true })}
                      />
                    </div>
                  </div>
                </div>

                {/* Premium */}
                <div className="space-y-4 p-4 border rounded-lg bg-gradient-to-br from-primary/5 to-primary/10">
                  <h3 className="font-semibold text-center">{t('services.premiumPlan')}</h3>
                  <div className="space-y-2">
                    <Label>Harga (Rp)</Label>
                    <Input
                      type="number"
                      {...register('premium_price', { valueAsNumber: true })}
                      placeholder="500000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Deskripsi</Label>
                    <Textarea
                      {...register('premium_description')}
                      placeholder="What's included..."
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Hari</Label>
                      <Input
                        type="number"
                        {...register('premium_delivery_days', { valueAsNumber: true })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Revisi</Label>
                      <Input
                        type="number"
                        {...register('premium_revisions', { valueAsNumber: true })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t('services.faq')}</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addFaqItem}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqItems.map((item, idx) => (
                <div key={idx} className="space-y-2 p-4 border rounded-lg relative">
                  {faqItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFaqItem(idx)}
                      className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <div>
                    <Label>Question</Label>
                    <Input
                      value={item.question}
                      onChange={(e) => updateFaqItem(idx, 'question', e.target.value)}
                      placeholder="e.g., What file formats do you deliver?"
                    />
                  </div>
                  <div>
                    <Label>Answer</Label>
                    <Textarea
                      value={item.answer}
                      onChange={(e) => updateFaqItem(idx, 'answer', e.target.value)}
                      placeholder="Your answer..."
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/services')}
              disabled={loading}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" variant="gradient" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('common.create')}
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ServiceCreate;
