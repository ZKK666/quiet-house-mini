import { describe, expect, it } from 'vitest';
import { scoreToLevel } from './noise-level.util';

describe('scoreToLevel', () => {
  it('maps low scores to NOISY', () => {
    expect(scoreToLevel(0)).toBe('NOISY');
    expect(scoreToLevel(39.9)).toBe('NOISY');
  });

  it('maps mid scores to NORMAL', () => {
    expect(scoreToLevel(40)).toBe('NORMAL');
    expect(scoreToLevel(69.9)).toBe('NORMAL');
  });

  it('maps high scores to QUIET', () => {
    expect(scoreToLevel(70)).toBe('QUIET');
    expect(scoreToLevel(100)).toBe('QUIET');
  });
});
