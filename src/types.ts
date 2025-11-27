export type Coordinate = {
  lat: number;
  lng: number;
};

export type NoiseLevel = 'QUIET' | 'NORMAL' | 'NOISY';
export type ShieldingLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type TimePeriod = 'OVERALL' | 'DAY' | 'NIGHT';

export type NoiseModelMeta = {
  modelVersion: string;
  dataVersion: string;
  source: 'MOCK' | 'OFFLINE_MODEL' | 'REALTIME';
};

export type City = {
  id: number;
  name: string;
  center: Coordinate;
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
  recommendedFloors?: {
    min: number;
    max: number;
  };
  description?: string;
  modelMeta: NoiseModelMeta;
};

export type FloorNoise = {
  floor: number;
  noiseScore: number;
};

export type BuildingNoiseDetail = {
  buildingId: number;
  timePeriod: TimePeriod;
  floorNoiseList: FloorNoise[];
  notes?: string;
};

export type PoiType = 'MALL' | 'SCHOOL' | 'MARKET' | 'HOSPITAL' | 'PARK' | 'OTHER';

export type NearbyPoi = {
  type: PoiType;
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
  shieldingLevel?: ShieldingLevel;
  summary: string;
};

export type BuildingDetailResponse = {
  building: Building;
  noiseDetail?: BuildingNoiseDetail;
  noiseFactors?: NoiseFactorSummary;
};

export type ApiResponse<T> = {
  code: number;
  msg: string;
  result: T;
};
