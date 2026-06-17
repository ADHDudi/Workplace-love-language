import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Loader2, Users, PieChart, BarChart3, ArrowLeft } from 'lucide-react';
import { listAllResults, AssessmentResult } from '../lib/dbService';
import { results as results_en, OptionId } from '../data/quizData';
import { results_he } from '../data/quizData.he';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';

interface TeamDashboardProps {
  onBack: () => void;
}

const OptionIcons: Record<OptionId, any> = {
  A: '💬',
  B: '☕',
  C: '🎁',
  D: '🤝',
  E: '✨'
};

export function TeamDashboard({ onBack }: TeamDashboardProps) {
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { language, dir } = useLanguage();
  const t = translations[language];
  const quizResults = language === 'he' ? results_he : results_en;

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await listAllResults();
        setResults(data);
      } catch (err) {
        console.error("Failed to load team results:", err);
        setError("Failed to load team dashboard data.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 h-full min-h-[500px]">
        <Loader2 className="animate-spin text-sky-600 mb-4" size={48} />
        <p className="text-slate-600 font-medium text-lg">Loading team analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 h-full text-center">
        <p className="text-red-500 font-medium mb-6 text-lg">{error}</p>
        <button 
          onClick={onBack}
          className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  const totalAssessments = results.length;
  
  // Count primary styles
  const styleCounts: Record<OptionId, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  results.forEach(r => {
    if (r.primaryStyle) {
      styleCounts[r.primaryStyle]++;
    }
  });

  const sortedStyles = (Object.keys(styleCounts) as OptionId[]).sort((a, b) => styleCounts[b] - styleCounts[a]);

  return (
    <motion.div 
      className="flex flex-col h-full bg-slate-50 relative rounded-[2.5rem] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      dir={dir}
    >
      <header className="p-4 md:p-6 bg-white border-b border-slate-200 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft size={24} className={dir === 'rtl' ? 'rotate-180' : ''} />
          </button>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2">
            <PieChart className="text-sky-500" />
            Team Dashboard
          </h2>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                <Users className="text-sky-600" size={24} />
              </div>
              <h3 className="text-slate-500 font-medium mb-1">Total Assessments</h3>
              <p className="text-4xl font-black text-slate-800">{totalAssessments}</p>
            </div>
            
            <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <BarChart3 className="text-emerald-500" size={20} />
                Love Language Distribution
              </h3>
              
              <div className="space-y-4">
                {sortedStyles.map(styleId => {
                  const count = styleCounts[styleId];
                  const percentage = totalAssessments > 0 ? Math.round((count / totalAssessments) * 100) : 0;
                  const resultData = quizResults[styleId];
                  
                  return (
                    <div key={styleId} className="flex flex-col gap-2">
                      <div className="flex justify-between items-end text-sm">
                        <span className="font-bold text-slate-700 flex items-center gap-2">
                          <span className="text-lg">{OptionIcons[styleId]}</span>
                          {resultData.title}
                        </span>
                        <span className="text-slate-500 font-medium">{count} ({percentage}%)</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                          className="h-full bg-sky-500 rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 md:p-6 border-b border-slate-200 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">Recent Responses</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-bold w-[30%]">User</th>
                    <th className="p-4 font-bold w-[20%]">Role</th>
                    <th className="p-4 font-bold w-[50%]">Primary Language</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {results.slice(0, 10).map((result, i) => (
                    <tr key={result.id || i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-medium text-slate-800">
                        {result.userName || result.userEmail || 'Anonymous User'}
                      </td>
                      <td className="p-4 text-slate-600 capitalize">
                        {result.userRole || 'employee'}
                      </td>
                      <td className="p-4 font-medium text-sky-700 flex items-center gap-2">
                        {OptionIcons[result.primaryStyle]} {quizResults[result.primaryStyle].title}
                      </td>
                    </tr>
                  ))}
                  {results.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-slate-500">
                        No assessments recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
