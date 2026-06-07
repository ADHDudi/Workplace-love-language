import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Circle, Mail, Clock, RefreshCcw } from 'lucide-react';
import { listFeedbacks, updateFeedbackRead, UserFeedback } from '../lib/dbService';

export function AdminFeedbackPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [feedbacks, setFeedbacks] = useState<UserFeedback[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-slate-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full max-w-md h-full bg-slate-50 flex flex-col shadow-2xl border-l border-slate-200"
          >
            <div className="p-6 bg-white border-b border-slate-200 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Feedback Management</h2>
                <div className="flex gap-4 mt-2 text-sm text-slate-600">
                  <span className="font-semibold text-emerald-600">Total: {feedbacks.length}</span>
                  <span className="font-semibold text-sky-600">Unread: {feedbacks.filter(f => !f.read).length}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={fetchFeedbacks} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full" title="Refresh">
                  <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
                </button>
                <button onClick={onClose} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full" title="Close">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {loading ? (
                <div className="flex justify-center p-8"><RefreshCcw className="animate-spin text-slate-400" /></div>
              ) : feedbacks.length === 0 ? (
                <div className="text-center text-slate-500 p-8">No feedback found.</div>
              ) : (
                feedbacks.map((fb) => (
                  <div key={fb.id} className={`bg-white rounded-xl border p-4 shadow-sm transition-all ${fb.read ? 'border-slate-200 opacity-70' : 'border-sky-300 shadow-md'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 flex items-center gap-2">
                          <Mail size={14} className="text-slate-400"/> {fb.userEmail || "Anonymous"}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Clock size={12} /> {fb.createdAt ? new Date(fb.createdAt.seconds * 1000).toLocaleString() : "Just now"}
                        </span>
                      </div>
                      <button 
                        onClick={() => fb.id && toggleRead(fb.id, fb.read)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${fb.read ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-sky-100 text-sky-700 hover:bg-sky-200'}`}
                      >
                        {fb.read ? <CheckCircle size={14} /> : <Circle size={14} />}
                        {fb.read ? "Mark Unread" : "Mark Read"}
                      </button>
                    </div>
                    
                    <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-700 whitespace-pre-wrap">
                      {fb.feedbackText}
                    </div>
                    
                    <div className="mt-3 text-xs text-slate-400 font-mono flex gap-2">
                      <span>Source: {fb.source}</span>
                      <span>|</span>
                      <span>By: {fb.userName || "N/A"}</span>
                    </div>
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
