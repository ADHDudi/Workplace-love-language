import { OptionId } from '../data/quizData';

/**
 * Calculates score frequencies for each appreciation style option.
 */
export function calculateScores(answers: Record<number, OptionId>): Record<OptionId, number> {
  const counts: Record<OptionId, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  Object.values(answers).forEach(answer => {
    counts[answer]++;
  });
  return counts;
}

/**
 * Sorts all appreciation style options in descending order of their scores.
 */
export function sortOptionsByScore(scores: Record<OptionId, number>): OptionId[] {
  return (Object.keys(scores) as OptionId[]).sort((a, b) => scores[b] - scores[a]);
}

/**
 * Determines the primary appreciation style (highest scoring option).
 */
export function determinePrimaryStyle(scores: Record<OptionId, number>): OptionId {
  const sorted = sortOptionsByScore(scores);
  return sorted[0] || 'A';
}
