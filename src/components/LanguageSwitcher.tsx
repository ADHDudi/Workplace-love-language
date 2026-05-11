import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';

export function LanguageSwitcher({ className = "", compact = false }: { className?: string, compact?: boolean }) {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  return (
    <button 
      onClick={() => setLanguage(language === 'he' ? 'en' : 'he')}
      className={`bg-[var(--bg-card)]/80 backdrop-blur border border-[var(--border)] text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors flex items-center justify-center gap-2 font-bold shadow-sm z-10 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 ${className}`}
      aria-label={language === 'he' ? 'Switch to English' : 'החלף לעברית'}
      title={language === 'he' ? 'Switch to English' : 'החלף לעברית'}
    >
      <Globe size={16} />
      {compact ? (
        <>
          <span className="md:hidden text-xs">{language === 'he' ? 'EN' : 'HE'}</span>
          <span className="hidden md:inline text-sm">{t.navigation.languageSwitch}</span>
        </>
      ) : (
        <span className="text-sm">{t.navigation.languageSwitch}</span>
      )}
    </button>
  );
}
