import { DriversListFeature } from '../../modules/drivers-list';
import { UploadFeature } from '../../modules/trip-session';

export default function Home() {
  return (
    <div>
      <UploadFeature />
      <DriversListFeature />
    </div>
  );
}
