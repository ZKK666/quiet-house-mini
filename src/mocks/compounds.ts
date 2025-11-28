import { Compound } from '../types';

export const compounds: Compound[] = [
  {
    id: 101,
    cityId: 1,
    name: '安静花园',
    location: { lat: 31.231, lng: 121.474 },
    overallNoiseScore: 82,
    overallNoiseLevel: 'QUIET',
    tags: ['远离主干道', '靠近公园'],
    modelMeta: { modelVersion: 'v1.0.0', dataVersion: '2025-11-26', source: 'MOCK' },
  },
  {
    id: 102,
    cityId: 1,
    name: '临江雅苑',
    location: { lat: 31.229, lng: 121.47 },
    overallNoiseScore: 64,
    overallNoiseLevel: 'NORMAL',
    tags: ['沿江'],
    modelMeta: { modelVersion: 'v1.0.0', dataVersion: '2025-11-26', source: 'MOCK' },
  },
  {
    id: 201,
    cityId: 2,
    name: '和风社区',
    location: { lat: 39.905, lng: 116.41 },
    overallNoiseScore: 72,
    overallNoiseLevel: 'QUIET',
    tags: ['靠近绿地'],
    modelMeta: { modelVersion: 'v1.0.0', dataVersion: '2025-11-26', source: 'MOCK' },
  },
];
