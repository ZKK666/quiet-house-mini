import { Injectable, NotFoundException } from '@nestjs/common';
import { buildings } from '../../mocks/buildings';
import { buildingNoiseDetails } from '../../mocks/building-noise-detail';
import { noiseFactorSummaries } from '../../mocks/noise-factors';
import { Building, BuildingDetailResponse, NoiseLevel } from '../../types';
import { scoreToLevel } from '../../common/utils/noise-level.util';

@Injectable()
export class BuildingService {
  getByCompound(
    compoundId: number,
    minScore?: number,
    levels?: string[],
    limit = 100,
  ): Building[] {
    const candidate = buildings.filter((building) => building.compoundId === compoundId);

    const withScoreFilter = typeof minScore === 'number' ? candidate.filter((b) => b.noiseScoreOverall >= minScore) : candidate;

    const normalizedLevels: NoiseLevel[] | undefined = levels?.length
      ? (levels.map((level) => level.toUpperCase()) as NoiseLevel[])
      : undefined;
    const withLevelFilter = normalizedLevels
      ? withScoreFilter.filter((b) => normalizedLevels.includes(b.noiseLevelOverall))
      : withScoreFilter;

    return withLevelFilter.slice(0, limit);
  }

  getDetailById(id: number): BuildingDetailResponse {
    const building = buildings.find((item) => item.id === id);
    if (!building) {
      throw new NotFoundException('Building not found');
    }

    const noiseDetail = buildingNoiseDetails.find((item) => item.buildingId === id);
    const noiseFactors = noiseFactorSummaries.find((item) => item.buildingId === id);

    return {
      building: {
        ...building,
        noiseLevelOverall: scoreToLevel(building.noiseScoreOverall),
      },
      noiseDetail,
      noiseFactors,
    };
  }
}
