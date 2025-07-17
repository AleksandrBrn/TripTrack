import { create } from 'zustand';

export const useSelectedRouteState = create((set) => ({
  data: null,
  setData: (data) => set({ data }),
  reset: () => set({ data: null }),
}));

export const useOpenState = create((set) => ({
  data: false,
  setData: (data) => set({ data }),
  reset: () => set({ data: null }),
}));
