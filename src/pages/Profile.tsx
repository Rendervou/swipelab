import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Camera, Loader2, Save, X, Plus, MapPin, DollarSign, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import swipelabLogo from '@/assets/swipelab-logo.png';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  bio: z.string().max(300).optional(),
  location: z.string().max(100).optional(),
  hourly_rate: z.string().max(20).optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

const Profile = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [availableForHire, setAvailableForHire] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      setValue('name', data.name || '');
      setValue('bio', data.bio || '');
      setValue('location', data.location || '');
      setValue('hourly_rate', data.hourly_rate || '');
      setAvatarUrl(data.avatar_url);
      setSkills(data.skills || []);
      setAvailableForHire(data.available_for_hire || false);
    }

    setLoading(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Avatar must be less than 2MB');
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const urlWithTimestamp = `${publicUrl}?t=${Date.now()}`;

      await supabase
        .from('profiles')
        .update({ avatar_url: urlWithTimestamp })
        .eq('id', user.id);

      setAvatarUrl(urlWithTimestamp);
      toast.success('Avatar updated!');
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('Avatar upload error:', error);
      }
      toast.error('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const addSkill = () => {
    const skill = newSkill.trim();
    if (skill && !skills.includes(skill) && skills.length < 10) {
      setSkills([...skills, skill]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const onSubmit = async (data: ProfileForm) => {
    if (!user) return;

    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        name: data.name,
        bio: data.bio || null,
        location: data.location || null,
        hourly_rate: data.hourly_rate || null,
        skills,
        available_for_hire: availableForHire,
      })
      .eq('id', user.id);

    setSaving(false);

    if (error) {
      toast.error('Failed to update profile');
    } else {
      toast.success('Profile updated!');
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
          className="max-w-2xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-6">
            <img 
              src={swipelabLogo} 
              alt="SwipeLab" 
              className="h-8 dark:brightness-110 dark:contrast-110" 
            />
            <div>
              <h1 className="font-display text-3xl font-bold">
                {t('profile.yourProfile').split(' ')[0]} <span className="text-gradient-primary">{t('profile.yourProfile').split(' ').slice(1).join(' ')}</span>
              </h1>
              <p className="text-muted-foreground">
                {t('profile.showCommunity')}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-primary/20">
                  <AvatarImage src={avatarUrl || undefined} />
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl font-semibold">
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {uploading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Camera className="h-5 w-5" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <div>
                <p className="font-medium">{t('profile.photo')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('profile.photoDesc')}
                </p>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">{t('profile.displayName')}</Label>
              <Input
                {...register('name')}
                id="name"
                placeholder={t('auth.namePlaceholder')}
                className="h-12"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">{t('profile.bio')}</Label>
              <Textarea
                {...register('bio')}
                id="bio"
                placeholder={t('profile.bioPlaceholder')}
                rows={4}
              />
              {errors.bio && (
                <p className="text-sm text-destructive">{errors.bio.message}</p>
              )}
            </div>

            {/* Availability for Hire */}
            <div className="p-4 rounded-xl bg-secondary/50 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">{t('profile.availableForHire')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('profile.availableDesc')}
                  </p>
                </div>
                <Switch
                  checked={availableForHire}
                  onCheckedChange={setAvailableForHire}
                />
              </div>

              {availableForHire && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {t('profile.location')}
                    </Label>
                    <Input
                      {...register('location')}
                      id="location"
                      placeholder="e.g., Jakarta, Indonesia"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hourly_rate" className="flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5" />
                      {t('profile.hourlyRate')}
                    </Label>
                    <Input
                      {...register('hourly_rate')}
                      id="hourly_rate"
                      placeholder="e.g., 50"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <Label>{t('profile.skills')}</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="px-3 py-1 text-sm flex items-center gap-1"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder={t('profile.addSkill')}
                  className="h-10"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSkill}
                  disabled={!newSkill.trim() || skills.length >= 10}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {skills.length}/10 {t('profile.skills').toLowerCase()}
              </p>
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  {t('profile.saveChanges')}
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
