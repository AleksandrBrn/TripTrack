import { create } from 'zustand';

export const useSelecteDriverStore = create((set) => ({
  data: null,
  setData: (data) => set({ data }),
  reset: () => set({ data: null }),
}));
