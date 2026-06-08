import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ClipboardList, Clock, Zap } from 'lucide-react';
import { listFeedbacks, updateFeedbackRead, UserFeedback } from '../lib/dbService';

export function AdminFeedbackPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [feedbacks, setFeedbacks] = useState<UserFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read'>('all');

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const data = await listFeedbacks();
      setFeedbacks(data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFeedbacks();
    }
  }, [isOpen]);

  const toggleRead = async (id: string, currentReadStatus: boolean) => {
    try {
      await updateFeedbackRead(id, !currentReadStatus);
      setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, read: !currentReadStatus } : f));
    } catch (error) {
      console.error("Error updating feedback:", error);
    }
  };

  const filteredFeedbacks = feedbacks.filter(fb => {
    if (activeTab === 'unread') return !fb.read;
    if (activeTab === 'read') return fb.read;
    return true;
  });

  const unreadCount = feedbacks.filter(f => !f.read).length;
  const readCount = feedbacks.length - unreadCount;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-4xl bg-white rounded-2xl flex flex-col shadow-2xl overflow-hidden max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="text-indigo-600">
                  <ClipboardList size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">User Feedback Management</h2>
              </div>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors" title="Close">
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="px-6 py-4 flex gap-6 border-b border-slate-50 shrink-0">
              <button 
                onClick={() => setActiveTab('all')}
                className={`font-semibold px-4 py-2 rounded-xl transition-all ${activeTab === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                All ({feedbacks.length})
              </button>
              <button 
                onClick={() => setActiveTab('unread')}
                className={`font-semibold px-4 py-2 rounded-xl transition-all ${activeTab === 'unread' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                Unread ({unreadCount})
              </button>
              <button 
                onClick={() => setActiveTab('read')}
                className={`font-semibold px-4 py-2 rounded-xl transition-all ${activeTab === 'read' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                Read ({readCount})
              </button>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-slate-50/50">
              {loading ? (
                <div className="flex justify-center p-8 text-slate-400">Loading feedback...</div>
              ) : filteredFeedbacks.length === 0 ? (
                <div className="text-center text-slate-500 p-8">No feedback found.</div>
              ) : (
                filteredFeedbacks.map((fb) => (
                  <div key={fb.id} className="bg-white rounded-xl border border-indigo-50/80 p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:border-indigo-100 transition-colors">
                    
                    {/* Top Row: Name, Email, Stars, Button */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-slate-800 text-lg">{fb.userName || "Anonymous"}</span>
                        <span className="text-slate-400 text-sm">({fb.userEmail || "no-email@example.com"})</span>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="flex gap-1" dir="ltr">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Zap 
                              key={star} 
                              size={18} 
                              className={star <= (fb.rating || 0) ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-100"} 
                            />
                          ))}
                        </div>
                        
                        <button 
                          onClick={() => fb.id && toggleRead(fb.id, fb.read)}
                          className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-colors border ${
                            fb.read 
                              ? 'border-slate-200 text-slate-500 hover:bg-slate-50' 
                              : 'border-indigo-100 bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                          }`}
                        >
                          {fb.read ? "Mark Unread" : "Mark Read"}
                        </button>
                      </div>
                    </div>
                    
                    {/* Second Row: Date, Tags */}
                    <div className="flex flex-wrap items-center gap-3 mb-4 text-xs font-medium">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Clock size={14} />
                        {fb.createdAt ? new Date(fb.createdAt.seconds * 1000).toLocaleString() : "Just now"}
                      </div>
                      <div className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded uppercase tracking-wider text-[10px]">
                        {fb.source}
                      </div>
                      {fb.id && (
                        <div className="text-slate-300 font-mono text-[10px]">
                          ({fb.id.slice(-6).toUpperCase()})
                        </div>
                      )}
                    </div>
                    
                    {/* Third Row: Feedback Text */}
                    {fb.feedbackText && (
                      <div className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed max-w-4xl" dir="auto">
                        {fb.feedbackText}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
