import { legalTranslations } from '../data/legalTranslations';
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

type LegalPageProps = {
  pageType: 'terms' | 'privacy' | 'accessibility';
};

export function LegalPage({ pageType }: LegalPageProps) {
  const { language, dir } = useLanguage();
  const t = legalTranslations[language][pageType];

  return (
    <div className="min-h-[100dvh] bg-slate-200 text-slate-900 font-sans flex justify-center items-center p-0 md:p-6 lg:p-12" dir={dir}>
      <div className="w-full max-w-4xl bg-slate-50 shadow-2xl md:rounded-[2.5rem] min-h-[100dvh] md:min-h-0 md:max-h-[850px] relative overflow-y-auto flex flex-col border border-slate-200/60 p-6 md:p-10">
        
        <header className="flex items-center justify-start mb-8 pb-6 border-b border-slate-200">
          <Link to="/" className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
            {dir === 'rtl' ? <ChevronRight className="w-5 h-5 ml-1" /> : <ChevronLeft className="w-5 h-5 mr-1" />}
            <span className="font-medium">{language === 'he' ? 'חזרה לאפליקציה' : 'Back to App'}</span>
          </Link>
        </header>

        <div className="max-w-3xl mx-auto w-full space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">{t.title}</h1>
            <p className="text-sm text-slate-500 mt-2">{t.lastUpdated}</p>
          </div>

          <div className="space-y-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
              const secTitleKey = `s${num}Title` as keyof typeof t;
              const secBodyKey = `s${num}Body` as keyof typeof t;
              
              if (!t[secTitleKey] || !t[secBodyKey]) return null;
              
              const isWarning = pageType === 'terms' && num === 4;

              return (
                <div key={num} className={`rounded-2xl p-6 ${isWarning ? 'bg-orange-50 border border-orange-200' : 'bg-white shadow-sm border border-slate-100'}`}>
                  <h2 className={`text-xl font-semibold mb-3 ${isWarning ? 'text-orange-900' : 'text-slate-800'}`}>
                    {t[secTitleKey]}
                  </h2>
                  <p className={`leading-relaxed text-sm md:text-base ${isWarning ? 'text-orange-800 font-medium' : 'text-slate-600'}`}>
                    {t[secBodyKey]}
                  </p>
                </div>
              );
            })}
          </div>
          
          <footer className="mt-12 pt-8 border-t border-slate-200 flex flex-col items-center gap-6 text-sm text-slate-500 pb-8">
            <a 
              href="https://justaiit.web.app/#app=workplace-love-language" 
              target="_blank" 
              rel="noopener noreferrer"
              dir="ltr"
              className="transition-transform hover:scale-105 shrink-0 flex flex-col items-center gap-1 opacity-80"
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Powered by</span>
              <img 
                src="/logo.svg" 
                alt="Just AI IT Logo" 
                className="h-8 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.nextElementSibling) {
                    (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                  }
                }}
              />
              <div className="hidden items-center gap-[6px] font-black text-xl tracking-tighter text-slate-800" style={{ display: 'none' }}>
                <span>JUST</span>
                <span className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-500 p-[3px]">
                  <span className="flex items-center justify-center w-full h-full bg-slate-50 rounded-[6px] text-black font-sans tracking-normal pb-[1px]">
                    AI
                  </span>
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-slate-50 rounded-full flex items-center justify-center p-[2px]">
                    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="url(#star-grad-footer)" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="star-grad-footer" x1="0%" y1="0%" x2="100%" y2="100%">
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
            <nav className="flex items-center gap-4 mt-3 w-full justify-center">
              {['terms', 'privacy', 'accessibility'].map((type) => (
                type !== pageType && (
                  <Link key={type} to={`/${type}`} className="hover:text-slate-800 hover:underline">
                    {legalTranslations[language].footer[type as 'terms' | 'privacy' | 'accessibility']}
                  </Link>
                )
              ))}
            </nav>
          </footer>
        </div>
      </div>
    </div>
  );
}
