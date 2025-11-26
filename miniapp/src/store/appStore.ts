import { create } from 'zustand';
import type { NoiseLevel } from '../utils/noise';

export type NoiseFilter = {
  levels: NoiseLevel[];
  recommendTopN?: number;
};

type AppState = {
  currentCityId?: number;
  noiseFilter: NoiseFilter;
  setCityId: (id: number) => void;
  setNoiseFilter: (payload: Partial<NoiseFilter>) => void;
};

export const useAppStore = create<AppState>((set) => ({
  currentCityId: undefined,
  noiseFilter: { levels: ['QUIET', 'NORMAL'] },
  setCityId: (id) => set({ currentCityId: id }),
  setNoiseFilter: (payload) =>
    set((state) => ({ noiseFilter: { ...state.noiseFilter, ...payload } }))
}));
