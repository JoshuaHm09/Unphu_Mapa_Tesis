const getDistance = (a, b) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const findShortestPath = (startId, endId, nodes, edges) => {
  if (!nodes[startId] || !nodes[endId]) return [];

  const distances = {};
  const previous = {};
  const unvisited = new Set(Object.keys(nodes));

  Object.keys(nodes).forEach((nodeId) => {
    distances[nodeId] = Infinity;
    previous[nodeId] = null;
  });

  distances[startId] = 0;

  while (unvisited.size > 0) {
    let current = null;

    unvisited.forEach((nodeId) => {
      if (current === null || distances[nodeId] < distances[current]) {
        current = nodeId;
      }
    });

    if (current === null || distances[current] === Infinity) break;
    if (current === endId) break;

    unvisited.delete(current);

    const neighbors = edges[current] || [];

    neighbors.forEach((neighbor) => {
      if (!unvisited.has(neighbor)) return;
      if (!nodes[neighbor]) return;

      const newDistance =
        distances[current] + getDistance(nodes[current], nodes[neighbor]);

      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        previous[neighbor] = current;
      }
    });
  }

  const path = [];
  let current = endId;

  while (current) {
    path.unshift(current);
    current = previous[current];
  }

  if (path[0] !== startId) return [];

  return path.map((nodeId) => nodes[nodeId]);
};