import { describe, it, expect } from 'vitest';
import { calculateScores, sortOptionsByScore, determinePrimaryStyle } from './scoring';
import { OptionId } from '../data/quizData';

describe('Scoring Utilities', () => {
  describe('calculateScores', () => {
    it('should correctly count options when all answers are the same', () => {
      const answers: Record<number, OptionId> = {
        0: 'A',
        1: 'A',
        2: 'A',
        3: 'A',
      };
      const result = calculateScores(answers);
      expect(result).toEqual({ A: 4, B: 0, C: 0, D: 0, E: 0 });
    });

    it('should correctly count options with a mix of answers', () => {
      const answers: Record<number, OptionId> = {
        0: 'A',
        1: 'B',
        2: 'C',
        3: 'D',
        4: 'E',
        5: 'A',
        6: 'B',
      };
      const result = calculateScores(answers);
      expect(result).toEqual({ A: 2, B: 2, C: 1, D: 1, E: 1 });
    });

    it('should return all zeros for empty answers', () => {
      const result = calculateScores({});
      expect(result).toEqual({ A: 0, B: 0, C: 0, D: 0, E: 0 });
    });
  });

  describe('sortOptionsByScore', () => {
    it('should sort options in descending order of score', () => {
      const scores: Record<OptionId, number> = {
        A: 2,
        B: 5,
        C: 1,
        D: 4,
        E: 0,
      };
      const sorted = sortOptionsByScore(scores);
      expect(sorted).toEqual(['B', 'D', 'A', 'C', 'E']);
    });

    it('should maintain stable sorting order or fall back for tied scores', () => {
      const scores: Record<OptionId, number> = {
        A: 3,
        B: 3,
        C: 1,
        D: 1,
        E: 0,
      };
      const sorted = sortOptionsByScore(scores);
      // 'A' and 'B' are tied at 3, 'C' and 'D' are tied at 1
      expect(sorted[0]).toBe('A');
      expect(sorted[1]).toBe('B');
      expect(sorted[2]).toBe('C');
      expect(sorted[3]).toBe('D');
      expect(sorted[4]).toBe('E');
    });
  });

  describe('determinePrimaryStyle', () => {
    it('should return the style with the highest score', () => {
      const scores: Record<OptionId, number> = {
        A: 1,
        B: 2,
        C: 5,
        D: 0,
        E: 1,
      };
      expect(determinePrimaryStyle(scores)).toBe('C');
    });

    it('should handle ties by choosing the first alphabet-ordered option', () => {
      const scores: Record<OptionId, number> = {
        A: 3,
        B: 3,
        C: 1,
        D: 1,
        E: 0,
      };
      expect(determinePrimaryStyle(scores)).toBe('A');
    });
  });
});
