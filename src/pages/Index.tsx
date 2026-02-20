import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown, Sparkles, Zap, TrendingUp, Star } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { DesignGrid } from '@/components/design/DesignGrid';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import swipelabLogo from '@/assets/swipelab-logo.png';

const stagger = {
  container: {
    animate: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
  },
  item: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
  },
};

const Index = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const categories = [
    { value: 'all', label: t('common.all'), icon: Sparkles },
    { value: 'ui_ux', label: 'UI/UX', icon: Zap },
    { value: 'poster', label: 'Poster', icon: TrendingUp },
    { value: 'illustration', label: t('category.illustration'), icon: Star },
  ];

  const sortOptions = [
    { value: 'popular', label: t('sort.popular') },
    { value: 'new', label: t('sort.newNoteworthy') },
    { value: 'following', label: t('sort.following') },
  ];

  const currentSort = sortOptions.find(s => s.value === sortBy)?.label || t('sort.popular');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Subtle ambient glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[120px] opacity-[0.06] dark:opacity-[0.1]"
            style={{ background: 'var(--gradient-primary)' }}
          />
        </div>

        <div className="container relative pt-16 pb-12 md:pt-28 md:pb-20 lg:pt-36 lg:pb-24">
          <motion.div
            variants={stagger.container}
            initial="initial"
            animate="animate"
            className="text-center max-w-3xl mx-auto"
          >
            {/* Pill badge */}
            <motion.div variants={stagger.item} className="mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm font-medium text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                {t('hero.itsFree')}
              </span>
            </motion.div>

            <motion.h1 
              variants={stagger.item}
              className="font-display text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl !leading-[1.05]"
            >
              <span className="text-foreground">{t('hero.explorePortfolio')}</span>
            </motion.h1>
            
            <motion.p 
              variants={stagger.item}
              className="mx-auto mt-6 max-w-xl text-muted-foreground text-lg md:text-xl leading-relaxed"
            >
              {t('hero.exploreDesc')}
            </motion.p>
            
            {!user && (
              <motion.div
                variants={stagger.item}
                className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
              >
                <Link to="/register">
                  <Button variant="gradient" size="xl" className="gap-2 rounded-full">
                    {t('common.getStarted')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/feed">
                  <Button variant="glass" size="lg" className="gap-2 rounded-full">
                    {t('hero.exploreMore')}
                  </Button>
                </Link>
              </motion.div>
            )}

            {/* Stats */}
            <motion.div 
              variants={stagger.item}
              className="mt-16 inline-flex items-center gap-6 md:gap-10 glass rounded-2xl px-8 py-4"
            >
              {[
                { value: '1K+', label: 'Designers' },
                { value: '5K+', label: 'Designs' },
                { value: 'AI', label: 'Powered' },
              ].map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-6 md:gap-10">
                  <div className="text-center">
                    <p className="font-display text-xl md:text-2xl font-extrabold text-gradient-primary">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                  </div>
                  {i < 2 && <div className="h-8 w-px bg-border" />}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="sticky top-14 md:top-16 z-40 glass-subtle border-y border-border/50">
        <div className="container">
          <div className="flex items-center gap-3 py-3 overflow-x-auto scrollbar-hide">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="shrink-0 gap-2 rounded-full border-border/60">
                  {currentSort}
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-xl">
                {sortOptions.map((option) => (
                  <DropdownMenuItem key={option.value} onClick={() => setSortBy(option.value)}>
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-5 w-px bg-border/60 shrink-0" />

            <div className="flex items-center gap-1">
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  variant={activeCategory === cat.value ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveCategory(cat.value)}
                  className={`shrink-0 rounded-full gap-1.5 text-sm transition-all ${
                    activeCategory === cat.value ? '' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <cat.icon className="h-3.5 w-3.5" />
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Design Grid */}
      <section className="py-12 md:py-16">
        <div className="container">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              <DesignGrid category={activeCategory} limit={16} />
            </motion.div>
          </AnimatePresence>
          
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link to="/feed">
              <Button variant="outline" size="lg" className="gap-2 rounded-full border-border/60 group">
                {t('hero.exploreMore')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-3xl bg-gradient-primary p-12 md:p-20 text-center"
            >
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(0_0%_100%/0.1),_transparent_60%)]" />
              
              <div className="relative">
                <div className="flex items-center justify-center gap-3 mb-8">
                  <img src={swipelabLogo} alt="SwipeLab" className="h-10 brightness-0 invert opacity-80" />
                  <span className="font-display text-2xl font-bold text-primary-foreground/90">SwipeLab</span>
                </div>
                <h2 className="font-display text-3xl font-extrabold text-primary-foreground md:text-5xl !leading-tight">
                  {t('hero.shareWork')}
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-primary-foreground/70 text-lg">
                  {t('hero.shareWorkDesc')}
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link to="/register">
                    <Button 
                      size="xl" 
                      className="bg-background text-foreground hover:bg-background/90 rounded-full shadow-lg gap-2"
                    >
                      {t('hero.createFreeAccount')}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 rounded-full"
                    >
                      {t('auth.signIn')}
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border/50 py-10">
        <div className="container flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2.5">
            <img src={swipelabLogo} alt="SwipeLab" className="h-7 dark:brightness-110 dark:contrast-110" />
            <span className="font-display text-lg font-bold text-gradient-primary">SwipeLab</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/feed" className="hover:text-foreground transition-colors">{t('nav.explore')}</Link>
            <Link to="/designers" className="hover:text-foreground transition-colors">{t('nav.designers')}</Link>
            <Link to="/services" className="hover:text-foreground transition-colors">{t('nav.services')}</Link>
          </div>
          <p className="text-sm text-muted-foreground">
            {t('hero.footer').replace('{year}', new Date().getFullYear().toString())}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
