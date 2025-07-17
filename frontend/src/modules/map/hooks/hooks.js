import { useOpenState, useSelectedRouteState } from '../stores/store';

export const useSelectedRoute = () => useSelectedRouteState((state) => state.data);
export const useSetSelectedRoute = () => useSelectedRouteState((state) => state.setData);
export const useResetSelectedRoute = () => useSelectedRouteState((state) => state.reset);

export const useOpen = () => useOpenState((state) => state.data);
export const useSetOpen = () => useOpenState((state) => state.setData);
export const useResetOpen = () => useOpenState((state) => state.reset);
