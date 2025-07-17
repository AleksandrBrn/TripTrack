import { useLoadingState } from '../stores/store';

export const useLoading = () => useLoadingState((state) => state.data);
export const useSetLoading = () => useLoadingState((state) => state.setData);
export const useResetLoading = () => useLoadingState((state) => state.reset);
