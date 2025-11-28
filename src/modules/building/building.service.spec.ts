import { describe, expect, it } from 'vitest';
import { BuildingService } from './building.service';

const service = new BuildingService();

describe('BuildingService filtering', () => {
  it('respects limit parameter', () => {
    const results = service.getByCompound(101, undefined, undefined, 2);
    expect(results).toHaveLength(2);
    expect(results.map((b) => b.id)).toEqual([1001, 1002]);
  });

  it('applies minScore filtering', () => {
    const results = service.getByCompound(101, 70, undefined, undefined);
    expect(results.every((b) => b.noiseScoreOverall >= 70)).toBe(true);
    expect(results.map((b) => b.id)).toEqual([1001, 1002]);
  });

  it('applies level filtering case-insensitively', () => {
    const results = service.getByCompound(101, undefined, ['quiet'], undefined);
    expect(results.map((b) => b.id)).toEqual([1001, 1002]);
  });
});

describe('BuildingService detail aggregation', () => {
  it('backfills noise level from score', () => {
    const detail = service.getDetailById(1003);
    expect(detail.building.noiseLevelOverall).toBe('NORMAL');
  });
});
