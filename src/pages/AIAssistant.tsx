import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Sparkles, 
  Palette, 
  LayoutGrid, 
  Lightbulb, 
  Wand2, 
  Upload, 
  Send,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { AIGeneralResult } from '@/components/ai/AIGeneralResult';
import { AIColorsResult } from '@/components/ai/AIColorsResult';
import { AILayoutResult } from '@/components/ai/AILayoutResult';
import { AIVariationsResult } from '@/components/ai/AIVariationsResult';

type AnalysisType = 'general' | 'colors' | 'layout' | 'variations';

interface FeatureCard {
  type: AnalysisType;
  title: string;
  description: string;
  icon: typeof Sparkles;
  color: string;
}

const AIAssistant = () => {
  const { t } = useLanguage();
  const [selectedTab, setSelectedTab] = useState<AnalysisType>('general');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [currentAnalysisType, setCurrentAnalysisType] = useState<AnalysisType | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const featureCards: FeatureCard[] = [
    {
      type: 'colors',
      title: t('ai.analyzeColors'),
      description: t('ai.analyzeColorsDesc'),
      icon: Palette,
      color: 'bg-lavender/20 text-lavender',
    },
    {
      type: 'layout',
      title: t('ai.layoutReview'),
      description: t('ai.layoutReviewDesc'),
      icon: LayoutGrid,
      color: 'bg-electric-blue/20 text-electric-blue',
    },
    {
      type: 'general',
      title: t('ai.improvements'),
      description: t('ai.improvementsDesc'),
      icon: Lightbulb,
      color: 'bg-gold/20 text-gold',
    },
    {
      type: 'variations',
      title: t('ai.variations'),
      description: t('ai.variationsDesc'),
      icon: Wand2,
      color: 'bg-mint/20 text-mint',
    },
  ];

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error(t('ai.imageOnly'));
      return;
    }

    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target?.result as string);
      setUploadedImage('pending');
      setAnalysisResult(null);
    };
    reader.readAsDataURL(file);
  };

  const analyzeDesign = async (type: AnalysisType) => {
    if (!uploadedFile) {
      toast.error(t('ai.uploadFirst'));
      return;
    }

    setIsAnalyzing(true);
    setCurrentAnalysisType(type);
    setSelectedTab(type);

    try {
      // Upload image to storage first to get a public URL
      const fileExt = uploadedFile.name.split('.').pop();
      const fileName = `ai-analysis/${crypto.randomUUID()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('designs')
        .upload(fileName, uploadedFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('designs')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;
      setUploadedImage(publicUrl);

      const { data, error } = await supabase.functions.invoke('analyze-design', {
        body: {
          imageUrl: publicUrl,
          analysisType: type,
          customPrompt: customPrompt || undefined,
        },
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setAnalysisResult(data.result);
      toast.success(t('ai.analysisComplete'));
    } catch (error) {
      if (import.meta.env.DEV) console.error('Analysis error:', error);
      toast.error(t('ai.analysisFailed'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = () => {
    analyzeDesign(selectedTab);
  };

  const renderResult = () => {
    if (!analysisResult || !currentAnalysisType) return null;

    switch (currentAnalysisType) {
      case 'general':
        return <AIGeneralResult result={analysisResult} />;
      case 'colors':
        return <AIColorsResult result={analysisResult} />;
      case 'layout':
        return <AILayoutResult result={analysisResult} />;
      case 'variations':
        return <AIVariationsResult result={analysisResult} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 md:py-12 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-secondary mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            {t('ai.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('ai.description')}
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          {featureCards.map((card, index) => (
            <Card
              key={card.type}
              className={`p-4 cursor-pointer transition-all hover:scale-[1.02] ${
                isAnalyzing && currentAnalysisType === card.type 
                  ? 'ring-2 ring-primary' 
                  : ''
              }`}
              onClick={() => analyzeDesign(card.type)}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="flex items-center gap-3"
              >
                <div className={`p-2 rounded-lg ${card.color}`}>
                  <card.icon className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-sm">{card.title}</h3>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                </div>
              </motion.div>
            </Card>
          ))}
        </motion.div>

        {/* Upload Area */}
        <AnimatePresence mode="wait">
          {!previewUrl ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <p className="text-muted-foreground mb-4">
                {t('ai.uploadPrompt')}
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-8"
            >
              <Card className="p-4">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <img 
                    src={previewUrl} 
                    alt="Uploaded design" 
                    className="w-full h-full object-contain"
                  />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">{t('ai.analyzing')}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {analysisResult && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              {renderResult()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4">
            <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as AnalysisType)}>
              <TabsList className="grid w-full grid-cols-4 mb-4">
                <TabsTrigger value="general" className="text-xs sm:text-sm">
                  <Lightbulb className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">General</span>
                </TabsTrigger>
                <TabsTrigger value="colors" className="text-xs sm:text-sm">
                  <Palette className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Colors</span>
                </TabsTrigger>
                <TabsTrigger value="layout" className="text-xs sm:text-sm">
                  <LayoutGrid className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Layout</span>
                </TabsTrigger>
                <TabsTrigger value="variations" className="text-xs sm:text-sm">
                  <Wand2 className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Variations</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0"
              >
                {previewUrl ? <ImageIcon className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
              </Button>
              <Input
                placeholder={t('ai.inputPlaceholder')}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="flex-1"
              />
              <Button
                variant="gradient"
                size="icon"
                onClick={handleSubmit}
                disabled={!uploadedFile || isAnalyzing}
                className="shrink-0"
              >
                {isAnalyzing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default AIAssistant;
