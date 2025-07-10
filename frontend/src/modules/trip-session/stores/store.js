import { create } from 'zustand';

export const useUploadStore = create((set) => ({
  data: null,
  setData: (data) => set({ data }),
  reset: () => set({ data: null }),
}));

export const useDriversListLoadingStore = create((set) => ({
  data: false,
  setData: (data) => set({ data }),
  reset: () => set({ data: null }),
}));
