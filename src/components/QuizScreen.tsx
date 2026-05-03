import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { questions, OptionId } from '../data/quizData';

interface QuizScreenProps {
  onComplete: (answers: Record<number, OptionId>) => void;
}

export function QuizScreen({ onComplete }: QuizScreenProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, OptionId>>({});
  
  const question = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleSelectOption = (optionId: OptionId) => {
    const newAnswers = { ...answers, [question.id]: optionId };
    setAnswers(newAnswers);

    if (currentQuestionIndex < totalQuestions - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 300);
    } else {
      setTimeout(() => {
        onComplete(newAnswers);
      }, 300);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <div className="h-20 bg-white border-b border-slate-200 px-6 flex items-center shrink-0 z-10">
        <button 
          onClick={handleBack}
          disabled={currentQuestionIndex === 0}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${currentQuestionIndex === 0 ? 'opacity-0 cursor-default' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1 flex justify-center">
          <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
        </div>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      {/* Progress Bar Container */}
      <div className="w-full bg-sky-100 h-1 overflow-hidden shrink-0">
        <motion.div 
          className="bg-sky-600 h-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Question Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 flex justify-center">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col h-full"
            >
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 mb-6">
                <h2 className="text-2xl md:text-3xl font-black text-[#002060] leading-tight">
                  {question.text}
                </h2>
              </div>

              <div className="flex flex-col gap-4 pb-8">
                {question.options.map((option) => {
                  const isSelected = answers[question.id] === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelectOption(option.id)}
                      className={`text-left p-5 md:p-6 rounded-3xl border transition-all duration-200 ease-in-out flex items-start gap-4 ${
                        isSelected 
                          ? 'border-sky-600 bg-sky-50 text-sky-900 shadow-sm scale-[0.99]' 
                          : 'border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:bg-sky-50/50 hover:shadow-sm'
                      }`}
                    >
                      <div className={`w-6 h-6 shrink-0 mt-0.5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-sky-600' : 'border-slate-300'}`}>
                        {isSelected && <div className="w-3 h-3 bg-sky-600 rounded-full" />}
                      </div>
                      <span className={`text-base md:text-lg leading-relaxed ${isSelected ? 'font-medium' : ''}`}>
                        {option.text}
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
