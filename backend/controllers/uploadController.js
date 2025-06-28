import parseExcel from '../parsers/excelParser.js';
import calculateDistance from '../services/osrmServise.js';

function sortPointsByTime (route) {
  return route.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
};

export const handleUpload = async (req, res) => {
  try {
    const parsedData = await parseExcel(req.file.path);
    const errors = [];
    const driversMap = new Map();

    for (const point of parsedData) {
      if (!point.startTime) continue;

      const driverName = point.driverName;
      const date = point.date;
      const startTime = point.startTime;

      if (!driversMap.has(driverName)) {
        driversMap.set(driverName, {
          driverName,
          totalDistance: 0,
          routes: [],
        });
      }

      const driver = driversMap.get(driverName);
      let route = driver.routes.find(route => route.date === date);
      if (!route) {
        route = { date, points: [] };
        driver.routes.push(route);
      }
      route.points.push({
        long: point.long,
        lat: point.lat,
        startTime,
      });
    }

      const drivers = Array.from(driversMap.values());
      
      for (const driver of drivers) {
        for (const route of driver.routes) {
          if (route.points.length < 2) {
            route.distance = 0;
            continue;
          } else {
            sortPointsByTime(route.points);
            route.distance = await calculateDistance(route.points);
          }
          driver.totalDistance += route.distance; 
          }
        }
    res.json({ drivers, errors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Что-то пошло не так.' });
  }};
