import parseExcel from '../parsers/ecxelParser.js';
import calculateDistance from '../services/osrmServise.js';


export const handleUpload = async (req, res) => { 
  try {const parsedData = await parseExcel(req.file.path);

    const routeMap = new Map();

    for (const point of parsedData) {
      const routeId = `${point.driverName}|${point.dateTime}`;
      
      if (!routeMap.has(routeId)) { 
        routeMap.set(routeId, { 
          routeId, 
          driverName: point.driverName,
          dateTime: point.dateTime,
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
      route.distance = await calculateDistance(route.points);
    }

    res.json({ routes }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
};
