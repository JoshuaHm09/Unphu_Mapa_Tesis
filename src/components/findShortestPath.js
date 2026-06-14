import { routeNodes, routeEdges } from "../components/routeGraph";

const getDistance = (a, b) => {
  if (!a || !b) return Infinity;

  const dx = a.x - b.x;
  const dy = a.y - b.y;

  return Math.sqrt(dx * dx + dy * dy);
};

export function findShortestPath(startNodeId, endNodeId) {
  if (!routeNodes[startNodeId] || !routeNodes[endNodeId]) {
    console.log("Invalid route nodes:", startNodeId, endNodeId);
    return [];
  }

  const distances = {};
  const previous = {};
  const unvisited = new Set(Object.keys(routeNodes));

  Object.keys(routeNodes).forEach((nodeId) => {
    distances[nodeId] = Infinity;
    previous[nodeId] = null;
  });

  distances[startNodeId] = 0;

  while (unvisited.size > 0) {
    let currentNodeId = null;

    unvisited.forEach((nodeId) => {
      if (
        currentNodeId === null ||
        distances[nodeId] < distances[currentNodeId]
      ) {
        currentNodeId = nodeId;
      }
    });

    if (!currentNodeId) break;
    if (distances[currentNodeId] === Infinity) break;
    if (currentNodeId === endNodeId) break;

    unvisited.delete(currentNodeId);

    const neighbors = routeEdges
      .filter(([a, b]) => a === currentNodeId || b === currentNodeId)
      .map(([a, b]) => (a === currentNodeId ? b : a))
      .filter((nodeId) => routeNodes[nodeId]);

    neighbors.forEach((neighborId) => {
      if (!unvisited.has(neighborId)) return;

      const distance = getDistance(
        routeNodes[currentNodeId],
        routeNodes[neighborId]
      );

      const newDistance = distances[currentNodeId] + distance;

      if (newDistance < distances[neighborId]) {
        distances[neighborId] = newDistance;
        previous[neighborId] = currentNodeId;
      }
    });
  }

  const path = [];
  let current = endNodeId;

  while (current) {
    path.unshift(current);
    current = previous[current];
  }

  if (path[0] !== startNodeId) return [];

  return path.map((nodeId) => routeNodes[nodeId]);
}