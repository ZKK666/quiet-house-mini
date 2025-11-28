import type { NoiseLevel } from './utils/noise';

type Coordinate = {
  lat: number;
  lng: number;
};

export type City = {
  id: number;
  name: string;
  center: Coordinate;
};

export type NoiseModelMeta = {
  modelVersion: string;
  dataVersion: string;
  source: 'MOCK' | 'OFFLINE_MODEL' | 'REALTIME';
};

export type Compound = {
  id: number;
  cityId: number;
  name: string;
  location: Coordinate;
  bounds?: Coordinate[];
  overallNoiseScore: number;
  overallNoiseLevel: NoiseLevel;
  tags?: string[];
  modelMeta: NoiseModelMeta;
};

export type Building = {
  id: number;
  compoundId: number;
  name: string;
  unit?: string;
  location: Coordinate;
  noiseScoreOverall: number;
  noiseLevelOverall: NoiseLevel;
  recommendedFloors?: { min: number; max: number };
  description?: string;
  modelMeta: NoiseModelMeta;
};

export type FloorNoise = {
  floor: number;
  noiseScore: number;
};

export type BuildingNoiseDetail = {
  buildingId: number;
  timePeriod: 'OVERALL' | 'DAY' | 'NIGHT';
  floorNoiseList: FloorNoise[];
  notes?: string;
};

export type NearbyPoi = {
  type: 'MALL' | 'SCHOOL' | 'MARKET' | 'HOSPITAL' | 'PARK' | 'OTHER';
  name?: string;
  distance: number;
};

export type NoiseFactorSummary = {
  buildingId: number;
  distanceToMainRoad?: number;
  distanceToSubRoad?: number;
  distanceToSubwayLine?: number;
  distanceToSubwayStation?: number;
  nearbyPois?: NearbyPoi[];
  shieldingLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  summary: string;
};

export type BuildingDetailResponse = {
  building: Building;
  noiseDetail?: BuildingNoiseDetail;
  noiseFactors?: NoiseFactorSummary;
};
