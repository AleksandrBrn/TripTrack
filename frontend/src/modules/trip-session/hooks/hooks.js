import { useDriversListLoadingStore, useUploadStore } from '../stores/store';

export const useUploadedData = () => useUploadStore((state) => state.data);
export const useSetUploadedData = () => useUploadStore((state) => state.setData);
export const useResetUploadedData = () => useUploadStore((state) => state.reset);

export const useLoadingData = () => useDriversListLoadingStore((state) => state.data);
export const useSetLoadingData = () => useDriversListLoadingStore((state) => state.setData);
export const useResetLoadingData = () => useDriversListLoadingStore((state) => state.reset);
