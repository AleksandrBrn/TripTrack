import { useState } from 'react';
import { uploadExcelFile } from './api/api';
import { UploadForm } from './components/UploadForm';
import { useSetUploadedData, useLoadingData, useSetLoadingData } from './hooks/hooks';

export function UploadTripsFeature() {
  const [selectedFile, setSelectedFile] = useState(null);
  const setData = useSetUploadedData();
  const isLoading = useLoadingData();
  const setIsLoading = useSetLoadingData();

  const handleUpload = async () => {
    setIsLoading(true);

    try {
      if (selectedFile) {
        const result = await uploadExcelFile(selectedFile);
        if (result) setData(result);
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
