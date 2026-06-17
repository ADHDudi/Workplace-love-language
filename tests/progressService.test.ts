import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveProgress, getSavedProgress, clearProgress } from '../src/lib/progressService';
import { OptionId } from '../src/data/quizData';

describe('progressService', () => {
  beforeEach(() => {
    const store: Record<string, string> = {};
    const mockLocalStorage = {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        for (const key in store) delete store[key];
      })
    };
    vi.stubGlobal('localStorage', mockLocalStorage);
    vi.stubGlobal('window', {});
  });

  describe('saveProgress', () => {
    it('should save the current answers and question index to localStorage', () => {
      const answers: Record<number, OptionId> = { 1: 'A', 2: 'C' };
      const currentQuestionIndex = 2;
      const userRole = 'employee';

      saveProgress({ answers, currentQuestionIndex, userRole });

      const savedData = localStorage.getItem('quiz_progress');
      expect(savedData).not.toBeNull();
      
      const parsedData = JSON.parse(savedData!);
      expect(parsedData).toEqual({
        answers,
        currentQuestionIndex,
        userRole,
        timestamp: expect.any(Number)
      });
    });
  });

  describe('getSavedProgress', () => {
    it('should return saved progress from localStorage', () => {
      const answers: Record<number, OptionId> = { 1: 'B', 2: 'D', 3: 'A' };
      const currentQuestionIndex = 3;
      const userRole = 'manager';

      saveProgress({ answers, currentQuestionIndex, userRole });

      const result = getSavedProgress();
      expect(result).not.toBeNull();
      expect(result!.answers).toEqual(answers);
      expect(result!.currentQuestionIndex).toBe(3);
      expect(result!.userRole).toBe('manager');
    });

    it('should return null when no progress exists', () => {
      const result = getSavedProgress();
      expect(result).toBeNull();
    });
  });

  describe('clearProgress', () => {
    it('should remove saved progress from localStorage', () => {
      saveProgress({ answers: { 1: 'A' }, currentQuestionIndex: 1, userRole: 'employee' });
      expect(getSavedProgress()).not.toBeNull();

      clearProgress();
      expect(getSavedProgress()).toBeNull();
    });
  });
});
