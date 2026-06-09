import { describe, it, expect } from 'vitest';
import { translations } from './translations';

describe('Translations Dictionary Consistency', () => {
  const he = translations.he;
  const en = translations.en;

  // Helper function to compare structures recursively
  function compareKeys(obj1: any, obj2: any, path: string = '') {
    const keys1 = Object.keys(obj1).sort();
    const keys2 = Object.keys(obj2).sort();

    // Verify key names at the current level match exactly
    expect(keys1).toEqual(keys2);

    keys1.forEach(key => {
      const val1 = obj1[key];
      const val2 = obj2[key];
      const currentPath = path ? `${path}.${key}` : key;

      // Ensure types match
      expect(typeof val1).toBe(typeof val2);

      if (val1 && typeof val1 === 'object' && !Array.isArray(val1)) {
        compareKeys(val1, val2, currentPath);
      } else if (Array.isArray(val1)) {
        expect(Array.isArray(val2)).toBe(true);
        expect(val1.length).toBe(val2.length);
      }
    });
  }

  it('should have identical keys and structural type mapping between Hebrew and English translations', () => {
    compareKeys(he, en);
  });
});
