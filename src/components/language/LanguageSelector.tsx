import { useLanguage, languages, Language } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'default' | 'minimal' | 'full';
  className?: string;
}

export const LanguageSelector = ({ variant = 'default', className = '' }: LanguageSelectorProps) => {
  const { language, setLanguage, t } = useLanguage();

  const currentLang = languages[language];

  if (variant === 'full') {
    return (
      <div className={`space-y-3 ${className}`}>
        <label className="text-sm font-medium text-muted-foreground">
          {t('auth.selectLanguage')}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(languages) as Language[]).map((lang) => (
            <Button
              key={lang}
              type="button"
              variant={language === lang ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLanguage(lang)}
              className="justify-start gap-2"
            >
              <span className="text-lg">{languages[lang].flag}</span>
              <span>{languages[lang].nativeName}</span>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size={variant === 'minimal' ? 'icon' : 'sm'}
          className={className}
        >
          {variant === 'minimal' ? (
            <Globe className="h-5 w-5" />
          ) : (
            <>
              <span className="text-lg mr-2">{currentLang.flag}</span>
              <span className="hidden sm:inline">{currentLang.nativeName}</span>
              <Globe className="h-4 w-4 ml-2 sm:hidden" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {(Object.keys(languages) as Language[]).map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`cursor-pointer ${language === lang ? 'bg-accent' : ''}`}
          >
            <span className="text-lg mr-3">{languages[lang].flag}</span>
            <div className="flex flex-col">
              <span className="font-medium">{languages[lang].nativeName}</span>
              <span className="text-xs text-muted-foreground">{languages[lang].name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
