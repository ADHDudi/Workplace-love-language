import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { questions as questions_en, OptionId } from '../data/quizData';
import { questions_he } from '../data/quizData.he';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import { LanguageSwitcher } from './LanguageSwitcher';

interface QuizScreenProps {
  onComplete: (answers: Record<number, OptionId>) => void;
  userRole?: 'manager' | 'employee';
}

export function QuizScreen({ onComplete, userRole = 'employee' }: QuizScreenProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, OptionId>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { language, dir } = useLanguage();
  const t = translations[language];

  const questions = language === 'he' ? questions_he : questions_en;
  
  const question = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const adaptText = (text: string) => {
    let newText = text;
    if (language === 'en') {
      if (userRole === 'manager') {
        newText = newText.replace(/Your boss/g, 'Company leadership');
        newText = newText.replace(/your boss/g, 'company leadership');
        newText = newText.replace(/Your coworker /g, 'Your team member/peer ');
        newText = newText.replace(/your coworker/g, 'your team member/peer');
        newText = newText.replace(/A new manager is joining to lead your team/g, 'A new director is joining to lead your department');
      } else {
        newText = newText.replace("You’re a manager, your team had a great year", "Your team had a great year");
      }
    } else {
      if (userRole === 'manager') {
        newText = newText.replace(/מנהל\/ת/g, 'הנהלה');
        newText = newText.replace(/הבוס/g, 'ההנהלה');
        newText = newText.replace(/קולגה/g, 'חבר/ת צוות');
      } else {
        newText = newText.replace("את/ה מנהל/ת, לצוות שלך", "לצוות שלך");
      }
    }
    return newText;
  };

  const handleSelectOption = (optionId: OptionId) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const newAnswers = { ...answers, [question.id]: optionId };
    setAnswers(newAnswers);

    if (currentQuestionIndex < totalQuestions - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      setTimeout(() => {
        onComplete(newAnswers);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-[var(--bg)] font-ui text-[var(--fg)]">
      {/* Header */}
      <div className="h-16 md:h-20 bg-[var(--bg-card)] border-b border-[var(--border)] px-4 md:px-6 flex items-center shrink-0 z-10">
        <button 
          onClick={handleBack}
          disabled={currentQuestionIndex === 0}
          className={`w-8 h-8 md:w-10 md:h-10 rounded-[var(--r-md)] flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-1 ${currentQuestionIndex === 0 ? 'opacity-0 cursor-default' : 'bg-[var(--bg-subtle)] hover:bg-[var(--border)] text-[var(--fg-muted)]'}`}
          aria-label={dir === 'rtl' ? 'הקודם' : 'Go back'}
          title={dir === 'rtl' ? 'חזור לשאלה הקודמת' : 'Go back'}
          aria-hidden={currentQuestionIndex === 0}
        >
          {dir === 'rtl' ? <ChevronRight className="w-4 h-4 md:w-5 md:h-5" /> : <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />}
        </button>
        <div className="flex-1 flex justify-center">
          <span className="eyebrow" aria-live="polite" aria-atomic="true">
            {t.quiz.questionXofY.replace('{current}', String(currentQuestionIndex + 1)).replace('{total}', String(totalQuestions))}
          </span>
        </div>
        <div className="shrink-0 flex justify-end">
          <LanguageSwitcher className="px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm" compact />
        </div>
      </div>

      {/* Progress Bar Container */}
      <div 
        className="w-full bg-[var(--border)] h-1 overflow-hidden shrink-0" 
        dir="ltr"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div 
          className="bg-[var(--accent)] h-full origin-left rtl:origin-right"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Question Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 flex justify-center">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex + language}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col h-full"
            >
              <div className="bg-[var(--bg-card)] rounded-[var(--r-xl)] border border-[var(--border)] shadow-[var(--shadow-sm)] p-5 md:p-8 mb-4 md:mb-6">
                <h2 className="h2 text-center md:text-start">
                  {adaptText(question.text)}
                </h2>
              </div>
              
              <div className="flex flex-col gap-3 md:gap-4 pb-8">
                {question.options.map((option) => {
                  const isSelected = answers[question.id] === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelectOption(option.id)}
                      className={`text-start rtl:text-right p-4 md:p-6 rounded-[var(--r-lg)] border transition-all duration-[var(--dur-sm)] ease-in-out flex items-start gap-3 md:gap-4 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 ${
                        isSelected 
                          ? 'border-[var(--border-brand)] bg-[var(--accent-soft-bg)] text-[var(--accent-soft-fg)] shadow-[var(--shadow-xs)] scale-[0.99] ring-1 ring-[var(--border-brand)]' 
                          : 'border-[var(--border)] bg-[var(--bg-card)] text-[var(--fg)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-subtle)] hover:shadow-[var(--shadow-xs)]'
                      }`}
                      aria-pressed={isSelected}
                    >
                      <div className={`w-5 h-5 md:w-6 md:h-6 shrink-0 mt-0.5 md:mt-1 rounded-full border-[1.5px] flex items-center justify-center ${isSelected ? 'border-[var(--accent)]' : 'border-[var(--border-strong)]'}`}>
                        {isSelected && <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[var(--accent)] rounded-full" />}
                      </div>
                      <span className={`text-sm sm:text-base md:text-lg leading-relaxed ${isSelected ? 'font-medium' : ''}`}>
                        {adaptText(option.text)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
