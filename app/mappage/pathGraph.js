export function buildGraph(pathFeatures) {
    const graph = {};
  
    function addEdge(a, b) {
      const keyA = `${a[0]},${a[1]}`;
      const keyB = `${b[0]},${b[1]}`;
      const dist = Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);
  
      if (!graph[keyA]) graph[keyA] = {};
      if (!graph[keyB]) graph[keyB] = {};
  
      graph[keyA][keyB] = dist;
      graph[keyB][keyA] = dist;
    }
  
    pathFeatures.forEach(f => {
      const coords = f.geometry.coordinates;
      for (let i = 0; i < coords.length - 1; i++) {
        addEdge(coords[i], coords[i + 1]);
      }
    });
  
    return graph;
  }
  
  export function getClosestNode(target, pathFeatures) {
    let closest = null;
    let minDist = Infinity;
  
    pathFeatures.forEach(feature => {
      feature.geometry.coordinates.forEach(coord => {
        const [lng, lat] = coord;
        const dist = Math.sqrt(
          (target.latitude - lat) ** 2 +
          (target.longitude - lng) ** 2
        );
        if (dist < minDist) {
          minDist = dist;
          closest = { lat, lng, key: `${lng},${lat}` };
        }
      });
    });
  
    return closest;
  }  
  
  export function dijkstra(graph, start, end) {
    const distances = {};
    const prev = {};
    const pq = new Set(Object.keys(graph));
  
    Object.keys(graph).forEach(n => {
      distances[n] = Infinity;
    });
    distances[start] = 0;
  
    while (pq.size > 0) {
      const current = [...pq].reduce((a, b) => distances[a] < distances[b] ? a : b);
      pq.delete(current);
  
      if (current === end) break;
  
      for (const neighbor in graph[current]) {
        const alt = distances[current] + graph[current][neighbor];
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          prev[neighbor] = current;
        }
      }
    }
  
    const path = [];
    let u = end;
    while (u) {
      path.unshift(u);
      u = prev[u];
    }
    return path;
  }
  
  export function pathToCoords(path) {
    return path.map(key => {
      const [lng, lat] = key.split(',').map(Number);
      return { latitude: lat, longitude: lng };
    });
  }
  
  