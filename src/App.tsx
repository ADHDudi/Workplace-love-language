import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { LegalPage } from './components/LegalPage';
import { OptionId } from './data/quizData';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AdminFeedbackPanel } from './components/AdminFeedbackPanel';
import { ClipboardList } from 'lucide-react';
import { calculateScores, determinePrimaryStyle } from './lib/scoring';

export type AppState = 'welcome' | 'quiz' | 'result';

function TopBar() {
  const { user, isAdmin, signInWithGoogle, logout } = useAuth();
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-10 md:h-14 bg-white/80 backdrop-blur-md border-b border-slate-200 z-40 flex items-center justify-end px-3 md:px-6 gap-2 md:gap-4">
        {isAdmin && (
          <button 
            onClick={() => setIsAdminPanelOpen(true)}
            className="text-xs md:text-sm font-bold text-sky-600 hover:text-sky-700 bg-sky-50 px-2 md:px-3 py-1 md:py-1.5 rounded-lg border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 flex items-center gap-1.5"
          >
            <ClipboardList size={14} />
            <span className="hidden md:inline">Manage Feedback</span>
          </button>
        )}
        
        {user ? (
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-xs md:text-sm text-slate-600 hidden md:inline" dir="ltr">{user.email}</span>
            <button onClick={logout} className="text-xs md:text-sm font-bold text-slate-700 hover:text-slate-900 bg-slate-100 px-2 md:px-3 py-1 md:py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400">
              Sign Out
            </button>
          </div>
        ) : (
          <button onClick={signInWithGoogle} className="text-xs md:text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 px-3 md:px-4 py-1 md:py-1.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
            Sign In
          </button>
        )}
      </div>
      <AdminFeedbackPanel isOpen={isAdminPanelOpen} onClose={() => setIsAdminPanelOpen(false)} />
    </>
  );
}

function MainApp() {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [answers, setAnswers] = useState<Record<number, OptionId>>({});
  const [finalResult, setFinalResult] = useState<OptionId | null>(null);
  const [scores, setScores] = useState<Record<OptionId, number>>({ A: 0, B: 0, C: 0, D: 0, E: 0 });
  const [userRole, setUserRole] = useState<'manager' | 'employee'>('employee');
  const { dir } = useLanguage();

  const startQuiz = (role: 'manager' | 'employee') => {
    setUserRole(role);
    setAnswers({});
    setScores({ A: 0, B: 0, C: 0, D: 0, E: 0 });
    setAppState('quiz');
  };

  const handleComplete = (finalAnswers: Record<number, OptionId>) => {
    setAnswers(finalAnswers);
    const counts = calculateScores(finalAnswers);
    setScores(counts);
    const primary = determinePrimaryStyle(counts);
    setFinalResult(primary);
    setAppState('result');
  };

  const restart = () => {
    setAppState('welcome');
    setAnswers({});
    setFinalResult(null);
  };

  return (
    <div className="min-h-[100dvh] pt-10 md:pt-14 bg-slate-200 text-slate-900 font-sans flex justify-center items-center p-0 md:p-6 lg:p-12" dir={dir}>
      <div className="w-full max-w-5xl bg-slate-50 shadow-2xl md:rounded-[2.5rem] min-h-[100dvh] md:min-h-0 md:aspect-[4/3] md:max-h-[850px] relative overflow-hidden flex flex-col border border-slate-200/60 mt-10 md:mt-0">
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
              <QuizScreen onComplete={handleComplete} userRole={userRole} />
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
              <ResultScreen resultId={finalResult} scores={scores} onRestart={restart} userRole={userRole} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AppContent() {
  return (
    <BrowserRouter>
      <TopBar />
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/terms" element={<LegalPage pageType="terms" />} />
        <Route path="/privacy" element={<LegalPage pageType="privacy" />} />
        <Route path="/accessibility" element={<LegalPage pageType="accessibility" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}
