import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { LegalPage } from './components/LegalPage';
import { TeamDashboard } from './components/TeamDashboard';
import { OptionId } from './data/quizData';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AccountActions } from './components/AccountActions';
import { Loader2, Home } from 'lucide-react';
import { calculateScores, determinePrimaryStyle } from './lib/scoring';
import { saveAssessmentResult, getAssessmentResult } from './lib/dbService';
import { clearProgress } from './lib/progressService';

export type AppState = 'welcome' | 'quiz' | 'result' | 'shared-result' | 'team-dashboard';

function TopBar({ onOpenDashboard }: { onOpenDashboard?: () => void }) {
  return (
    <div className="fixed top-0 left-0 right-0 h-10 md:h-14 bg-white/80 backdrop-blur-md border-b border-slate-200 z-40 flex items-center justify-end px-3 md:px-6 gap-2 md:gap-4">
      <AccountActions onOpenDashboard={onOpenDashboard} />
    </div>
  );
}

function MainApp() {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [answers, setAnswers] = useState<Record<number, OptionId>>({});
  const [finalResult, setFinalResult] = useState<OptionId | null>(null);
  const [scores, setScores] = useState<Record<OptionId, number>>({ A: 0, B: 0, C: 0, D: 0, E: 0 });
  const [userRole, setUserRole] = useState<'manager' | 'employee'>('employee');
  const [resultDocId, setResultDocId] = useState<string | null>(null);
  const [isLoadingShared, setIsLoadingShared] = useState(false);
  const [sharedError, setSharedError] = useState<string | null>(null);
  const { dir } = useLanguage();
  const { user } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedId = urlParams.get('shared');
    if (sharedId) {
      setAppState('shared-result');
      setIsLoadingShared(true);
      getAssessmentResult(sharedId).then(result => {
        if (result) {
          setFinalResult(result.primaryStyle);
          setScores(result.scores);
          setUserRole(result.userRole);
        } else {
          setSharedError('Result not found.');
        }
        setIsLoadingShared(false);
      }).catch(err => {
        console.error("Failed to load shared result:", err);
        setSharedError('Failed to load result.');
        setIsLoadingShared(false);
      });
    }
  }, []);

  const startQuiz = (role: 'manager' | 'employee') => {
    setUserRole(role);
    setAnswers({});
    setScores({ A: 0, B: 0, C: 0, D: 0, E: 0 });
    setAppState('quiz');
  };

  const handleComplete = async (finalAnswers: Record<number, OptionId>) => {
    setAnswers(finalAnswers);
    const counts = calculateScores(finalAnswers);
    setScores(counts);
    const primary = determinePrimaryStyle(counts);
    setFinalResult(primary);
    setAppState('result');
    
    if (user) {
      try {
        const savedResult = await saveAssessmentResult({
          userRole,
          scores: counts,
          primaryStyle: primary,
          answers: finalAnswers
        });
        if (savedResult && savedResult.id) {
          setResultDocId(savedResult.id);
        }
        console.log("Assessment result saved successfully.");
      } catch (err) {
        console.error("Failed to save assessment result:", err);
      }
    }
  };

  const restart = () => {
    clearProgress();
    setAppState('welcome');
    setAnswers({});
    setFinalResult(null);
    setResultDocId(null);
    if (window.location.search.includes('shared=')) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  const openDashboard = () => setAppState('team-dashboard');
  // The result screen has its own header, which hosts the account actions instead of the global TopBar.
  const isShowingResult =
    (appState === 'result' && !!finalResult) ||
    (appState === 'shared-result' && !isLoadingShared && !sharedError && !!finalResult);
  const accountActions = <AccountActions onOpenDashboard={openDashboard} showEmail={false} />;

  return (
    <div className={`min-h-[100dvh] ${isShowingResult ? '' : 'pt-10 md:pt-14'} bg-slate-200 text-slate-900 font-sans flex justify-center items-center p-0 md:p-6 lg:p-12`} dir={dir}>
      {!isShowingResult && <TopBar onOpenDashboard={openDashboard} />}
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
              <ResultScreen resultId={finalResult} scores={scores} onRestart={restart} userRole={userRole} resultDocId={resultDocId} accountActions={accountActions} />
            </motion.div>
          )}
          {appState === 'shared-result' && (
            <motion.div
              key="shared-result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex flex-col bg-slate-50"
            >
              {isLoadingShared ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                  <Loader2 className="animate-spin text-sky-600 mb-4" size={48} />
                  <p className="text-slate-600 font-medium">Loading profile...</p>
                </div>
              ) : sharedError || !finalResult ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-red-500 font-medium mb-6">{sharedError || 'Result not found.'}</p>
                  <button 
                    onClick={restart}
                    className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 active:scale-95"
                  >
                    <Home size={18} />
                    Go to Home
                  </button>
                </div>
              ) : (
                <ResultScreen resultId={finalResult} scores={scores} onRestart={restart} userRole={userRole} isSharedView={true} accountActions={accountActions} />
              )}
            </motion.div>
          )}
          {appState === 'team-dashboard' && (
            <motion.div
              key="team-dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex flex-col bg-slate-50"
            >
              <TeamDashboard onBack={restart} />
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
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/terms" element={<><TopBar /><LegalPage pageType="terms" /></>} />
        <Route path="/privacy" element={<><TopBar /><LegalPage pageType="privacy" /></>} />
        <Route path="/accessibility" element={<><TopBar /><LegalPage pageType="accessibility" /></>} />
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
