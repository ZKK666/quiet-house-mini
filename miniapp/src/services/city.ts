import { request } from './request';
import type { City, Compound } from '../types';

export function fetchCities() {
  return request<City[]>({ url: '/cities' });
}

export function fetchCompounds(params: { cityId: number; bbox?: string; limit?: number; mockScene?: 'normal' | 'empty' | 'error' }) {
  const { cityId, bbox, limit, mockScene } = params;
  return request<Compound[]>({
    url: `/cities/${cityId}/compounds`,
    data: { bbox, limit },
    mockScene
  });
}
