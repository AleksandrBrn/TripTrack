import { reportMaker } from '@/services/reportService';
import { useDrivers } from '@/modules/trip-session';
import { useLoading, useSetLoading, useResetLoading } from './hooks/hooks';
import DownloadButton from '@/ui/DownloadButton';

const REPORT_NAME = 'report';

export function ReportFeature() {
  const drivers = useDrivers();
  const isLoading = useLoading();
  const setLoading = useSetLoading();
  const resetLoading = useResetLoading();

  const clickHandler = async () => {
    if(!drivers) {
      console.log('маршруты не загружены');
      return;
    }

    try {
      setLoading(true);
      console.log(drivers);
      await reportMaker(drivers, REPORT_NAME);
      setLoading(false);
      console.log('data is processed');
    } catch (error) {
      console.log('Ошибка при создании отчета:', error);
    } finally {
      resetLoading();
    }
  }

  return <>
    <DownloadButton 
      text='скачать отчет' 
      onClick={clickHandler} 
      isDisabled={!drivers || isLoading} />
    </>
}