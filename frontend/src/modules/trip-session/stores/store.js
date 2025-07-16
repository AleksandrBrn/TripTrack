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

export const useDriversStore = create((set, get) => ({
  data: null,
  setData: (data) => set({ data }),
  updateData: (data) => {
    const currentState = get().data;
    const newState = currentState.map((item) => {
      const driver = data.find((driver) => driver.id === item.id);
      return { ...item, ...driver };
    });
    set(newState);
  },
  reset: () => set({ data: null }),
}));
