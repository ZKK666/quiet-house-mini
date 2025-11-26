import { create } from 'zustand';

type MapState = {
  selectedCompoundId?: number;
  selectedBuildingId?: number;
  setCompoundId: (id?: number) => void;
  setBuildingId: (id?: number) => void;
};

export const useMapStore = create<MapState>((set) => ({
  selectedCompoundId: undefined,
  selectedBuildingId: undefined,
  setCompoundId: (id) => set({ selectedCompoundId: id }),
  setBuildingId: (id) => set({ selectedBuildingId: id })
}));
