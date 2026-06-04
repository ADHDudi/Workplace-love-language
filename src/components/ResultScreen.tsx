import { useState, FormEvent, useEffect } from 'react';
import { motion } from 'motion/react';
import { arc } from 'd3-shape';
import { RotateCcw, HeartHandshake, Copy, Check, FileText, Info, MessageSquareHeart, Coffee, Gift, HelpingHand, Sparkles, Mail, Loader2 } from 'lucide-react';
import { results as results_en, OptionId } from '../data/quizData';
import { results_he } from '../data/quizData.he';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import { legalTranslations } from '../data/legalTranslations';
import { LanguageSwitcher } from './LanguageSwitcher';
import { GoogleGenAI } from "@google/genai";
import { Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
const OptionIcons: Record<OptionId, any> = {
  A: MessageSquareHeart,
  B: Coffee,
  C: Gift,
  D: HelpingHand,
  E: Sparkles
};

const OptionColors: Record<OptionId, string> = {
  A: '#38bdf8', // sky-400
  B: '#34d399', // emerald-400
  C: '#fbbf24', // amber-400
  D: '#fb7185', // rose-400
  E: '#818cf8'  // indigo-400
};

interface ResultScreenProps {
  resultId: OptionId;
  scores: Record<OptionId, number>;
  userRole?: 'manager' | 'employee';
  onRestart: () => void;
}

export function ResultScreen({ resultId, scores, userRole, onRestart }: ResultScreenProps) {
  const { language, dir } = useLanguage();
  const t = translations[language];
  const l = legalTranslations[language].footer;
  const results = language === 'he' ? results_he : results_en;
  
  const result = results[resultId];
  const [activeTab, setActiveTab] = useState<'analysis' | 'playbook' | 'manual'>('analysis');
  const [copied, setCopied] = useState(false);
  
  const totalAnswers = Object.values(scores).reduce((acc, val) => acc + val, 0) || 1;
  const sortedOptions = (Object.keys(scores) as OptionId[]).sort((a, b) => scores[b] - scores[a]);
  const secondaryId = sortedOptions[1];
  const secondaryResult = results[secondaryId];

  const scoreLabels = t.scoreLabels;

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  const [dynamicInsights, setDynamicInsights] = useState<{insights: string, meaning: string, secondaryInsights: string, tips?: string[]} | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  const manualText = `${result.userManualTemplate}\n\n${t.result.actionableTips}:\n${(dynamicInsights?.tips || result.tips).map(tip => `- ${tip}`).join('\n')}\n\n${t.result.copyCta}: ${window.location.origin}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(manualText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  useEffect(() => {
    async function fetchDynamicInsights() {
      setIsLoadingInsights(true);
      try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
          console.warn("GEMINI_API_KEY is missing. Using static insights.");
          setIsLoadingInsights(false);
          return;
        }

        const ai = new GoogleGenAI({ apiKey });
        const languageName = language === 'he' ? 'Hebrew' : 'English';
        
        const optionPercentages = sortedOptions.map(opt => {
          return `${scoreLabels[opt as OptionId]}: ${Math.round((scores[opt] / totalAnswers) * 100)}%`;
        }).join('\n');
        
        const secondary = sortedOptions[1] as OptionId;
        const secondaryName = t.scoreLabels[secondary];
        
        const roleLabel = userRole === 'manager' ? (language === 'he' ? 'מנהל/ת' : 'Manager') : (language === 'he' ? 'עובד/ת תורם/ת' : 'Individual Contributor/Employee');

        const prompt = `Based on a workplace communication and appreciation quiz, your primary style is "${result.title}" (${result.subtitle}). Your role in the organization is: ${roleLabel}. The quiz score distribution is:
\n${optionPercentages}\n
Provide a highly personalized, insightful professional analysis addressed directly to the user (use "you" and "your"). Ensure the output is very concise and readable on mobile devices. Address how your specific role (${roleLabel}) interacts with this style.
Return ONLY a valid JSON object with the following fields:
1. "insights": A short 1-paragraph professional analysis (max 3 sentences) interpreting your unique score combination for your general work style.
2. "meaning": A very brief explanation (1 short sentence) of what this primary style specifically means in your daily interactions at work.
3. "secondaryInsights": A very brief explanation (1 short sentence) of how your secondary highest style (${secondaryName}) complements or influences your primary style.
4. "tips": An array of 3 short, actionable tips (max 1 sentence each) describing the best ways for peers and managers to collaborate with you based on your profile. Do not include prefixes like "For peers:" or "Tip:", just the actionable tip itself.
Keep the tone professional, empowering, and empathetic. Write the response in ${languageName}.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });

        if (response.text) {
          try {
            const parsed = JSON.parse(response.text.trim());
            setDynamicInsights({
              insights: parsed.insights,
              meaning: parsed.meaning,
              secondaryInsights: parsed.secondaryInsights,
              tips: parsed.tips
            });
          } catch(e) {
            console.error("Failed to parse JSON", e);
          }
        }
      } catch (err) {
        console.error("Failed to fetch dynamic insights", err);
      } finally {
        setIsLoadingInsights(false);
      }
    }

    fetchDynamicInsights();
  }, [resultId, scores, language, result.title, result.subtitle]);

  const handleFeedbackSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    
    try {
      await addDoc(collection(db, 'feedback'), {
        text: feedbackText,
        timestamp: serverTimestamp(),
        userId: null, // Placeholder for future login
        userEmail: null, // Placeholder for future login
        isRead: false // Allows manual marking in Firebase console
      });
    } catch(err) {
      console.error("Failed to send feedback", err);
    }

    setFeedbackSent(true);
    setTimeout(() => {
      setShowFeedbackModal(false);
      setFeedbackSent(false);
      setFeedbackText("");
    }, 2500);
  };

  return (
    <div className="flex flex-col w-full h-full bg-[var(--bg)] overflow-hidden font-ui text-[var(--fg)]">
      <header className="h-16 md:h-20 bg-[var(--bg-card)] border-b border-[var(--border)] px-4 md:px-6 flex items-center justify-between flex-shrink-0 relative">
        <div className="flex items-center gap-2 sm:gap-3 z-10 min-w-0 pr-2">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-[var(--r-md)] flex items-center justify-center shrink-0" style={{ background: 'var(--brand-gradient)' }}>
            {(() => {
              const HeaderIcon = OptionIcons[resultId] || HeartHandshake;
              return <HeaderIcon className="w-5 h-5 md:w-6 md:h-6 text-[var(--paper)]" />;
            })()}
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <h1 className="h4 line-clamp-2">
               <span className="hidden sm:inline">{t.welcome.title} <span className="gradient-text">{t.welcome.subtitle}</span></span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3 z-10 shrink-0 bg-white">
          <LanguageSwitcher className="px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm" compact />
          <button
            onClick={onRestart}
            className="px-3 py-1.5 md:px-4 md:py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs md:text-sm font-bold rounded-xl flex items-center gap-2 transition-all z-10 shrink-0 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-1 active:scale-95 hover:shadow-sm hover:-translate-y-0.5"
            title={t.common.retake}
          >
            <RotateCcw size={16} />
            <span className="hidden md:inline">{t.common.retake}</span>
          </button>
        </div>
      </header>

      <main className="flex-grow p-4 md:p-6 overflow-y-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:items-stretch">
          
          {/* Main Hero Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="order-1 lg:col-span-8 bg-[var(--bg-card)] rounded-[var(--r-xl)] border border-[var(--border)] shadow-[var(--shadow-sm)] p-5 md:p-8 flex flex-col justify-start h-full"
          >
            <div className="flex justify-between items-start mb-6 shrink-0">
              <div>
                <span className="px-3 py-1 bg-[var(--accent-soft-bg)] text-[var(--accent-soft-fg)] rounded-full text-xs font-bold uppercase tracking-widest">
                  {t.result.primaryLanguage}
                </span>
                <h2 className="h2 mt-3 md:mt-4">
                  {result.title}
                  <br/>
                  <span className="gradient-text">{result.subtitle}</span>
                </h2>
              </div>
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-[var(--accent-soft-bg)] rounded-[var(--r-lg)] flex items-center justify-center text-[var(--accent)] shrink-0 shadow-[var(--shadow-inset-sm)]">
                 {(() => {
                   const Icon = OptionIcons[resultId] || HeartHandshake;
                   return <Icon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />;
                 })()}
              </div>
            </div>
            
            <div className="bg-[var(--bg-subtle)] rounded-[var(--r-xl)] p-4 md:p-6 border border-[var(--border-faint)] flex-grow mt-4 md:mt-auto flex flex-col justify-start shadow-[var(--shadow-inset-sm)] relative">
              <h3 className="font-bold text-[var(--fg-strong)] mb-2 shrink-0">{t.result.analysisInsight}</h3>
              <div className="overflow-y-auto pr-2 rtl:pl-2 rtl:pr-0">
                {isLoadingInsights ? (
                  <div className="flex flex-col gap-3 my-3 animate-pulse w-full">
                    <div className="h-3 bg-[var(--border-strong)] opacity-20 rounded-full w-3/4"></div>
                    <div className="h-3 bg-[var(--border-strong)] opacity-20 rounded-full w-full"></div>
                    <div className="h-3 bg-[var(--border-strong)] opacity-20 rounded-full w-5/6"></div>
                  </div>
                ) : (
                  <p className="body-sm md:body leading-relaxed">
                    {dynamicInsights ? dynamicInsights.insights : result.insights}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Meaning & User Manual Tab Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="order-2 lg:order-3 lg:col-span-8 bg-[var(--ink-900)] rounded-[var(--r-xl)] p-5 md:p-8 text-[var(--paper)] flex flex-col shadow-lg h-full overflow-hidden"
          >
             <div className="flex flex-wrap md:flex-nowrap gap-2 mb-6 p-1 bg-white/10 rounded-xl w-full md:w-fit shrink-0" role="tablist">
               <button 
                 onClick={() => setActiveTab('analysis')}
                 className={`flex-1 md:flex-none justify-center px-3 md:px-4 py-2 rounded-lg font-bold text-xs md:text-sm flex items-center gap-1.5 md:gap-2 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-1 focus:ring-offset-[var(--ink-900)] ${activeTab === 'analysis' ? 'text-[var(--ink-900)] shadow-[var(--shadow-sm)]' : 'text-slate-300 hover:text-white hover:bg-white/5'} ${activeTab === 'analysis' ? 'bg-[var(--brand-cyan)]' : ''}`}
                 role="tab"
                 aria-selected={activeTab === 'analysis'}
                 aria-controls="panel-analysis"
                 id="tab-analysis"
               >
                 <Info size={16} className="shrink-0" /> <span className="truncate">{t.result.tabs.analysis}</span>
               </button>
               <button 
                 onClick={() => setActiveTab('playbook')}
                 className={`flex-1 md:flex-none justify-center px-3 md:px-4 py-2 rounded-lg font-bold text-xs md:text-sm flex items-center gap-1.5 md:gap-2 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-1 focus:ring-offset-[var(--ink-900)] ${activeTab === 'playbook' ? 'text-[var(--ink-900)] shadow-[var(--shadow-sm)]' : 'text-slate-300 hover:text-white hover:bg-white/5'} ${activeTab === 'playbook' ? 'bg-[var(--brand-cyan)]' : ''}`}
                 role="tab"
                 aria-selected={activeTab === 'playbook'}
                 aria-controls="panel-playbook"
                 id="tab-playbook"
               >
                 <FileText size={16} className="shrink-0" /> <span className="truncate">{t.result.tabs.playbook}</span>
               </button>
               <button 
                 onClick={() => setActiveTab('manual')}
                 className={`flex-1 md:flex-none justify-center px-3 md:px-4 py-2 rounded-lg font-bold text-xs md:text-sm flex items-center gap-1.5 md:gap-2 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-1 focus:ring-offset-[var(--ink-900)] ${activeTab === 'manual' ? 'text-[var(--ink-900)] shadow-[var(--shadow-sm)]' : 'text-slate-300 hover:text-white hover:bg-white/5'} ${activeTab === 'manual' ? 'bg-[var(--brand-cyan)]' : ''}`}
                 role="tab"
                 aria-selected={activeTab === 'manual'}
                 aria-controls="panel-manual"
                 id="tab-manual"
               >
                 <Copy size={16} className="shrink-0" /> <span className="truncate">{t.result.tabs.userManual}</span>
               </button>
             </div>

             {activeTab === 'analysis' && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                 className="flex flex-col flex-grow overflow-y-auto pr-2 rtl:pl-2 rtl:pr-0"
                 role="tabpanel"
                 id="panel-analysis"
                 aria-labelledby="tab-analysis"
               >
                 <h3 className="font-bold text-xl mb-3 flex items-center gap-3 text-sky-300 shrink-0">
                   {(() => {
                     const Icon = OptionIcons[resultId] || HeartHandshake;
                     return <Icon size={20} className="text-sky-400" />;
                   })()}
                   {t.result.whatThatMeans}
                 </h3>
                  {isLoadingInsights ? (
                    <div className="flex flex-col gap-3 my-4 animate-pulse w-full px-4">
                      <div className="h-3 bg-white/10 rounded-full w-5/6"></div>
                      <div className="h-3 bg-white/10 rounded-full w-3/4"></div>
                    </div>
                  ) : (
                   <>
                     <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5 mb-4 shrink-0">
                       <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                         {dynamicInsights?.meaning || result.meaning}
                       </p>
                     </div>
                     
                     {secondaryResult && scores[secondaryId] > 0 && (
                       <div className="shrink-0 mb-4">
                         <h3 className="font-bold text-lg mb-2 flex items-center gap-3 text-emerald-400">
                           {(() => {
                             const SecondaryIcon = OptionIcons[secondaryId] || HeartHandshake;
                             return <SecondaryIcon size={20} className="text-emerald-400" />;
                           })()}
                           {t.result.secondaryTrait} {secondaryResult.title}
                         </h3>
                         <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5">
                           <p className="text-slate-300 leading-relaxed text-sm">
                             {dynamicInsights?.secondaryInsights || secondaryResult.insights}
                           </p>
                         </div>
                       </div>
                     )}
                   </>
                 )}
               </motion.div>
             )}

             {activeTab === 'playbook' && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                 className="flex flex-col flex-grow overflow-y-auto pr-2 gap-4 rtl:pl-2 rtl:pr-0"
                 role="tabpanel"
                 id="panel-playbook"
                 aria-labelledby="tab-playbook"
               >
                 <div className="bg-indigo-900/40 border border-indigo-400/30 rounded-2xl p-5 shrink-0">
                   <h4 className="font-bold text-indigo-300 mb-2 flex flex-col gap-1">
                     {t.result.scenarios.crunchTime}
                   </h4>
                   <p className="text-slate-200 text-sm leading-relaxed">{result.playbook.crunchTime}</p>
                 </div>
                 
                 <div className="bg-rose-900/40 border border-rose-400/30 rounded-2xl p-5 shrink-0">
                   <h4 className="font-bold text-rose-300 mb-2 flex flex-col gap-1">
                     {t.result.scenarios.burnoutSigns}
                   </h4>
                   <p className="text-slate-200 text-sm leading-relaxed">{result.playbook.burnoutSigns}</p>
                 </div>

                 <div className="bg-amber-900/40 border border-amber-400/30 rounded-2xl p-5 shrink-0">
                   <h4 className="font-bold text-amber-300 mb-2 flex flex-col gap-1">
                     {t.result.scenarios.negativeFeedback}
                   </h4>
                   <p className="text-slate-200 text-sm leading-relaxed">{result.playbook.negativeFeedback}</p>
                 </div>
               </motion.div>
             )}

             {activeTab === 'manual' && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                 className="flex flex-col h-full bg-white text-slate-800 rounded-2xl shadow-inner border border-slate-200 overflow-hidden"
                 role="tabpanel"
                 id="panel-manual"
                 aria-labelledby="tab-manual"
               >
                 <div className="bg-slate-100 p-3 px-5 border-b border-slate-200 flex justify-between items-center shrink-0">
                   <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                     {t.result.shareWithTeam}
                   </span>
                   <button 
                     onClick={handleCopy}
                     className="px-3 py-1.5 bg-white border border-slate-300 hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg text-sm font-bold text-slate-700 transition-all flex items-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 active:scale-95 hover:-translate-y-0.5 hover:shadow-md"
                     aria-label={t.common.copyText}
                     title={t.common.copyText}
                   >
                     {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                     {copied ? t.common.copied : t.common.copyText}
                   </button>
                 </div>
                 <div className="p-5 md:p-6 overflow-y-auto text-sm md:text-base leading-relaxed text-slate-700 whitespace-pre-wrap select-all font-medium  rtl:text-right">
                   {manualText}
                 </div>
               </motion.div>
             )}
          </motion.div>

          {/* Actionable Tips */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="order-3 lg:order-2 lg:col-span-4 bg-[var(--ok-soft)] rounded-[var(--r-xl)] border border-[var(--ok-soft)] p-5 md:p-6 flex flex-col h-full shadow-[var(--shadow-sm)]"
          >
            <div className="flex items-center gap-3 mb-6 shrink-0">
              <div className="w-10 h-10 bg-[var(--ok)] rounded-full flex items-center justify-center text-[var(--paper)] font-bold shrink-0 shadow-[var(--shadow-xs)]">
                !
              </div>
              <h3 className="h3 text-[var(--ok-ink)]">{t.result.actionableTips}</h3>
            </div>
            
            <ul className="space-y-4 flex-grow overflow-y-auto pr-2 rtl:pl-2 rtl:pr-0">
              {isLoadingInsights ? (
                <div className="flex flex-col gap-4 my-4 animate-pulse w-full">
                  <div className="flex gap-3"><div className="w-4 h-4 bg-[var(--ok)] opacity-30 rounded-[var(--r-xs)]"></div><div className="h-3 bg-[var(--border)] rounded-full w-full mt-0.5"></div></div>
                  <div className="flex gap-3"><div className="w-4 h-4 bg-[var(--ok)] opacity-30 rounded-[var(--r-xs)]"></div><div className="h-3 bg-[var(--border)] rounded-full w-5/6 mt-0.5"></div></div>
                  <div className="flex gap-3"><div className="w-4 h-4 bg-[var(--ok)] opacity-30 rounded-[var(--r-xs)]"></div><div className="h-3 bg-[var(--border)] rounded-full w-4/5 mt-0.5"></div></div>
                </div>
              ) : (
                (dynamicInsights?.tips || result.tips).map((tip, idx) => (
                  <li key={idx} className="flex gap-3 items-start shrink-0">
                    <div className="w-4 h-4 mt-1 rounded-[var(--r-xs)] bg-[var(--ok)] opacity-70 flex-shrink-0" />
                    <p className="body-sm md:body text-[var(--ok-ink)] font-medium">
                      {tip}
                    </p>
                  </li>
                ))
              )}
            </ul>
          </motion.div>
          
           {/* Summary Graphic / Extra Box */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
            className="order-4 lg:order-4 lg:col-span-4 rounded-[var(--r-xl)] shadow-[var(--shadow-sm)] bg-white border border-slate-200 p-5 md:p-8 text-slate-800 flex flex-col justify-between h-full relative overflow-hidden"
          >
             <div className="flex flex-col h-full relative z-10">
               <h3 className="h3 text-slate-800 mb-2 shrink-0">{t.result.languageBreakdown}</h3>
               
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                 className="h-64 sm:h-56 md:h-72 mb-6 mt-4 shrink-0 flex items-center justify-center w-full" 
                 dir="ltr"
               >
                 {(() => {
                    const size = 260;
                    const center = size / 2;
                    const innerRadius = 35;
                    const maxRadius = 90;
                    const numOptions = sortedOptions.length;
                    const angleStep = (Math.PI * 2) / numOptions;
                    
                    return (
                      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible max-w-[320px]">
                        {/* Background Wedges */}
                        {sortedOptions.map((optionId, i) => {
                          const startAngle = i * angleStep;
                          const endAngle = (i + 1) * angleStep;
                          const color = OptionColors[optionId];
                          const path = arc()({
                            innerRadius,
                            outerRadius: maxRadius,
                            startAngle,
                            endAngle,
                            cornerRadius: 4,
                            padAngle: 0.05
                          });
                          return <path key={`bg-${optionId}`} d={path || undefined} fill={color} opacity={0.15} transform={`translate(${center}, ${center})`} />;
                        })}

                        {/* Foreground Wedges */}
                        {sortedOptions.map((optionId, i) => {
                          const percentage = Math.round((scores[optionId] / totalAnswers) * 100);
                          const radius = innerRadius + (maxRadius - innerRadius) * (percentage / 100);
                          const startAngle = i * angleStep;
                          const endAngle = (i + 1) * angleStep;
                          const color = OptionColors[optionId];
                          const path = arc()({
                            innerRadius,
                            outerRadius: Math.max(innerRadius + 5, radius),
                            startAngle,
                            endAngle,
                            cornerRadius: 4,
                            padAngle: 0.05
                          });
                          return <path key={`fg-${optionId}`} d={path || undefined} fill={color} transform={`translate(${center}, ${center})`} />;
                        })}

                        {/* Grid Overlay (Concentric circles) */}
                        {[1, 2, 3].map(step => {
                          const r = innerRadius + ((maxRadius - innerRadius) / 4) * step;
                          return <circle key={step} cx={center} cy={center} r={r} fill="none" stroke="#fff" strokeWidth={1.5} opacity={0.9} />;
                        })}
                        
                        {/* Labels */}
                        {sortedOptions.map((optionId, i) => {
                          const midAngle = (i + 0.5) * angleStep;
                          const labelRadius = maxRadius + 18;
                          const x = center + labelRadius * Math.sin(midAngle);
                          const y = center - labelRadius * Math.cos(midAngle);
                          
                          let rot = (midAngle * 180) / Math.PI - 90;
                          let anchor = "start";
                          if (midAngle > Math.PI) {
                            rot += 180;
                            anchor = "end";
                          }

                          return (
                            <text
                              key={`label-${optionId}`}
                              x={x}
                              y={y}
                              fill={OptionColors[optionId]}
                              fontSize={11}
                              fontWeight="bold"
                              fontFamily="var(--font-ui)"
                              textAnchor={anchor}
                              dominantBaseline="middle"
                              transform={`rotate(${rot}, ${x}, ${y})`}
                            >
                              {scoreLabels[optionId as OptionId]}
                            </text>
                          );
                        })}
                        
                        {/* Center Image / Icon */}
                        <circle cx={center} cy={center} r={innerRadius - 4} fill="white" stroke="#e2e8f0" strokeWidth={1} />
                        {(() => {
                          const Icon = OptionIcons[resultId] || HeartHandshake;
                          return (
                            <svg x={center - 12} y={center - 12} width={24} height={24}>
                              <Icon width={24} height={24} color={OptionColors[resultId]} />
                            </svg>
                          );
                        })()}
                      </svg>
                    );
                 })()}
               </motion.div>

               <div className="space-y-4 overflow-y-auto pr-2 flex-grow rtl:pl-2 rtl:pr-0 mt-2">
                 {sortedOptions.map((optionId, index) => {
                   const percentage = Math.round((scores[optionId] / totalAnswers) * 100);
                   const Icon = OptionIcons[optionId];
                   const color = OptionColors[optionId];
                   return (
                     <div key={optionId} className="shrink-0">
                        <div className="flex justify-between items-center text-sm mb-1.5 rtl:flex-row-reverse">
                          <span className="font-bold flex items-center gap-2 rtl:flex-row-reverse text-slate-700">
                            <Icon size={16} color={color} />
                            {scoreLabels[optionId as OptionId]}
                          </span>
                          <span className="font-bold font-mono tracking-tight text-slate-600">{percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner" dir="ltr">
                          <motion.div
                             initial={{ width: 0 }}
                             animate={{ width: `${percentage}%` }}
                             transition={{ duration: 1, ease: "easeOut", delay: 0.8 + index * 0.15 }}
                             className="h-full origin-left rtl:origin-right"
                             style={{ backgroundColor: color }}
                          />
                        </div>
                     </div>
                   );
                 })}
               </div>
             </div>
             
             <div className="mt-8 pt-4 border-t border-slate-200 eyebrow text-center shrink-0">
                <span className="text-slate-500">{t.result.aiPoweredInsight}</span>
             </div>
          </motion.div>

          {/* Feedback Link */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="order-5 lg:col-span-12 flex justify-center mt-4 mb-2"
          >
            <button 
              onClick={() => setShowFeedbackModal(true)}
              className="text-slate-600 hover:text-sky-700 text-sm font-bold transition-all flex items-center gap-2 bg-slate-100 hover:bg-sky-50 px-5 py-2.5 rounded-full border border-slate-200 shadow-sm hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 active:scale-95 hover:-translate-y-0.5"
              title={t.result.feedback.text}
            >
              <MessageSquareHeart size={16} />
              {t.result.feedback.text}
            </button>
          </motion.div>

        </div>

        <footer className="mt-8 pt-6 border-t border-[var(--border-faint)] w-full flex flex-col items-center gap-6 text-xs text-[var(--fg-muted)] pb-4">
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
            <Link to="/terms" className="hover:text-[var(--fg)] hover:underline">{l.terms}</Link>
            <Link to="/privacy" className="hover:text-[var(--fg)] hover:underline">{l.privacy}</Link>
            <Link to="/accessibility" className="hover:text-[var(--fg)] hover:underline">{l.accessibility}</Link>
          </nav>
        </footer>
      </main>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-dialog-title"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-md w-full border border-slate-100"
          >
            {feedbackSent ? (
               <div className="flex flex-col items-center justify-center py-8 text-center text-emerald-600">
                 <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                   <Check className="w-8 h-8" />
                 </div>
                 <h3 className="text-xl font-bold" id="feedback-dialog-title">{t.result.feedback.thanks}</h3>
               </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center shrink-0">
                    <MessageSquareHeart size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800" id="feedback-dialog-title">{t.result.feedback.text}</h3>
                </div>
                
                <textarea 
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder={t.result.feedback.placeholder}
                  className="w-full h-32 p-4 bg-slate-50 border border-slate-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-slate-800"
                  required
                  aria-label={t.result.feedback.placeholder}
                />
                
                <div className="flex gap-3 justify-end mt-2">
                  <button 
                    type="button"
                    onClick={() => setShowFeedbackModal(false)}
                    className="px-5 py-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1"
                  >
                    {t.common.cancel}
                  </button>
                  <button 
                    type="submit"
                    disabled={!feedbackText.trim()}
                    className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-sky-600/30 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                  >
                    {t.result.feedback.submit}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
