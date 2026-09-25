import { useState } from 'react';
import { ClipboardList, PieChart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AdminFeedbackPanel } from './AdminFeedbackPanel';

// Each page renders its own TopBar (not the router shell), so every route gets exactly one.
// The Dashboard button only shows on pages that pass onOpenDashboard.
export function TopBar({ onOpenDashboard }: { onOpenDashboard?: () => void }) {
  const { user, isAdmin, signInWithGoogle, logout } = useAuth();
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-10 md:h-14 bg-white/80 backdrop-blur-md border-b border-slate-200 z-40 flex items-center justify-end px-3 md:px-6 gap-2 md:gap-4">
        {isAdmin && (
          <div className="flex items-center gap-2">
            {onOpenDashboard && (
              <button
                onClick={onOpenDashboard}
                className="text-xs md:text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2 md:px-3 py-1 md:py-1.5 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center gap-1.5"
              >
                <PieChart size={14} />
                <span className="hidden md:inline">Dashboard</span>
              </button>
            )}
            <button
              onClick={() => setIsAdminPanelOpen(true)}
              className="text-xs md:text-sm font-bold text-sky-600 hover:text-sky-700 bg-sky-50 px-2 md:px-3 py-1 md:py-1.5 rounded-lg border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 flex items-center gap-1.5"
            >
              <ClipboardList size={14} />
              <span className="hidden md:inline">Manage Feedback</span>
            </button>
          </div>
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
