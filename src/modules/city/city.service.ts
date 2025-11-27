import { Injectable } from '@nestjs/common';
import { cities } from '../../mocks/cities';
import { City } from '../../types';

@Injectable()
export class CityService {
  getAll(): City[] {
    return cities;
  }

  getById(id: number): City | undefined {
    return cities.find((city) => city.id === id);
  }
}
