import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Upload, LayoutDashboard, User, LogOut, Menu, X, Wand2, Users, MessageCircle, Bookmark, Compass, ShoppingBag, Settings, Search, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import swipelabLogo from '@/assets/swipelab-logo.png';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { LanguageSelector } from '@/components/language/LanguageSelector';

export const Header = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    if (user) fetchUnreadCount();
  }, [user]);

  const fetchUnreadCount = async () => {
    if (!user) return;
    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', user.id)
      .eq('read', false);
    setUnreadMessages(count || 0);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Nav items for desktop nav bar (excluding upload/messages which get dedicated buttons)
  const navItems = [
    { href: '/feed', label: t('nav.explore'), icon: Compass },
    { href: '/designers', label: t('nav.designers'), icon: Users },
    { href: '/services', label: t('nav.services'), icon: ShoppingBag },
    { href: '/ai-assistant', label: t('nav.aiAssistant'), icon: Wand2 },
    { href: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
  ];

  // Mobile nav includes all items
  const mobileNavItems = [
    { href: '/feed', label: t('nav.explore'), icon: Compass },
    { href: '/designers', label: t('nav.designers'), icon: Users },
    { href: '/services', label: t('nav.services'), icon: ShoppingBag },
    { href: '/ai-assistant', label: t('nav.aiAssistant'), icon: Wand2 },
    { href: '/upload', label: t('nav.upload'), icon: Upload },
    { href: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full glass-subtle border-b border-border/40">
      <div className="container flex h-14 md:h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <img 
            src={swipelabLogo} 
            alt="SwipeLab" 
            className="h-7 md:h-8 dark:brightness-110 dark:contrast-110"
          />
          <span className="font-display text-lg md:text-xl font-bold text-gradient-primary hidden sm:inline">
            SwipeLab
          </span>
        </Link>

        {/* Desktop Navigation */}
        {user && (
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive(item.href) ? 'secondary' : 'ghost'}
                  size="sm"
                  className={`gap-1.5 text-sm rounded-full transition-colors ${
                    isActive(item.href) ? '' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-1 md:gap-1.5">
          <LanguageSelector variant="minimal" />
          <ThemeToggle />

          {user ? (
            <TooltipProvider delayDuration={300}>
              <div className="flex items-center gap-0.5 md:gap-1">
                {/* Quick Action: Search/Explore */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isActive('/feed') ? 'secondary' : 'ghost'}
                      size="icon"
                      className="h-9 w-9 rounded-full lg:hidden"
                      onClick={() => navigate('/feed')}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t('nav.explore')}</TooltipContent>
                </Tooltip>

                {/* Quick Action: Upload — always visible, highlighted */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isActive('/upload') ? 'secondary' : 'ghost'}
                      size="icon"
                      className={`h-9 w-9 rounded-full relative ${
                        !isActive('/upload') ? 'text-primary hover:bg-primary/10' : ''
                      }`}
                      onClick={() => navigate('/upload')}
                    >
                      <Plus className="h-[18px] w-[18px]" strokeWidth={2.5} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t('nav.upload')}</TooltipContent>
                </Tooltip>

                {/* Quick Action: Messages — always visible with badge */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isActive('/messages') ? 'secondary' : 'ghost'}
                      size="icon"
                      className="h-9 w-9 rounded-full relative"
                      onClick={() => navigate('/messages')}
                    >
                      <MessageCircle className="h-4 w-4" />
                      {unreadMessages > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold"
                        >
                          {unreadMessages > 9 ? '9+' : unreadMessages}
                        </motion.span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t('nav.messages')}</TooltipContent>
                </Tooltip>

                {/* Divider */}
                <div className="h-5 w-px bg-border/60 mx-0.5 hidden md:block" />

                {/* Avatar dropdown — account/settings only */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 md:h-9 md:w-9 rounded-full p-0">
                      <Avatar className="h-8 w-8 md:h-9 md:w-9 ring-2 ring-border transition-all hover:ring-primary/30">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-xl p-1">
                    <div className="px-3 py-3 border-b border-border/50">
                      <p className="font-medium text-sm truncate">{user.user_metadata?.name || user.email}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <DropdownMenuItem onClick={() => navigate(`/designer/${user.id}`)} className="cursor-pointer rounded-lg text-sm">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        {t('nav.myProfile')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer rounded-lg text-sm">
                        <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                        {t('nav.editProfile')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/bookmarks')} className="cursor-pointer rounded-lg text-sm">
                        <Bookmark className="mr-2 h-4 w-4 text-muted-foreground" />
                        {t('nav.savedDesigns')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer rounded-lg text-sm">
                        <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground" />
                        {t('nav.dashboard')}
                      </DropdownMenuItem>
                    </div>
                    <DropdownMenuSeparator />
                    <div className="py-1">
                      <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer rounded-lg text-sm">
                        <LogOut className="mr-2 h-4 w-4" />
                        {t('nav.logout')}
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile menu toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden h-8 w-8"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={mobileMenuOpen ? 'close' : 'open'}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </motion.div>
                  </AnimatePresence>
                </Button>
              </div>
            </TooltipProvider>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground hover:text-foreground">{t('auth.signIn')}</Button>
              </Link>
              <Link to="/register">
                <Button variant="gradient" size="sm" className="rounded-full">{t('common.getStarted')}</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {user && mobileMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden border-t border-border/40 overflow-hidden"
          >
            <div className="container py-3 flex flex-col gap-0.5">
              {mobileNavItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive(item.href) ? 'secondary' : 'ghost'}
                      className={`w-full justify-start rounded-xl text-sm ${
                        !isActive(item.href) ? 'text-muted-foreground' : ''
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};
