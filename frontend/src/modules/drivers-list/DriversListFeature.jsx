import { useUploadedData } from '../trip-session';

export function DriversListFeature() {
  const data = useUploadedData((state) => state.data);

  if (!data) return <></>;

  return <div>Here will be a list of drivers</div>;
}
