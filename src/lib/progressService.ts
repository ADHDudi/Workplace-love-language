import { OptionId } from '../data/quizData';

export interface SavedProgress {
  answers: Record<number, OptionId>;
  currentQuestionIndex: number;
  userRole: 'manager' | 'employee';
  timestamp: number;
}

const STORAGE_KEY = 'quiz_progress';

export const saveProgress = (progress: Omit<SavedProgress, 'timestamp'>) => {
  if (typeof window === 'undefined') return;
  const data: SavedProgress = {
    ...progress,
    timestamp: Date.now()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getSavedProgress = (): SavedProgress | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SavedProgress;
  } catch {
    return null;
  }
};

export const clearProgress = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};
