import { useDriversListLoadingStore, useDriversStore, useUploadStore } from '../stores/store';

export const useUploadedData = () => useUploadStore((state) => state.data);
export const useSetUploadedData = () => useUploadStore((state) => state.setData);
export const useResetUploadedData = () => useUploadStore((state) => state.reset);

export const useLoadingData = () => useDriversListLoadingStore((state) => state.data);
export const useSetLoadingData = () => useDriversListLoadingStore((state) => state.setData);
export const useResetLoadingData = () => useDriversListLoadingStore((state) => state.reset);

export const useDrivers = () => useDriversStore((state) => state.data);
export const useSetDrivers = () => useDriversStore((state) => state.setData);
export const useUpdateDrivers = () => useDriversStore((state) => state.updateData);
export const useResetDrivers = () => useDriversStore((state) => state.reset);
