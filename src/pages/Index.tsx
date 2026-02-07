import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown } from 'lucide-react';
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

const Index = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const categories = [
    { value: 'all', label: t('common.all') },
    { value: 'ui_ux', label: 'UI/UX' },
    { value: 'poster', label: 'Poster' },
    { value: 'illustration', label: t('category.illustration') },
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
      <section className="border-b bg-gradient-to-b from-secondary/30 to-background">
        <div className="container py-10 md:py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              {t('hero.explorePortfolio')}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground md:text-lg">
              {t('hero.exploreDesc')}
            </p>
            
            {!user && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6"
              >
                <Link to="/register">
                  <Button variant="gradient" size="lg" className="gap-2">
                    {t('common.getStarted')} {t('hero.itsFree')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="sticky top-14 md:top-16 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container">
          <div className="flex items-center gap-3 py-3 overflow-x-auto scrollbar-hide">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="shrink-0 gap-2">
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

            <div className="flex items-center gap-1">
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  variant={activeCategory === cat.value ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveCategory(cat.value)}
                  className="shrink-0"
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Design Grid */}
      <section className="py-8 md:py-12">
        <div className="container">
          <DesignGrid category={activeCategory} limit={16} />
          
          <div className="mt-12 text-center">
            <Link to="/feed">
              <Button variant="outline" size="lg" className="gap-2">
                {t('hero.exploreMore')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-16 border-t">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl bg-gradient-primary p-10 md:p-16 text-center"
            >
              <div className="absolute top-0 left-0 h-64 w-64 rounded-full bg-primary-foreground/10 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-primary-foreground/10 blur-3xl" />
              
              <div className="relative">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <img src={swipelabLogo} alt="SwipeLab" className="h-10 brightness-0 invert opacity-90" />
                  <span className="font-display text-2xl font-bold text-primary-foreground">SwipeLab</span>
                </div>
                <h2 className="font-display text-2xl font-bold text-primary-foreground md:text-4xl">
                  {t('hero.shareWork')}
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
                  {t('hero.shareWorkDesc')}
                </p>
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link to="/register">
                    <Button 
                      size="lg" 
                      className="bg-background text-foreground hover:bg-background/90"
                    >
                      {t('hero.createFreeAccount')}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
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
      <footer className="border-t py-10">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <img src={swipelabLogo} alt="SwipeLab" className="h-8 dark:brightness-110 dark:contrast-110" />
            <span className="font-display text-lg font-bold text-gradient-primary">SwipeLab</span>
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
