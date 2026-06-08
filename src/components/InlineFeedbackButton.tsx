import { useState } from 'react';
import { MessageSquareHeart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { FeedbackModal } from './FeedbackModal';
import { useLanguage } from '../contexts/LanguageContext';

export function InlineFeedbackButton() {
  const { user, signInWithGoogle } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();

  const handleClick = async () => {
    if (!user) {
      await signInWithGoogle();
      // Only open if login was successful
      setIsOpen(true);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="w-full flex justify-center mt-6 mb-2 shrink-0">
      <button
        onClick={handleClick}
        className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3.5 rounded-[var(--r-lg)] shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 flex items-center justify-center gap-2.5 font-bold text-sm w-full max-w-sm"
      >
        <MessageSquareHeart size={20} />
        {language === 'he' ? 'שתף/י איתנו משוב' : 'Provide Feedback'}
      </button>
      <FeedbackModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        source="result_page"
      />
    </div>
  );
}
