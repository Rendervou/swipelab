import { Link, useNavigate, useLocation } from 'react-router-dom';
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
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Upload, LayoutDashboard, User, LogOut, Menu, X, Wand2, Users, MessageCircle, Bookmark, Compass, ShoppingBag, Settings } from 'lucide-react';
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
    if (user) {
      fetchUnreadCount();
    }
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

  const navItems = [
    { href: '/feed', label: t('nav.explore'), icon: Compass },
    { href: '/designers', label: t('nav.designers'), icon: Users },
    { href: '/services', label: t('nav.services'), icon: ShoppingBag },
    { href: '/ai-assistant', label: t('nav.aiAssistant'), icon: Wand2 },
    { href: '/upload', label: t('nav.upload'), icon: Upload },
    { href: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 md:h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
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
                  className={`gap-1.5 text-sm ${isActive(item.href) ? 'bg-secondary' : ''}`}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-1.5 md:gap-2">
          <LanguageSelector variant="minimal" />
          <ThemeToggle />
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 md:h-9 md:w-9 rounded-full p-0">
                    <Avatar className="h-8 w-8 md:h-9 md:w-9 border-2 border-primary/20">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold text-sm">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {unreadMessages > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-medium">
                        {unreadMessages > 9 ? '9+' : unreadMessages}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60">
                  <div className="px-3 py-3 border-b">
                    <p className="font-medium truncate">{user.user_metadata?.name || user.email}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <div className="p-1">
                    <DropdownMenuItem onClick={() => navigate(`/designer/${user.id}`)} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    {t('nav.myProfile')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                    {t('nav.editProfile')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/messages')} className="cursor-pointer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {t('nav.messages')}
                    {unreadMessages > 0 && (
                        <Badge variant="destructive" className="ml-auto h-5 px-1.5 text-[10px]">
                        {unreadMessages}
                        </Badge>
                    )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/bookmarks')} className="cursor-pointer">
                    <Bookmark className="mr-2 h-4 w-4" />
                    {t('nav.savedDesigns')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {t('nav.dashboard')}
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="p-1">
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
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
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link to="/login">
                <Button variant="ghost" size="sm">{t('auth.signIn')}</Button>
              </Link>
              <Link to="/register">
                <Button variant="gradient" size="sm">{t('common.getStarted')}</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {user && mobileMenuOpen && (
        <nav className="lg:hidden border-t bg-background animate-fade-in">
          <div className="container py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button
                  variant={isActive(item.href) ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};
