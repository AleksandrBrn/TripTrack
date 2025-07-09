import parseExcel from '../parsers/excelParser.js';
import calculateDistance from '../services/osrmServise.js';
import { groupPointsByDate } from '../utils/groupPointsByDate.js';
import { sortPointsByTime } from '../utils/sortPointsByTime.js';

export const handleUpload = async (req, res) => {
  try {
    const parsedData = await parseExcel(req.file.path);
    const errors = [];
    const driversMap = groupPointsByDate(parsedData);

    const drivers = Array.from(driversMap.values());
    for (const driver of drivers) {
      for (const route of driver.routes) {
        if (route.points.length < 2) {
          route.distance = 0;
          continue;
        } else {
          sortPointsByTime(route.points);
          const data = await calculateDistance(route.points);
          route.distance = data.routes?.[0]?.distance / 1000; //дистанция в км
          route.geometry = data?.routes[0]?.geometry; //GeoJSON маршрута
        }
        driver.totalDistance += route.distance;
      }
    }
    res.json({ drivers, errors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Что-то пошло не так.' });
  }
};
