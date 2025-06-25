import parseExcel from '../parsers/ecxelParser.js';
import calculateDistance from '../services/osrmServise.js';


export const handleUpload = async (req, res) => { 
  try {const parsedData = await parseExcel(req.file.path);
    const totalDistances = {};
    const errors = [];
    const routeMap = new Map();

    for (const point of parsedData) {
      const routeId = `${point.driverName}|${point.tripDate}`;
      
      if (!routeMap.has(routeId)) { 
        routeMap.set(routeId, { 
          routeId, 
          driverName: point.driverName,
          tripDate: point.tripDate,
          placeName: point.placeName,
          points: [],
        });
      }

      routeMap.get(routeId).points.push({ 
        long: point.long, 
        lat: point.lat,
      });
    }

  const routes = Array.from(routeMap.values());  
    for (const route of routes) {
      if(route.points.length < 2) {
        errors.push({ 
          'Имя водителя': route.driverName,
          'Дата поездки': route.tripDate,
          'Ошибка': 'указано менее 2 точек',
         })
      } else {
        route.distance = await calculateDistance(route.points);
      }
    } 

    for (const route of routes) {
      if(!totalDistances[route.driverName]) {
        totalDistances[route.driverName] = 0;
      }
      totalDistances[route.driverName] += route.distance;
    }

    res.json({ routes, totalDistances, errors }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
};
