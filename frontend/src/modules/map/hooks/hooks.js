import { useSelectedRouteState } from '../stores/store';

export const useSelectedRoute = () => useSelectedRouteState((state) => state.data);
export const useSetSelectedRoute = () => useSelectedRouteState((state) => state.setData);
export const useResetSelectedRoute = () => useSelectedRouteState((state) => state.reset);
