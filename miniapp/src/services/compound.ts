import { request } from './request';
import type { Compound, Building } from '../types';

export function fetchCompound(id: number) {
  return request<Compound>({ url: `/compounds/${id}` });
}

export function fetchBuildings(params: { compoundId: number; minScore?: number; levels?: string; limit?: number }) {
  const { compoundId, ...rest } = params;
  return request<Building[]>({ url: `/compounds/${compoundId}/buildings`, data: rest });
}
