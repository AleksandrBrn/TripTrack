import axios from 'axios';
import axiosRetry from 'axios-retry';

const osrmClient = axios.create({ 
  baseURL: 'http://95.215.56.237:5000/route/v1/driving/', 
  timeout: 10_000,
  });

  // ретрай 10 attempts
  axiosRetry(osrmClient, { 
    retries: 10, 
    retryDelay: retryCount => { console.log(`Retry attempt: ${retryCount}`); 
    return retryCount * 3000;  
  }, retryCondition: error => { 
      return axiosRetry.isNetworkOrIdempotentRequestError(error) || 
      (error.response && error.response.status === 503)},
    }
  );
  
  const calculateDistance = async (coords) => { 
    if (!Array.isArray(coords) || coords.length < 2) { 
      throw new Error('Нужно минимум две координаты для маршрута.'); 
    } 
    try {  
      const coordsUrl = coords.map((point) => `${point.long},${point.lat}`).join(';'); 
      
      const { data } = await osrmClient.get(`${coordsUrl}?overview=false`); 
 
      const distance = data.routes?.[0]?.distance; 
      if (typeof distance !== 'number') { 
        throw new Error('OSRM не вернул расстояние.'); 
      } 
      //дистанция возвращается в км
      return distance / 1000; 
    } catch (error) { 
      console.error('Ошибка в OSRM-сервисе:', error.message); 
      return 0;   
    }
  };
  
  export default calculateDistance;
