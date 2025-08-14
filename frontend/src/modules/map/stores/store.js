import { create } from 'zustand';

export const useSelectedRouteState = create((set) => ({
  geojson: null,
  points: null,
  setData: (data) => set({ geojson: data.geojson, points: data.points }),
  reset: () => set({ geojson: null, points: null }),
}));

export const useOpenState = create((set) => ({
  data: false,
  setData: (data) => set({ data }),
  reset: () => set({ data: null }),
}));
