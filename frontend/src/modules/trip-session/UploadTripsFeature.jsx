import { useState } from 'react';
import { calculateRoutes } from './api/api';
import { UploadForm } from './components/UploadForm';
import { useLoadingData, useSetLoadingData, useSetDrivers } from './hooks/hooks';
import parser from '@/parsers/excelParser';
import { groupPointsByDate } from '@/utils/groupPointsByDate';
import { assignDriversIds } from '@/utils/assignDriversIds';

export function UploadTripsFeature() {
  const [selectedFile, setSelectedFile] = useState(null);
  const isLoading = useLoadingData();
  const setIsLoading = useSetLoadingData();
  const setDrivers = useSetDrivers();

  const handleUpload = async () => {
    setIsLoading(true);

    try {
      if (selectedFile) {
        const buffer = await selectedFile.arrayBuffer();
        const parsedData = await parser(buffer);
        const driversMap = groupPointsByDate(parsedData);
        const drivers = Array.from(driversMap.values());
        const driversWithIds = assignDriversIds(drivers);
        const driverWithoutNames = driversWithIds.map((driver) => {
          const { driverName, ...rest } = driver;
          return rest;
        });
        const response = await calculateRoutes(driverWithoutNames);
        const result = driversWithIds.map((item) => {
          const driver = response.drivers.find((driver) => driver.id === item.id);
          return { ...item, ...driver };
        });

        setDrivers(result);
      }
    } catch (error) {
      console.log('ошибка при обработке файла', error);
    } finally {
      setSelectedFile(null);
      setIsLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return <UploadForm 
            onUpload={handleUpload} 
            onChange={handleFileChange}
            isDisabled={isLoading || !selectedFile} 
            isLoading={isLoading} 
          />;
}
