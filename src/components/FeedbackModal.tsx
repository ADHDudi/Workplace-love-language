import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquareHeart, Check, Star } from 'lucide-react';
import { saveUserFeedback } from '../lib/dbService';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: string;
}

export function FeedbackModal({ isOpen, onClose, source }: FeedbackModalProps) {
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim() && rating === 0) return;
    
    setIsSubmitting(true);
    try {
      await saveUserFeedback({
        feedbackText,
        rating,
        source
      });
      setFeedbackSent(true);
      setTimeout(() => {
        onClose();
        setFeedbackSent(false);
        setFeedbackText("");
        setRating(0);
      }, 2500);
    } catch (error) {
      console.error("Failed to submit feedback", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-md w-full border border-slate-100"
          >
            {feedbackSent ? (
               <div className="flex flex-col items-center justify-center py-8 text-center text-emerald-600">
                 <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                   <Check className="w-8 h-8" />
                 </div>
                 <h3 className="text-xl font-bold">{t.result.feedback.thanks}</h3>
               </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center shrink-0">
                    <MessageSquareHeart size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">{t.result.feedback.text}</h3>
                </div>

                <div className="flex flex-col items-center mb-2">
                  <div className="flex gap-2" dir="ltr">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className={`p-1 transition-colors ${
                          (hoveredRating || rating) >= star 
                            ? 'text-amber-400' 
                            : 'text-slate-200'
                        }`}
                      >
                        <Star 
                          size={32} 
                          className={(hoveredRating || rating) >= star ? 'fill-amber-400' : ''} 
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 mt-2">
                    {language === 'he' ? 'דרג את החוויה שלך' : 'Rate your experience'}
                  </span>
                </div>
                
                <textarea 
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder={t.result.feedback.placeholder}
                  className="w-full h-32 p-4 bg-slate-50 border border-slate-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-slate-800"
                  required={rating === 0}
                />
                
                <div className="flex gap-3 justify-end mt-2">
                  <button 
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1"
                  >
                    {t.common.cancel}
                  </button>
                  <button 
                    type="submit"
                    disabled={(!feedbackText.trim() && rating === 0) || isSubmitting}
                    className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-sky-600/30 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 flex items-center justify-center"
                  >
                    {isSubmitting ? <span className="animate-pulse">...</span> : t.result.feedback.submit}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
