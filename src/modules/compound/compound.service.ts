import { Injectable, NotFoundException } from '@nestjs/common';
import { compounds } from '../../mocks/compounds';
import { Compound } from '../../types';

@Injectable()
export class CompoundService {
  getByCity(cityId: number, bbox?: number[], limit = 100): Compound[] {
    const candidates = compounds.filter((compound) => compound.cityId === cityId);

    const withinBbox = bbox && bbox.length === 4
      ? candidates.filter((compound) =>
          compound.location.lat >= bbox[0] &&
          compound.location.lng >= bbox[1] &&
          compound.location.lat <= bbox[2] &&
          compound.location.lng <= bbox[3],
        )
      : candidates;

    return withinBbox.slice(0, limit);
  }

  getById(id: number): Compound {
    const compound = compounds.find((item) => item.id === id);
    if (!compound) {
      throw new NotFoundException('Compound not found');
    }
    return compound;
  }
}
