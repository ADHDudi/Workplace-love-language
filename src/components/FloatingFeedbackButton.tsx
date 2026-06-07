import { useState } from 'react';
import { MessageSquareHeart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { FeedbackModal } from './FeedbackModal';

export function FloatingFeedbackButton() {
  const { user, signInWithGoogle } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

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
    <>
      <button
        onClick={handleClick}
        className="fixed bottom-6 right-6 z-[60] bg-sky-600 hover:bg-sky-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-sky-500/50"
        title="Send Feedback"
      >
        <MessageSquareHeart size={24} />
      </button>
      <FeedbackModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        source="floating_button"
      />
    </>
  );
}
