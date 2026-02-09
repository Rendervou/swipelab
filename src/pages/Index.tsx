import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown, Sparkles, Zap, TrendingUp } from 'lucide-react';
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

const floatingShapes = [
  { size: 300, x: '10%', y: '20%', color: 'var(--coral)', delay: 0 },
  { size: 200, x: '80%', y: '10%', color: 'var(--lavender)', delay: 1 },
  { size: 250, x: '70%', y: '60%', color: 'var(--electric-blue)', delay: 2 },
  { size: 150, x: '20%', y: '70%', color: 'var(--mint)', delay: 0.5 },
];

const stagger = {
  container: {
    animate: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  },
  item: {
    initial: { opacity: 0, y: 30 },
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
    { value: 'illustration', label: t('category.illustration'), icon: Sparkles },
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
      <section className="relative overflow-hidden border-b">
        {/* Animated floating shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingShapes.map((shape, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-[100px] opacity-[0.08] dark:opacity-[0.12]"
              style={{
                width: shape.size,
                height: shape.size,
                left: shape.x,
                top: shape.y,
                backgroundColor: `hsl(${shape.color})`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, 15, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                delay: shape.delay,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="container relative py-16 md:py-24 lg:py-32">
          <motion.div
            variants={stagger.container}
            initial="initial"
            animate="animate"
            className="text-center max-w-4xl mx-auto"
          >
            {/* Pill badge */}
            <motion.div variants={stagger.item} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                <Sparkles className="h-3.5 w-3.5" />
                {t('hero.itsFree')}
              </span>
            </motion.div>

            <motion.h1 
              variants={stagger.item}
              className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl xl:text-7xl !leading-[1.1]"
            >
              <span className="text-gradient-primary">{t('hero.explorePortfolio')}</span>
            </motion.h1>
            
            <motion.p 
              variants={stagger.item}
              className="mx-auto mt-6 max-w-2xl text-muted-foreground text-lg md:text-xl leading-relaxed"
            >
              {t('hero.exploreDesc')}
            </motion.p>
            
            {!user && (
              <motion.div
                variants={stagger.item}
                className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Link to="/register">
                  <Button variant="gradient" size="xl" className="gap-2 group">
                    {t('common.getStarted')}
                    <motion.span
                      className="inline-block"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.span>
                  </Button>
                </Link>
                <Link to="/feed">
                  <Button variant="outline" size="lg" className="gap-2">
                    {t('hero.exploreMore')}
                  </Button>
                </Link>
              </motion.div>
            )}

            {/* Stats row */}
            <motion.div 
              variants={stagger.item}
              className="mt-14 flex items-center justify-center gap-8 md:gap-16"
            >
              {[
                { value: '1K+', label: 'Designers' },
                { value: '5K+', label: 'Designs' },
                { value: 'AI', label: 'Powered' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-display text-2xl md:text-3xl font-bold text-gradient-primary">{stat.value}</p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="sticky top-14 md:top-16 z-40 bg-background/80 backdrop-blur-xl border-b">
        <div className="container">
          <div className="flex items-center gap-3 py-3 overflow-x-auto scrollbar-hide">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="shrink-0 gap-2 rounded-full">
                  {currentSort}
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {sortOptions.map((option) => (
                  <DropdownMenuItem key={option.value} onClick={() => setSortBy(option.value)}>
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-5 w-px bg-border shrink-0" />

            <div className="flex items-center gap-1.5">
              {categories.map((cat) => (
                <motion.div key={cat.value} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant={activeCategory === cat.value ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveCategory(cat.value)}
                    className={`shrink-0 rounded-full gap-1.5 transition-all duration-300 ${
                      activeCategory === cat.value 
                        ? 'shadow-md' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <cat.icon className="h-3.5 w-3.5" />
                    {cat.label}
                  </Button>
                </motion.div>
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
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
              <Button variant="outline" size="lg" className="gap-2 rounded-full group">
                {t('hero.exploreMore')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 border-t">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-[2rem] bg-gradient-primary p-12 md:p-20 text-center"
            >
              {/* Animated bg elements */}
              <motion.div 
                className="absolute top-0 left-0 h-80 w-80 rounded-full bg-primary-foreground/10 blur-[120px]"
                animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div 
                className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-primary-foreground/10 blur-[120px]"
                animate={{ x: [0, -30, 0], y: [0, -50, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              />
              
              <div className="relative">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-center gap-3 mb-6"
                >
                  <img src={swipelabLogo} alt="SwipeLab" className="h-12 brightness-0 invert opacity-90" />
                  <span className="font-display text-3xl font-bold text-primary-foreground">SwipeLab</span>
                </motion.div>
                <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-5xl !leading-tight">
                  {t('hero.shareWork')}
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80 text-lg">
                  {t('hero.shareWorkDesc')}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/register">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        size="xl" 
                        className="bg-background text-foreground hover:bg-background/90 rounded-full shadow-lg"
                      >
                        {t('hero.createFreeAccount')}
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </motion.div>
                  </Link>
                  <Link to="/login">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 rounded-full"
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
      <footer className="border-t py-12">
        <div className="container flex flex-col items-center justify-between gap-6 md:flex-row">
          <motion.div 
            className="flex items-center gap-2.5"
            whileHover={{ scale: 1.02 }}
          >
            <img src={swipelabLogo} alt="SwipeLab" className="h-8 dark:brightness-110 dark:contrast-110" />
            <span className="font-display text-xl font-bold text-gradient-primary">SwipeLab</span>
          </motion.div>
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
