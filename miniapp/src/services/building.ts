import { request } from './request';
import type { BuildingDetailResponse } from '../types';

export function fetchBuildingDetail(id: number) {
  return request<BuildingDetailResponse>({ url: `/buildings/${id}` });
}
