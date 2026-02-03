import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Filter, ChevronDown } from 'lucide-react';
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
  const [sortBy, setSortBy] = useState('Popular');

  const categories = [
    { value: 'all', label: t('common.explore') },
    { value: 'ui_ux', label: 'UI/UX' },
    { value: 'poster', label: 'Poster' },
    { value: 'illustration', label: t('category.illustration') },
  ];

  const navCategories = [
    'Animation', 'Branding', 'Illustration', 'Mobile', 'Print', 
    'Product Design', 'Typography', 'Web Design'
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section - Compact */}
      <section className="border-b bg-gradient-to-b from-secondary/30 to-background">
        <div className="container py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              {t('hero.explorePortfolio').split('design portfolio')[0]}
              <span className="text-gradient-primary">design portfolio</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground md:text-lg">
              {t('hero.exploreDesc')}
            </p>
            
            {!user && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 flex items-center justify-center gap-3"
              >
                <Link to="/register">
                  <Button variant="gradient" size="lg">
                    {t('common.getStarted')} — it's free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container">
          <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
            {/* Sort dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="shrink-0 gap-2">
                  {sortBy}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy('Popular')}>
                  Popular
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('New & Noteworthy')}>
                  New & Noteworthy
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('Following')}>
                  Following
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-6 w-px bg-border shrink-0" />

            {/* Category tabs */}
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
              
              {/* Additional category links (hidden on mobile) */}
              <div className="hidden lg:flex items-center gap-1 ml-2">
                {navCategories.slice(0, 4).map((cat) => (
                  <Button
                    key={cat}
                    variant="ghost"
                    size="sm"
                    className="shrink-0 text-muted-foreground hover:text-foreground"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Filters button */}
            <Button variant="outline" className="ml-auto shrink-0 gap-2">
              <Filter className="h-4 w-4" />
              {t('common.filter')}
            </Button>
          </div>
        </div>
      </section>

      {/* Design Grid */}
      <section className="py-8 md:py-12">
        <div className="container">
          <DesignGrid category={activeCategory} limit={16} />
          
          {/* Load More */}
          <div className="mt-12 text-center">
            <Link to="/feed">
              <Button variant="outline" size="lg" className="gap-2">
                {t('common.explore')} more designs
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section for non-logged in users */}
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
                  <span className="font-display text-2xl font-bold text-white">SwipeLab</span>
                </div>
                <h2 className="font-display text-2xl font-bold text-white md:text-4xl">
                  {t('hero.shareWork')}
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-white/80">
                  {t('hero.shareWorkDesc')}
                </p>
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link to="/register">
                    <Button 
                      size="lg" 
                      className="bg-white text-foreground hover:bg-white/90"
                    >
                      {t('hero.createFreeAccount')}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="border-white/30 text-white hover:bg-white/10"
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
            © 2024 SwipeLab. Made with ❤️ for designers.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
