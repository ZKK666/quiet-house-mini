import { BuildingNoiseDetail } from '../types';

export const buildingNoiseDetails: BuildingNoiseDetail[] = [
  {
    buildingId: 1001,
    timePeriod: 'OVERALL',
    floorNoiseList: [
      { floor: 1, noiseScore: 60 },
      { floor: 5, noiseScore: 72 },
      { floor: 10, noiseScore: 82 },
      { floor: 18, noiseScore: 85 },
    ],
    notes: '中高层更优',
  },
  {
    buildingId: 1002,
    timePeriod: 'OVERALL',
    floorNoiseList: [
      { floor: 2, noiseScore: 62 },
      { floor: 6, noiseScore: 72 },
      { floor: 12, noiseScore: 78 },
      { floor: 15, noiseScore: 80 },
    ],
  },
  {
    buildingId: 1003,
    timePeriod: 'OVERALL',
    floorNoiseList: [
      { floor: 3, noiseScore: 45 },
      { floor: 8, noiseScore: 60 },
      { floor: 12, noiseScore: 68 },
      { floor: 16, noiseScore: 70 },
    ],
    notes: '临近出入口，低楼层较吵',
  },
  {
    buildingId: 2001,
    timePeriod: 'OVERALL',
    floorNoiseList: [
      { floor: 5, noiseScore: 50 },
      { floor: 12, noiseScore: 64 },
      { floor: 18, noiseScore: 68 },
      { floor: 22, noiseScore: 70 },
    ],
    notes: '临江低层噪音较高',
  },
  {
    buildingId: 3001,
    timePeriod: 'OVERALL',
    floorNoiseList: [
      { floor: 1, noiseScore: 65 },
      { floor: 8, noiseScore: 76 },
      { floor: 12, noiseScore: 80 },
      { floor: 16, noiseScore: 82 },
    ],
  },
];
