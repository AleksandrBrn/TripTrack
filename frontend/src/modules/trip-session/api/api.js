import { apiClient } from '@/api/';

export const uploadExcelFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await apiClient.post('/routes/upload', formData, {
      maxBodyLength: Infinity,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (error) {
    console.error('Ошибка при загрузке файла', error);
  }
};

export const calculateRoutes = async (drivers) => {
  try {
    const res = await apiClient.post('routes/calculate', drivers);
    return res.data;
  } catch (error) {
    console.error('Ошибка при отправке маршрутов на сервер', error);
  }
};
