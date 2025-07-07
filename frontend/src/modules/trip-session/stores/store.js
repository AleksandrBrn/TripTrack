import { create } from 'zustand';

export const useUploadStore = create((set) => ({
  data: null,
  setData: (data) => set({ data }),
  reset: () => set({ data: null }),
}));
