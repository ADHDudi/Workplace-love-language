/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { OptionId } from './data/quizData';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { translations } from './data/translations';

export type AppState = 'welcome' | 'quiz' | 'result';

function AppContent() {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [answers, setAnswers] = useState<Record<number, OptionId>>({});
  const [finalResult, setFinalResult] = useState<OptionId | null>(null);
  const [scores, setScores] = useState<Record<OptionId, number>>({ A: 0, B: 0, C: 0, D: 0, E: 0 });
  const { language, setLanguage, dir } = useLanguage();
  const t = translations[language];

  const startQuiz = () => {
    setAnswers({});
    setScores({ A: 0, B: 0, C: 0, D: 0, E: 0 });
    setAppState('quiz');
  };

  const handleComplete = (finalAnswers: Record<number, OptionId>) => {
    setAnswers(finalAnswers);
    // Calculate result
    const counts: Record<OptionId, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    Object.values(finalAnswers).forEach(answer => {
      counts[answer]++;
    });
    
    setScores(counts);

    let maxCount = -1;
    let maxOption: OptionId = 'A';
    
    // Find the one with max count
    (Object.keys(counts) as OptionId[]).forEach(key => {
      if (counts[key] > maxCount) {
        maxCount = counts[key];
        maxOption = key as OptionId;
      }
    });

    setFinalResult(maxOption);
    setAppState('result');
  };

  const restart = () => {
    setAppState('welcome');
    setAnswers({});
    setFinalResult(null);
  };

  return (
    <div className="min-h-[100dvh] bg-slate-200 text-slate-900 font-sans flex justify-center items-center p-0 md:p-6 lg:p-12" dir={dir}>
      <div className="w-full max-w-5xl bg-slate-50 shadow-2xl md:rounded-[2.5rem] min-h-[100dvh] md:min-h-0 md:aspect-[4/3] md:max-h-[850px] relative overflow-hidden flex flex-col border border-slate-200/60">
        <AnimatePresence mode="wait">
          {appState === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col bg-slate-50 overflow-y-auto"
            >
              <WelcomeScreen onStart={startQuiz} />
            </motion.div>
          )}
          {appState === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col bg-slate-50"
            >
              <QuizScreen onComplete={handleComplete} />
            </motion.div>
          )}
          {appState === 'result' && finalResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex flex-col bg-slate-50"
            >
              <ResultScreen resultId={finalResult} scores={scores} onRestart={restart} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
