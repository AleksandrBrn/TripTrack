import parseExcel from '../parsers/ecxelParser.js';
import calculateDistance from '../services/orsService.js';

// Helper делит массив на чанки по N элементов
function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

export const handleUpload = async (req, res) => {
  try {
    const parsedData = await parseExcel(req.file.path);

    const results = {};

    for (const [driverName, trips] of Object.entries(parsedData)) {
      let coords = trips.map(point => [point.long, point.lat]);

      // Пропускаем если меньше 2 точек — нет маршрута
      if (coords.length < 2) continue;

      // Делим на чанки по 50 в чанке из-за ограничений API
      const chunks = chunkArray(coords, 50);

      let totalDistance = 0;

      for (const chunk of chunks) {
        // Если кусок меньше 2 точек — пропускаем
        if (chunk.length < 2) continue;
        const distance = await calculateDistance(chunk);
        totalDistance += distance;
      }

      results[driverName] = {
        totalDistanceMeters: totalDistance
      };
    }

    res.json(results);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
};

