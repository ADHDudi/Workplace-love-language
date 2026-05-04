import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';

export function LanguageSwitcher({ className = "", compact = false }: { className?: string, compact?: boolean }) {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  return (
    <button 
      onClick={() => setLanguage(language === 'he' ? 'en' : 'he')}
      className={`bg-white/80 backdrop-blur border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 font-bold shadow-sm z-10 ${className}`}
    >
      <Globe size={16} />
      {compact ? (
        <>
          <span className="md:hidden text-xs">{language === 'he' ? 'EN' : 'HE'}</span>
          <span className="hidden md:inline text-sm">{t.languageSwitch}</span>
        </>
      ) : (
        <span className="text-sm">{t.languageSwitch}</span>
      )}
    </button>
  );
}
