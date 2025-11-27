import { NoiseFactorSummary } from '../types';

export const noiseFactorSummaries: NoiseFactorSummary[] = [
  {
    buildingId: 1001,
    distanceToMainRoad: 150,
    distanceToSubRoad: 60,
    distanceToSubwayLine: 350,
    distanceToSubwayStation: 600,
    nearbyPois: [
      { type: 'PARK', name: '河滨公园', distance: 200 },
    ],
    shieldingLevel: 'HIGH',
    summary: '背靠绿化带且被其他楼栋遮挡，对道路噪音有较好屏蔽',
  },
  {
    buildingId: 1002,
    distanceToMainRoad: 200,
    distanceToSubRoad: 40,
    distanceToSubwayLine: 380,
    distanceToSubwayStation: 620,
    nearbyPois: [
      { type: 'SCHOOL', name: '实验小学', distance: 320 },
    ],
    shieldingLevel: 'MEDIUM',
    summary: '靠近内部道路，晚高峰可能有车辆噪音',
  },
  {
    buildingId: 1003,
    distanceToMainRoad: 80,
    distanceToSubRoad: 20,
    distanceToSubwayLine: 300,
    distanceToSubwayStation: 500,
    nearbyPois: [
      { type: 'MALL', name: '邻里中心', distance: 250 },
    ],
    shieldingLevel: 'LOW',
    summary: '靠近小区入口与商业，噪音较高',
  },
  {
    buildingId: 2001,
    distanceToMainRoad: 120,
    distanceToSubRoad: 35,
    distanceToSubwayLine: 500,
    distanceToSubwayStation: 750,
    nearbyPois: [
      { type: 'PARK', name: '江边绿道', distance: 180 },
    ],
    shieldingLevel: 'MEDIUM',
    summary: '沿江低层受道路和江面船只噪音影响',
  },
  {
    buildingId: 3001,
    distanceToMainRoad: 220,
    distanceToSubRoad: 90,
    distanceToSubwayLine: 410,
    distanceToSubwayStation: 680,
    nearbyPois: [
      { type: 'PARK', distance: 120 },
      { type: 'SCHOOL', name: '第一中学', distance: 400 },
    ],
    shieldingLevel: 'HIGH',
    summary: '周边绿化良好，整体安静',
  },
];
