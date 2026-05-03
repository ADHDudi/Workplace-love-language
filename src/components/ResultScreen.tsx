import { useState } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, HeartHandshake, Copy, Check, FileText, Info } from 'lucide-react';
import { results, OptionId } from '../data/quizData';

interface ResultScreenProps {
  resultId: OptionId;
  scores: Record<OptionId, number>;
  onRestart: () => void;
}

export function ResultScreen({ resultId, scores, onRestart }: ResultScreenProps) {
  const result = results[resultId];
  const [activeTab, setActiveTab] = useState<'analysis' | 'playbook' | 'manual'>('analysis');
  const [copied, setCopied] = useState(false);
  
  const totalAnswers = Object.values(scores).reduce((acc, val) => acc + val, 0) || 1;
  const sortedOptions = (Object.keys(scores) as OptionId[]).sort((a, b) => scores[b] - scores[a]);
  const secondaryId = sortedOptions[1];
  const secondaryResult = results[secondaryId];

  const scoreLabels: Record<OptionId, string> = {
    A: 'Words',
    B: 'Time',
    C: 'Gifts',
    D: 'Acts',
    E: 'Touch'
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result.userManualTemplate).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col w-full h-full bg-slate-50 overflow-hidden font-sans text-slate-900">
      <header className="h-16 md:h-20 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between flex-shrink-0 relative">
        <a 
          href="https://www.just-ai.it" 
          target="_blank" 
          rel="noopener noreferrer"
          className="absolute left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-32 top-1/2 -translate-y-1/2 transition-transform hover:scale-105 hidden sm:block"
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
          <div className="hidden items-center gap-1 font-black text-sm md:text-base tracking-tighter" style={{ display: 'none' }}>
            <span>JUST</span>
            <span className="relative flex items-center justify-center border-[1.5px] border-transparent bg-clip-border rounded-md outline outline-[1.5px] outline-indigo-500 px-1 text-indigo-500">
              AI
              <span className="absolute -top-2 -right-1.5 text-indigo-500 text-lg">✦</span>
            </span>
            <span>IT</span>
          </div>
        </a>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-sky-600 rounded-xl flex items-center justify-center">
            <HeartHandshake className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-base md:text-xl font-bold tracking-tight text-[#002060]">
              Workplace <span className="text-sky-600">Love Language</span>
            </h1>
          </div>
        </div>
        <button
          onClick={onRestart}
          className="px-3 py-1.5 md:px-4 md:py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs md:text-sm font-bold rounded-xl flex items-center gap-2 transition-colors z-10"
        >
          <RotateCcw size={16} />
          <span className="hidden md:inline">Retake</span>
        </button>
      </header>

      <main className="flex-grow p-4 md:p-6 overflow-y-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-6 gap-4 h-auto md:h-full">
          
          {/* Main Hero Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-8 md:row-span-3 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 flex flex-col justify-between h-full"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-bold uppercase tracking-widest">
                  Primary Language
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-[#002060] mt-4 leading-tight">
                  {result.title}
                  <br/>
                  <span className="text-sky-600 text-2xl md:text-4xl">{result.subtitle}</span>
                </h2>
              </div>
              <div className="w-16 h-16 md:w-24 md:h-24 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600 shrink-0">
                 <HeartHandshake className="w-8 h-8 md:w-12 md:h-12" />
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-5 md:p-6 border border-slate-100 flex-grow flex flex-col justify-center">
              <h3 className="font-bold text-slate-700 mb-2">Analysis Insight:</h3>
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
            className="md:col-span-4 md:row-span-3 bg-emerald-50 rounded-3xl border border-emerald-100 p-6 flex flex-col h-full"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                !
              </div>
              <h3 className="font-bold text-emerald-900 text-lg">Actionable Tips</h3>
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
            className="md:col-span-8 md:row-span-3 bg-[#002060] rounded-3xl p-6 md:p-8 text-white flex flex-col shadow-lg h-full overflow-hidden"
          >
             <div className="flex flex-wrap md:flex-nowrap gap-2 mb-6 p-1 bg-white/10 rounded-xl w-full md:w-fit">
               <button 
                 onClick={() => setActiveTab('analysis')}
                 className={`flex-1 md:flex-none justify-center px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'analysis' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
               >
                 <Info size={16} /> Analysis
               </button>
               <button 
                 onClick={() => setActiveTab('playbook')}
                 className={`flex-1 md:flex-none justify-center px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'playbook' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
               >
                 <FileText size={16} /> Playbook
               </button>
               <button 
                 onClick={() => setActiveTab('manual')}
                 className={`flex-1 md:flex-none justify-center px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'manual' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
               >
                 <Copy size={16} /> User Manual
               </button>
             </div>

             {activeTab === 'analysis' && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                 className="flex flex-col flex-grow overflow-y-auto pr-2"
               >
                 <h3 className="font-bold text-xl mb-3 flex items-center gap-3 text-sky-300 shrink-0">
                   <span className="w-3 h-3 bg-sky-400 rounded-full"></span> 
                   What That Means at Work
                 </h3>
                 <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4 shrink-0">
                   <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                     {result.meaning}
                   </p>
                 </div>
                 
                 {secondaryResult && scores[secondaryId] > 0 && (
                   <div className="shrink-0 mb-4">
                     <h3 className="font-bold text-lg mb-2 flex items-center gap-3 text-emerald-400">
                       <span className="w-2 h-2 bg-emerald-400 rounded-full"></span> 
                       Secondary Trait: {secondaryResult.title}
                     </h3>
                     <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5">
                       <p className="text-slate-300 leading-relaxed text-sm">
                         You also have a strong affinity for <strong className="text-white">{secondaryResult.title.toLowerCase()}</strong>. {secondaryResult.insights}
                       </p>
                     </div>
                   </div>
                 )}
               </motion.div>
             )}

             {activeTab === 'playbook' && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                 className="flex flex-col flex-grow overflow-y-auto pr-2 gap-4"
               >
                 <div className="bg-indigo-900/40 border border-indigo-400/30 rounded-2xl p-5">
                   <h4 className="font-bold text-indigo-300 mb-2 flex flex-col gap-1">
                     <span className="text-xs uppercase tracking-widest text-indigo-400">Scenario 1</span>
                     How I act during Crunch Time
                   </h4>
                   <p className="text-slate-200 text-sm leading-relaxed">{result.playbook.crunchTime}</p>
                 </div>
                 
                 <div className="bg-rose-900/40 border border-rose-400/30 rounded-2xl p-5">
                   <h4 className="font-bold text-rose-300 mb-2 flex flex-col gap-1">
                     <span className="text-xs uppercase tracking-widest text-rose-400">Scenario 2</span>
                     What burnout looks like for me
                   </h4>
                   <p className="text-slate-200 text-sm leading-relaxed">{result.playbook.burnoutSigns}</p>
                 </div>

                 <div className="bg-amber-900/40 border border-amber-400/30 rounded-2xl p-5">
                   <h4 className="font-bold text-amber-300 mb-2 flex flex-col gap-1">
                     <span className="text-xs uppercase tracking-widest text-amber-400">Scenario 3</span>
                     How to deliver negative feedback
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
                     Share with your team / manager
                   </span>
                   <button 
                     onClick={handleCopy}
                     className="px-3 py-1.5 bg-white border border-slate-300 hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg text-sm font-bold text-slate-600 transition-colors flex items-center gap-2 shadow-sm"
                   >
                     {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                     {copied ? 'Copied!' : 'Copy text'}
                   </button>
                 </div>
                 <div className="p-5 md:p-6 overflow-y-auto text-sm md:text-base leading-relaxed text-slate-700 whitespace-pre-wrap select-all font-medium">
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
            className="md:col-span-4 md:row-span-3 bg-sky-600 rounded-3xl shadow-lg p-6 md:p-8 text-white flex flex-col justify-between h-full"
          >
             <div>
               <h3 className="text-xl font-bold mb-6">Language Breakdown</h3>
               <div className="space-y-4">
                 {sortedOptions.map(optionId => {
                   const percentage = Math.round((scores[optionId] / totalAnswers) * 100);
                   return (
                     <div key={optionId}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="opacity-90 font-medium">{scoreLabels[optionId]}</span>
                          <span className="font-bold">{percentage}%</span>
                        </div>
                        <div className="w-full bg-sky-400/30 h-2 rounded-full overflow-hidden">
                          <motion.div
                             initial={{ width: 0 }}
                             animate={{ width: `${percentage}%` }}
                             transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                             className={`h-full ${optionId === resultId ? 'bg-white' : 'bg-sky-200'}`}
                          />
                        </div>
                     </div>
                   );
                 })}
               </div>
             </div>
             
             <div className="mt-8 pt-4 border-t border-sky-400/30 text-xs text-sky-200 uppercase tracking-widest font-bold text-center">
                AI Powered Insight
             </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
