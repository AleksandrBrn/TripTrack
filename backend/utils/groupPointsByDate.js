export function groupPointsByDate(parsedData) {
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
    let route = driver.routes.find((route) => route.date === date);
    if (!route) {
      route = { date, points: [], geometry: null };
      driver.routes.push(route);
    }
    route.points.push({
      long: point.long,
      lat: point.lat,
      startTime,
    });
  }

  return driversMap;
}
