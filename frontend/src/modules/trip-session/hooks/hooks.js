import { useUploadStore } from '../stores/store';

export const useUploadedData = () => useUploadStore((state) => state.data);
export const useSetUploadedData = () => useUploadStore((state) => state.setData);
export const useResetUploadedData = () => useUploadStore((state) => state.reset);
