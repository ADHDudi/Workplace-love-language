import { HeartHandshake } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import { LanguageSwitcher } from './LanguageSwitcher';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center h-full w-full bg-slate-50 relative">
      <div className="absolute top-6 left-6 md:top-8 md:left-8 rtl:left-auto rtl:right-6 rtl:md:right-8 z-10">
        <LanguageSwitcher className="px-4 py-2 rounded-full" />
      </div>

      <a 
        href="https://www.just-ai.it" 
        target="_blank" 
        rel="noopener noreferrer"
        dir="ltr"
        className="absolute top-6 right-6 md:top-8 md:right-8 rtl:right-auto rtl:left-6 rtl:md:left-8 transition-transform hover:scale-105"
      >
        <img 
          src="/logo.png" 
          alt="Just AI IT Logo" 
          className="h-8 md:h-10 object-contain"
          onError={(e) => {
            // Fallback if logo not found
            e.currentTarget.style.display = 'none';
            if (e.currentTarget.nextElementSibling) {
              (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
            }
          }}
        />
        {/* CSS Fallback just in case */}
        <div className="hidden items-center gap-[6px] font-black text-2xl tracking-tighter text-slate-800" style={{ display: 'none' }}>
          <span>JUST</span>
          <span className="relative flex items-center justify-center w-[2.5rem] h-[2.5rem] rounded-xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-500 p-[3px]">
            <span className="flex items-center justify-center w-full h-full bg-slate-50 rounded-[9px] text-black font-sans tracking-normal pb-[1px]">
              AI
            </span>
            <span className="absolute -top-2.5 -right-2.5 w-7 h-7 bg-slate-50 rounded-full flex items-center justify-center p-[3px]">
              <svg width="100%" height="100%" viewBox="0 0 24 24" fill="url(#star-grad)" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="star-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
                <path d="M12 0C12 8 16 12 24 12C16 12 12 16 12 24C12 16 8 12 0 12C8 12 12 8 12 0Z" />
              </svg>
            </span>
          </span>
          <span>IT</span>
        </div>
      </a>

      <div className="w-24 h-24 bg-sky-50 rounded-3xl flex items-center justify-center mb-8 text-sky-600 shadow-sm border border-sky-100 mt-12 md:mt-0">
        <HeartHandshake size={48} />
      </div>
      <h1 className="text-4xl md:text-5xl font-black mb-4 text-[#002060] tracking-tight leading-tight">
        {t.title} <br className="hidden md:block" /> {t.subtitle}
      </h1>
      <p className="text-slate-500 mb-10 leading-relaxed text-lg max-w-md mx-auto font-medium">
        {t.description}
      </p>
      
      <div className="bg-white p-6 rounded-3xl mb-12 w-full max-w-md border border-slate-200 shadow-sm text-left rtl:text-right">
        <h3 className="font-bold text-[#002060] mb-2 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-sm">🚀</span>
          {t.designedFor}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed mx-10">
          {t.designedForDesc}
        </p>
      </div>

      <button
        onClick={onStart}
        className="w-full max-w-md py-4 px-8 bg-sky-600 text-white font-bold rounded-2xl shadow-lg hover:bg-sky-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        {t.takeQuiz}
      </button>
    </div>
  );
}
