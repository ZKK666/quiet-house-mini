export type NoiseLevel = 'QUIET' | 'NORMAL' | 'NOISY';

export function scoreToLevel(score: number): NoiseLevel {
  if (score < 40) return 'NOISY';
  if (score < 70) return 'NORMAL';
  return 'QUIET';
}

export function levelLabel(level: NoiseLevel): string {
  if (level === 'QUIET') return '安静';
  if (level === 'NORMAL') return '一般';
  return '嘈杂';
}

export function levelColor(level: NoiseLevel): string {
  if (level === 'QUIET') return '#34c759';
  if (level === 'NORMAL') return '#f7b500';
  return '#ff3b30';
}
