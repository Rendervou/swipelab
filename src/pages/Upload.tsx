import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Upload as UploadIcon, Image, Loader2, X, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const uploadSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  category: z.enum(['ui_ux', 'poster', 'illustration']),
  description: z.string().max(500).optional(),
});

type UploadForm = z.infer<typeof uploadSchema>;

const Upload = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<UploadForm>({
    resolver: zodResolver(uploadSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('upload.maxSizeError'));
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: UploadForm) => {
    if (!user || !imageFile) {
      toast.error(t('upload.selectImage'));
      return;
    }

    setLoading(true);

    try {
      // Upload image to storage
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('designs')
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('designs')
        .getPublicUrl(fileName);

      // Create design record
      const { error: insertError } = await supabase.from('designs').insert({
        user_id: user.id,
        title: data.title,
        category: data.category,
        description: data.description || null,
        image_url: publicUrl,
      });

      if (insertError) throw insertError;

      toast.success(t('upload.success'));
      navigate('/dashboard');
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('Upload error:', error);
      }
      toast.error(error.message || t('upload.failed'));
    } finally {
      setLoading(false);
    }
  };

  const categoryValue = watch('category');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4 text-gold" />
              {t('upload.shareWork')}
            </div>
            <h1 className="font-display text-3xl font-bold mb-2">{t('upload.title')}</h1>
            <p className="text-muted-foreground">
              {t('upload.desc')}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Image upload */}
            <div className="space-y-2">
              <Label>{t('upload.designImage')}</Label>
              
              {!imagePreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-2xl p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center">
                      <Image className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">{t('upload.clickUpload')}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('upload.maxSize')}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full aspect-video object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-4 right-4 h-10 w-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">{t('upload.titleLabel')}</Label>
              <Input
                {...register('title')}
                id="title"
                placeholder={t('upload.titlePlaceholder')}
                className="h-12"
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>{t('upload.categoryLabel')}</Label>
              <Select onValueChange={(val: any) => setValue('category', val)} value={categoryValue}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={t('upload.selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ui_ux">{t('category.ui_ux_design')}</SelectItem>
                  <SelectItem value="poster">Poster</SelectItem>
                  <SelectItem value="illustration">{t('category.illustration')}</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">{t('upload.descLabel')} ({t('common.optional')})</Label>
              <Textarea
                {...register('description')}
                id="description"
                placeholder={t('upload.descPlaceholder')}
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              disabled={loading || !imageFile}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <UploadIcon className="h-5 w-5" />
                  {t('upload.submit')}
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default Upload;
