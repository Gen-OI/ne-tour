// Route calculations and journey simulation for Offbeat Northeast

/**
 * Calculates great-circle distance between two [lat, lng] points in kilometers.
 */
export function getDistanceKm(coord1, coord2) {
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculates perpendicular distance from a point to a segment.
 */
function distToSegment(p, v, w) {
  const l2 = (v[0] - w[0]) ** 2 + (v[1] - w[1]) ** 2;
  if (l2 === 0) return getDistanceKm(p, v);
  let t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
  t = Math.max(0, Math.min(1, t));
  const projection = [v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1])];
  return getDistanceKm(p, projection);
}

/**
 * Find local picks along a route within maxDistanceKm
 */
export function getPicksAlongRoute(routeCoords, picks, maxDistanceKm = 40) {
  if (!routeCoords || routeCoords.length < 2) return [];

  return picks.filter(pick => {
    // Check pick against every segment in the route
    for (let i = 0; i < routeCoords.length - 1; i++) {
      const d = distToSegment(pick.coords, routeCoords[i], routeCoords[i + 1]);
      if (d <= maxDistanceKm) return true;
    }
    return false;
  });
}

/**
 * Computes total route distance in km
 */
export function calculateTotalDistance(coords) {
  let total = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    total += getDistanceKm(coords[i], coords[i + 1]);
  }
  return total;
}

/**
 * Interpolates smooth points between key stops
 */
export function interpolateWaypoints(stops, stepsPerSegment = 20) {
  if (!stops || stops.length < 2) return stops ? stops.map(s => s.coords) : [];
  const points = [];

  for (let i = 0; i < stops.length - 1; i++) {
    const [lat1, lon1] = stops[i].coords;
    const [lat2, lon2] = stops[i + 1].coords;
    for (let step = 0; step < stepsPerSegment; step++) {
      const f = step / stepsPerSegment;
      // add a gentle natural curve for hill terrain
      const bend = Math.sin(f * Math.PI) * 0.04;
      const lat = lat1 + (lat2 - lat1) * f + bend;
      const lon = lon1 + (lon2 - lon1) * f;
      points.push([lat, lon]);
    }
  }
  points.push(stops[stops.length - 1].coords);
  return points;
}

/**
 * Simulates journey step-by-step
 */
export function startJourneySimulation({
  points,
  onStep,
  onComplete,
  intervalMs = 120
}) {
  let currentIdx = 0;
  const total = points.length;

  const timer = setInterval(() => {
    if (currentIdx >= total) {
      clearInterval(timer);
      if (onComplete) onComplete();
      return;
    }
    const currentCoord = points[currentIdx];
    const progress = Math.min(100, Math.round((currentIdx / (total - 1)) * 100));
    onStep({
      index: currentIdx,
      coord: currentCoord,
      progress
    });
    currentIdx++;
  }, intervalMs);

  return () => clearInterval(timer);
}
