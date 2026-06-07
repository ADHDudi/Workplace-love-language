import { useState } from 'react';
import { MessageSquareHeart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { FeedbackModal } from './FeedbackModal';

export function FloatingFeedbackButton() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-sky-600 hover:bg-sky-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-sky-500/50"
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
