import { useState } from 'react';
import { motion } from 'motion/react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { RotateCcw, HeartHandshake, Copy, Check, FileText, Info, MessageSquareHeart, Coffee, Gift, HelpingHand, Sparkles, Mail } from 'lucide-react';
import { results as results_en, OptionId } from '../data/quizData';
import { results_he } from '../data/quizData.he';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import { LanguageSwitcher } from './LanguageSwitcher';

const OptionIcons: Record<OptionId, any> = {
  A: MessageSquareHeart,
  B: Coffee,
  C: Gift,
  D: HelpingHand,
  E: Sparkles
};

interface ResultScreenProps {
  resultId: OptionId;
  scores: Record<OptionId, number>;
  onRestart: () => void;
}

export function ResultScreen({ resultId, scores, onRestart }: ResultScreenProps) {
  const { language, dir } = useLanguage();
  const t = translations[language];
  const results = language === 'he' ? results_he : results_en;
  
  const result = results[resultId];
  const [activeTab, setActiveTab] = useState<'analysis' | 'playbook' | 'manual'>('analysis');
  const [copied, setCopied] = useState(false);
  
  const totalAnswers = Object.values(scores).reduce((acc, val) => acc + val, 0) || 1;
  const sortedOptions = (Object.keys(scores) as OptionId[]).sort((a, b) => scores[b] - scores[a]);
  const secondaryId = sortedOptions[1];
  const secondaryResult = results[secondaryId];

  const scoreLabels = t.scoreLabels;

  const handleCopy = () => {
    navigator.clipboard.writeText(result.userManualTemplate).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col w-full h-full bg-slate-50 overflow-hidden font-sans text-slate-900">
      <header className="h-16 md:h-20 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3 overflow-hidden z-10 shrink-0">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-sky-600 rounded-xl flex items-center justify-center shrink-0">
            <HeartHandshake className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base md:text-xl font-bold tracking-tight text-[#002060] truncate whitespace-nowrap">
               {t.title} <span className="text-sky-600">{t.subtitle}</span>
            </h1>
          </div>
        </div>

        <div className="hidden xl:flex flex-1 justify-center px-4 overflow-hidden min-w-0">
          <a 
            href="https://www.just-ai.it" 
            target="_blank" 
            rel="noopener noreferrer"
            dir="ltr"
            className="transition-transform hover:scale-105 shrink-0"
          >
            <img 
              src="/logo.png" 
              alt="Just AI IT Logo" 
              className="h-6 md:h-8 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.nextElementSibling) {
                  (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                }
              }}
            />
            <div className="hidden items-center gap-[4px] font-black text-base md:text-lg tracking-tighter text-slate-800" style={{ display: 'none' }}>
              <span>JUST</span>
              <span className="relative flex items-center justify-center w-[1.8rem] h-[1.8rem] rounded-xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-500 p-[2.5px]">
                <span className="flex items-center justify-center w-full h-full bg-white rounded-[9px] text-black font-sans tracking-normal pb-[1px]">
                  AI
                </span>
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center p-[2px]">
                  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="url(#star-grad2)" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="star-grad2" x1="0%" y1="0%" x2="100%" y2="100%">
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
        </div>
        
        <div className="flex items-center gap-2 md:gap-3 z-10 shrink-0">
          <LanguageSwitcher className="px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm" compact />
          <button
            onClick={onRestart}
            className="px-3 py-1.5 md:px-4 md:py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs md:text-sm font-bold rounded-xl flex items-center gap-2 transition-colors z-10"
          >
            <RotateCcw size={16} />
            <span className="hidden md:inline">{t.retake}</span>
          </button>
        </div>
      </header>

      <main className="flex-grow p-4 md:p-6 overflow-y-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Main Hero Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="order-1 md:col-span-8 md:row-span-3 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 flex flex-col justify-between h-full"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-bold uppercase tracking-widest">
                  {t.primaryLanguage}
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-[#002060] mt-4 leading-tight">
                  {result.title}
                  <br/>
                  <span className="text-sky-600 text-2xl md:text-4xl">{result.subtitle}</span>
                </h2>
              </div>
              <div className="w-16 h-16 md:w-24 md:h-24 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600 shrink-0 shadow-inner">
                 {(() => {
                   const Icon = OptionIcons[resultId] || HeartHandshake;
                   return <Icon className="w-8 h-8 md:w-12 md:h-12" />;
                 })()}
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-5 md:p-6 border border-slate-100 flex-grow flex flex-col justify-start min-h-24">
              <h3 className="font-bold text-slate-700 mb-2 shrink-0">{t.analysisInsight}</h3>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                {result.insights}
              </p>
            </div>
          </motion.div>

          {/* Actionable Tips */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="order-3 md:order-2 md:col-span-4 md:row-span-3 bg-emerald-50 rounded-3xl border border-emerald-100 p-6 flex flex-col h-full"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                !
              </div>
              <h3 className="font-bold text-emerald-900 text-lg">{t.actionableTips}</h3>
            </div>
            
            <ul className="space-y-4 flex-grow overflow-y-auto pr-2">
              {result.tips.map((tip, idx) => (
                <li key={idx} className="flex gap-3 items-start">
                  <div className="w-4 h-4 mt-1 rounded bg-emerald-300 flex-shrink-0" />
                  <p className="text-sm md:text-base text-emerald-800 leading-relaxed">
                    {tip}
                  </p>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Meaning & User Manual Tab Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="order-2 md:order-3 md:col-span-8 md:row-span-3 bg-[#002060] rounded-3xl p-6 md:p-8 text-white flex flex-col shadow-lg h-full overflow-hidden"
          >
             <div className="flex flex-wrap md:flex-nowrap gap-2 mb-6 p-1 bg-white/10 rounded-xl w-full md:w-fit">
               <button 
                 onClick={() => setActiveTab('analysis')}
                 className={`flex-1 md:flex-none justify-center px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'analysis' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
               >
                 <Info size={16} /> {t.analysis}
               </button>
               <button 
                 onClick={() => setActiveTab('playbook')}
                 className={`flex-1 md:flex-none justify-center px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'playbook' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
               >
                 <FileText size={16} /> {t.playbook}
               </button>
               <button 
                 onClick={() => setActiveTab('manual')}
                 className={`flex-1 md:flex-none justify-center px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'manual' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
               >
                 <Copy size={16} /> {t.userManual}
               </button>
             </div>

             {activeTab === 'analysis' && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                 className="flex flex-col flex-grow overflow-y-auto pr-2 rtl:pl-2 rtl:pr-0"
               >
                 <h3 className="font-bold text-xl mb-3 flex items-center gap-3 text-sky-300 shrink-0">
                   {(() => {
                     const Icon = OptionIcons[resultId] || HeartHandshake;
                     return <Icon size={20} className="text-sky-400" />;
                   })()}
                   {t.whatThatMeans}
                 </h3>
                 <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4 shrink-0">
                   <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                     {result.meaning}
                   </p>
                 </div>
                 
                 {secondaryResult && scores[secondaryId] > 0 && (
                   <div className="shrink-0 mb-4">
                     <h3 className="font-bold text-lg mb-2 flex items-center gap-3 text-emerald-400">
                       {(() => {
                         const SecondaryIcon = OptionIcons[secondaryId] || HeartHandshake;
                         return <SecondaryIcon size={20} className="text-emerald-400" />;
                       })()}
                       {t.secondaryTrait} {secondaryResult.title}
                     </h3>
                     <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5">
                       <p className="text-slate-300 leading-relaxed text-sm">
                         {secondaryResult.insights}
                       </p>
                     </div>
                   </div>
                 )}
               </motion.div>
             )}

             {activeTab === 'playbook' && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                 className="flex flex-col flex-grow overflow-y-auto pr-2 gap-4 rtl:pl-2 rtl:pr-0"
               >
                 <div className="bg-indigo-900/40 border border-indigo-400/30 rounded-2xl p-5">
                   <h4 className="font-bold text-indigo-300 mb-2 flex flex-col gap-1">
                     <span className="text-xs uppercase tracking-widest text-indigo-400">{t.scenario1}</span>
                     {t.crunchTime}
                   </h4>
                   <p className="text-slate-200 text-sm leading-relaxed">{result.playbook.crunchTime}</p>
                 </div>
                 
                 <div className="bg-rose-900/40 border border-rose-400/30 rounded-2xl p-5">
                   <h4 className="font-bold text-rose-300 mb-2 flex flex-col gap-1">
                     <span className="text-xs uppercase tracking-widest text-rose-400">{t.scenario2}</span>
                     {t.burnoutSigns}
                   </h4>
                   <p className="text-slate-200 text-sm leading-relaxed">{result.playbook.burnoutSigns}</p>
                 </div>

                 <div className="bg-amber-900/40 border border-amber-400/30 rounded-2xl p-5">
                   <h4 className="font-bold text-amber-300 mb-2 flex flex-col gap-1">
                     <span className="text-xs uppercase tracking-widest text-amber-400">{t.scenario3}</span>
                     {t.negativeFeedback}
                   </h4>
                   <p className="text-slate-200 text-sm leading-relaxed">{result.playbook.negativeFeedback}</p>
                 </div>
               </motion.div>
             )}

             {activeTab === 'manual' && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                 className="flex flex-col h-full bg-white text-slate-800 rounded-2xl shadow-inner border border-slate-200 overflow-hidden"
               >
                 <div className="bg-slate-100 p-3 px-5 border-b border-slate-200 flex justify-between items-center shrink-0">
                   <span className="text-sm font-bold text-slate-600 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                     {t.shareWithTeam}
                   </span>
                   <button 
                     onClick={handleCopy}
                     className="px-3 py-1.5 bg-white border border-slate-300 hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg text-sm font-bold text-slate-600 transition-colors flex items-center gap-2 shadow-sm"
                   >
                     {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                     {copied ? t.copied : t.copyText}
                   </button>
                 </div>
                 <div className="p-5 md:p-6 overflow-y-auto text-sm md:text-base leading-relaxed text-slate-700 whitespace-pre-wrap select-all font-medium  rtl:text-right">
                   {result.userManualTemplate}
                 </div>
               </motion.div>
             )}
          </motion.div>
          
           {/* Summary Graphic / Extra Box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="order-4 md:col-span-4 md:row-span-3 bg-sky-600 rounded-3xl shadow-lg p-6 md:p-8 text-white flex flex-col justify-between h-full"
          >
             <div className="flex flex-col h-full">
               <h3 className="text-xl font-bold mb-2">{t.languageBreakdown}</h3>
               
               <div className="h-48 md:h-56 mb-4 -mx-4" dir="ltr">
                 <ResponsiveContainer width="100%" height="100%">
                   <RadarChart cx="50%" cy="50%" outerRadius="70%" data={sortedOptions.map(optionId => ({
                     subject: scoreLabels[optionId as OptionId],
                     value: Math.round((scores[optionId] / totalAnswers) * 100)
                   }))}>
                     <PolarGrid stroke="rgba(255,255,255,0.2)" />
                     <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }} />
                     <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                     <Radar
                       name={t.score}
                       dataKey="value"
                       stroke="#fff"
                       fill="rgba(255,255,255,0.4)"
                       fillOpacity={0.6}
                     />
                     <Tooltip 
                       contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
                       itemStyle={{ color: '#fff' }}
                       formatter={(value: number) => [`${value}%`, t.score]}
                     />
                   </RadarChart>
                 </ResponsiveContainer>
               </div>

               <div className="space-y-4 overflow-y-auto pr-2 flex-grow rtl:pl-2 rtl:pr-0">
                 {sortedOptions.map(optionId => {
                   const percentage = Math.round((scores[optionId] / totalAnswers) * 100);
                   const Icon = OptionIcons[optionId];
                   return (
                     <div key={optionId}>
                        <div className="flex justify-between items-center text-sm mb-2 rtl:flex-row-reverse">
                          <span className="opacity-90 font-medium flex items-center gap-2 rtl:flex-row-reverse">
                            <Icon size={16} className={optionId === resultId ? 'text-white' : 'text-sky-300'} />
                            {scoreLabels[optionId as OptionId]}
                          </span>
                          <span className="font-bold">{percentage}%</span>
                        </div>
                        <div className="w-full bg-sky-400/30 h-2 rounded-full overflow-hidden" dir="ltr">
                          <motion.div
                             initial={{ width: 0 }}
                             animate={{ width: `${percentage}%` }}
                             transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                             className={`h-full origin-left rtl:origin-right ${optionId === resultId ? 'bg-white' : 'bg-sky-200'}`}
                          />
                        </div>
                     </div>
                   );
                 })}
               </div>
             </div>
             
             <div className="mt-8 pt-4 border-t border-sky-400/30 text-xs text-sky-200 uppercase tracking-widest font-bold text-center">
                {t.aiPoweredInsight}
             </div>
          </motion.div>

          {/* Feedback Link */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="order-5 md:col-span-12 flex justify-center mt-4 mb-2"
          >
            <a 
              href="mailto:dl@just-ai.it?subject=Workplace%20Love%20Language%20Feedback" 
              className="text-slate-400 hover:text-sky-600 text-sm font-medium transition-colors underline underline-offset-4 decoration-slate-300 hover:decoration-sky-400 flex items-center gap-2 bg-slate-100 hover:bg-sky-50 px-4 py-2 rounded-full border border-slate-200 shadow-sm"
              onClick={(e) => {
                // In an iframe context, mailto links might fail or cause a white screen.
                // We'll try to execute it gracefully.
                e.preventDefault();
                window.location.href = "mailto:dl@just-ai.it?subject=Workplace%20Love%20Language%20Feedback";
              }}
            >
              <Mail size={16} />
              {t.feedbackText}
            </a>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
