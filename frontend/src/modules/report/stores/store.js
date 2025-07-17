import { create } from 'zustand';

export const useLoadingState = create((set) => ({
  data: false,
  setData: (data) => set({ data }),
  reset: () => set({ data: false }),
}));
