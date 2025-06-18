import axios from 'axios';

const url = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';

const calculateDistance = async (coords) => {
  const API_KEY = process.env.ORS_API_KEY;
  try {
    if (!API_KEY) throw new Error('ORS_API_KEY is not defined');

    const body = {
      coordinates: coords
    };

    const response = await axios.post(url, body, {
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json',
      },
    });

    // Берём расстояние из ответа (метры)
    const distance = response.data.features[0].properties.summary.distance;

    return distance;

  } catch (error) {
    console.error('ORS Service Error:', error.message);
    return 0; // Если ошибка, возвращаем 0 чтобы всё не упало
  }
};

export default calculateDistance;

