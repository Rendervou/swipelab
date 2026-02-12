import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Compass } from 'lucide-react';
import swipelabLogo from '@/assets/swipelab-logo.png';

const NotFound = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background shapes */}
      <motion.div
        className="absolute top-20 left-[10%] h-72 w-72 rounded-full bg-primary/5 blur-[100px]"
        animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 right-[10%] h-96 w-96 rounded-full bg-lavender/5 blur-[100px]"
        animate={{ y: [0, 20, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative text-center px-6 max-w-md"
      >
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <img src={swipelabLogo} alt="SwipeLab" className="h-10 dark:brightness-110 dark:contrast-110" />
          <span className="font-display text-2xl font-bold text-gradient-primary">SwipeLab</span>
        </Link>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="font-display text-8xl font-bold text-gradient-primary mb-4">404</h1>
        </motion.div>

        <h2 className="font-display text-2xl font-bold mb-3">{t('notFound.title')}</h2>
        <p className="text-muted-foreground mb-8">{t('notFound.description')}</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/">
            <Button variant="gradient" size="lg" className="gap-2 rounded-full">
              <ArrowLeft className="h-4 w-4" />
              {t('common.backToHome')}
            </Button>
          </Link>
          <Link to="/feed">
            <Button variant="outline" size="lg" className="gap-2 rounded-full">
              <Compass className="h-4 w-4" />
              {t('nav.explore')}
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
