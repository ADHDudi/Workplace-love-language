import { describe, it, expect } from 'vitest';
import { questions as questionsEn, results as resultsEn } from './quizData';
import { questions_he as questionsHe, results_he as resultsHe } from './quizData.he';

describe('Quiz Data Structures Validation', () => {
  it('should have the same number of questions in English and Hebrew', () => {
    expect(questionsEn.length).toBe(questionsHe.length);
    expect(questionsEn.length).toBe(9); // We expect exactly 9 questions
  });

  it('should have matching question IDs and option structures', () => {
    questionsEn.forEach((qEn, index) => {
      const qHe = questionsHe[index];
      
      // Verify IDs match
      expect(qHe.id).toBe(qEn.id);
      
      // Verify options length matches (should be 5 options per question)
      expect(qEn.options.length).toBe(5);
      expect(qHe.options.length).toBe(5);
      
      // Verify option IDs match and are A, B, C, D, E in order
      const expectedOptionIds = ['A', 'B', 'C', 'D', 'E'];
      
      qEn.options.forEach((opt, i) => {
        expect(opt.id).toBe(expectedOptionIds[i]);
      });
      
      qHe.options.forEach((opt, i) => {
        expect(opt.id).toBe(expectedOptionIds[i]);
      });
    });
  });

  it('should have matching result keys (A, B, C, D, E) in English and Hebrew', () => {
    const keysEn = Object.keys(resultsEn).sort();
    const keysHe = Object.keys(resultsHe).sort();
    
    const expectedKeys = ['A', 'B', 'C', 'D', 'E'];
    expect(keysEn).toEqual(expectedKeys);
    expect(keysHe).toEqual(expectedKeys);
  });

  it('should have all fields defined in results objects', () => {
    const expectedKeys = ['A', 'B', 'C', 'D', 'E'] as const;
    
    expectedKeys.forEach(key => {
      const resEn = resultsEn[key];
      const resHe = resultsHe[key];
      
      // Check English
      expect(resEn.id).toBe(key);
      expect(resEn.title).toBeDefined();
      expect(resEn.subtitle).toBeDefined();
      expect(resEn.meaning).toBeDefined();
      expect(resEn.insights).toBeDefined();
      expect(resEn.tips.length).toBeGreaterThan(0);
      expect(resEn.userManualTemplate).toBeDefined();
      expect(resEn.playbook.crunchTime).toBeDefined();
      expect(resEn.playbook.burnoutSigns).toBeDefined();
      expect(resEn.playbook.negativeFeedback).toBeDefined();
      
      // Check Hebrew
      expect(resHe.id).toBe(key);
      expect(resHe.title).toBeDefined();
      expect(resHe.subtitle).toBeDefined();
      expect(resHe.meaning).toBeDefined();
      expect(resHe.insights).toBeDefined();
      expect(resHe.tips.length).toBeGreaterThan(0);
      expect(resHe.userManualTemplate).toBeDefined();
      expect(resHe.playbook.crunchTime).toBeDefined();
      expect(resHe.playbook.burnoutSigns).toBeDefined();
      expect(resHe.playbook.negativeFeedback).toBeDefined();
    });
  });
});
