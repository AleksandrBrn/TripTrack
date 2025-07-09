export function sortPointsByTime(route) {
  return route.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
}
