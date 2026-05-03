import { HeartHandshake } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center h-full w-full bg-slate-50 relative">
      <a 
        href="https://www.just-ai.it" 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute top-6 right-6 md:top-8 md:right-8 transition-transform hover:scale-105"
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
        <div className="hidden items-center gap-1 font-black text-xl tracking-tighter" style={{ display: 'none' }}>
          <span>JUST</span>
          <span className="relative flex items-center justify-center border-2 border-transparent bg-clip-border rounded-lg outline outline-2 outline-indigo-500 px-1 text-indigo-500">
            AI
            <span className="absolute -top-3 -right-2 text-indigo-500 text-2xl">✦</span>
          </span>
          <span>IT</span>
        </div>
      </a>

      <div className="w-24 h-24 bg-sky-50 rounded-3xl flex items-center justify-center mb-8 text-sky-600 shadow-sm border border-sky-100 mt-12 md:mt-0">
        <HeartHandshake size={48} />
      </div>
      <h1 className="text-4xl md:text-5xl font-black mb-4 text-[#002060] tracking-tight leading-tight">
        Workplace <br className="hidden md:block" /> Love Language
      </h1>
      <p className="text-slate-500 mb-10 leading-relaxed text-lg max-w-md mx-auto font-medium">
        What fills up your "love tank" at work? Discover how you prefer to be recognized and supported.
      </p>
      
      <div className="bg-white p-6 rounded-3xl mb-12 w-full max-w-md border border-slate-200 shadow-sm text-left">
        <h3 className="font-bold text-[#002060] mb-2 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-sm">🚀</span>
          Designed for Tech Teams
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed ml-10">
          Tailored insights for Product Managers, Project Managers, and Division Leaders to improve dynamics.
        </p>
      </div>

      <button
        onClick={onStart}
        className="w-full max-w-md py-4 px-8 bg-sky-600 text-white font-bold rounded-2xl shadow-lg hover:bg-sky-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        Take the Quiz
      </button>
    </div>
  );
}
