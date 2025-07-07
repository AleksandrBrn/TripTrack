import { useState } from 'react';
import { uploadExcelFile } from './api/api';
import { UploadForm } from './components/UploadForm';
import { useSetUploadedData } from './hooks/hooks';

export function UploadFeature() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const setData = useSetUploadedData();

  const handleUpload = async () => {
    setIsLoading(true);

    try {
      if (selectedFile) {
        const result = await uploadExcelFile(selectedFile);
        if (result) setData(result);
        console.log(result);
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
    console.log('file changing');
    if (file) {
      setSelectedFile(file);
    }
  };

  return <UploadForm onUpload={handleUpload} onChange={handleFileChange} isLoading={isLoading} />;
}
