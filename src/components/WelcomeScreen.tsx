import { useState } from 'react';
import { HeartHandshake, CheckCircle2, User, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import { legalTranslations } from '../data/legalTranslations';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Link } from 'react-router-dom';

interface WelcomeScreenProps {
  onStart: (role: 'manager' | 'employee') => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const l = legalTranslations[language].footer;
  const [selectedRole, setSelectedRole] = useState<'manager' | 'employee'>('employee');

  return (
    <div className="flex flex-col items-center px-4 py-6 md:p-8 text-center min-h-[100dvh] w-full bg-[var(--bg)] relative overflow-y-auto overflow-x-hidden">
      {/* Top Navigation Bar */}
      <div className="w-full max-w-5xl flex items-center justify-start mb-8 md:mb-12 shrink-0">
        <div className="z-10" dir={language === 'he' ? 'rtl' : 'ltr'}>
          <LanguageSwitcher className="px-3 md:px-4 py-1.5 md:py-2 rounded-full lg:shadow-sm" />
        </div>
      </div>

      <div className="flex-1 w-full max-w-lg flex flex-col items-center justify-center shrink-0">
        <div className="w-16 h-16 md:w-24 md:h-24 rounded-[var(--r-xl)] flex items-center justify-center mb-4 md:mb-8 text-[var(--accent)] shadow-sm shrink-0" style={{ background: 'var(--brand-gradient-soft)' }}>
          <HeartHandshake className="w-8 h-8 md:w-12 md:h-12" />
        </div>
        
        <h1 className="h1 mb-3 md:mb-4 text-center">
          {t.welcome.title} <br className="hidden min-[400px]:block" /> 
          <span className="gradient-text">{t.welcome.subtitle}</span>
        </h1>
        
        <p className="body-sm md:body mb-6 md:mb-8 w-full px-2 text-center">
          {t.welcome.description}
        </p>
        
        <div className="bg-card p-5 md:p-6 rounded-[var(--r-xl)] mb-6 md:mb-10 w-full border border-[var(--border)] shadow-sm text-left rtl:text-right shrink-0">
          <h3 className="h3 mb-3 text-sm md:text-base">
            {t.welcome.valueProp}
          </h3>
          
          <ul className="space-y-3 mb-5">
            {t.welcome.benefits?.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-sm md:text-base text-[var(--fg-muted)] text-start">
                <CheckCircle2 className="w-5 h-5 text-[var(--ok)] shrink-0 mt-0.5" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="h-px w-full bg-[var(--border-faint)] mb-4" />

          <h4 className="flex items-center gap-2 eyebrow text-xs mb-2">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ background: 'var(--brand-gradient-soft)' }}>🚀</span>
            <span className="text-[var(--accent)]">{t.welcome.designedFor}</span>
          </h4>
          <p className="body-xs mx-8">
            {t.welcome.designedForDesc}
          </p>
        </div>

        <div className="w-full mb-8">
          <h4 className="body-sm font-semibold mb-3 text-center">
            {t.welcome.roleSelector.title}
          </h4>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setSelectedRole('employee')}
              className={`flex-1 max-w-40 py-3 px-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                selectedRole === 'employee' 
                  ? 'border-[var(--accent)] bg-[var(--accent-soft-bg)] text-[var(--accent)]' 
                  : 'border-[var(--border)] bg-card text-[var(--fg-muted)] hover:border-[var(--border-strong)]'
              }`}
            >
              <User className="w-6 h-6" />
              <span className="text-sm font-semibold">{t.welcome.roleSelector.employee}</span>
            </button>
            <button
              onClick={() => setSelectedRole('manager')}
              className={`flex-1 max-w-40 py-3 px-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                selectedRole === 'manager' 
                  ? 'border-[var(--accent)] bg-[var(--accent-soft-bg)] text-[var(--accent)]' 
                  : 'border-[var(--border)] bg-card text-[var(--fg-muted)] hover:border-[var(--border-strong)]'
              }`}
            >
              <Users className="w-6 h-6" />
              <span className="text-sm font-semibold">{t.welcome.roleSelector.manager}</span>
            </button>
          </div>
        </div>

        <button
          onClick={() => onStart(selectedRole)}
          className="w-full py-4 px-8 text-[var(--paper)] font-bold rounded-[var(--r-lg)] transition-all active:scale-[0.98] animate-pulse-slow flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 shrink-0 mb-8"
          style={{ background: 'var(--brand-gradient)', boxShadow: 'var(--shadow-brand-md)' }}
          aria-label={t.welcome.takeQuiz}
        >
          {t.welcome.takeQuiz}
        </button>
      </div>

      <footer className="mt-auto pt-6 border-t border-[var(--border-faint)] w-full max-w-5xl flex flex-col items-center gap-6 text-xs text-[var(--fg-muted)] pb-4 shrink-0">
        <a 
          href="https://justaiit.web.app/#app=workplace-love-language" 
          target="_blank" 
          rel="noopener noreferrer"
          dir="ltr"
          className="transition-transform hover:scale-105 z-10 flex flex-col items-center gap-1 opacity-80"
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mr-1">Powered by</span>
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
          {/* CSS Fallback just in case */}
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
                  <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                </svg>
              </span>
            </span>
            <span>IT</span>
          </div>
        </a>
        <nav className="flex items-center gap-4 mt-3 w-full justify-center">
          <Link to="/terms" className="hover:text-[var(--fg)] hover:underline">{l.terms}</Link>
          <Link to="/privacy" className="hover:text-[var(--fg)] hover:underline">{l.privacy}</Link>
          <Link to="/accessibility" className="hover:text-[var(--fg)] hover:underline">{l.accessibility}</Link>
        </nav>
      </footer>
    </div>
  );
}
