import { NoiseLevel } from '../../types';

export function scoreToLevel(score: number): NoiseLevel {
  if (score < 40) return 'NOISY';
  if (score < 70) return 'NORMAL';
  return 'QUIET';
}
