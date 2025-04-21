
export function buildGraph(paths) {
    const graph = {};
    const nodeCoordinates = {};
    const pathIds = {}; // To store the path line IDs
  
    paths.forEach((feature) => {
      if (feature.geometry.type === 'LineString') {
        const coords = feature.geometry.coordinates;
        const pathId = feature.properties?.id;  // Assuming path has an 'id' property
  
        for (let i = 0; i < coords.length - 1; i++) {
          const fromCoord = coords[i];
          const toCoord = coords[i + 1];
  
          const fromKey = JSON.stringify(fromCoord);
          const toKey = JSON.stringify(toCoord);
  
          const distance = Math.sqrt(
            Math.pow(fromCoord[0] - toCoord[0], 2) +
            Math.pow(fromCoord[1] - toCoord[1], 2)
          );
  
          if (!graph[fromKey]) graph[fromKey] = {};
          if (!graph[toKey]) graph[toKey] = {};
  
          graph[fromKey][toKey] = distance;
          graph[toKey][fromKey] = distance;
  
          nodeCoordinates[fromKey] = { latitude: fromCoord[1], longitude: fromCoord[0] };
          nodeCoordinates[toKey] = { latitude: toCoord[1], longitude: toCoord[0] };
  
          // Store path ID for the line segment
          if (!pathIds[fromKey]) pathIds[fromKey] = [];
          if (!pathIds[toKey]) pathIds[toKey] = [];
          pathIds[fromKey].push(pathId);
          pathIds[toKey].push(pathId);
        }
      }
    });
  
    return { graph, nodeCoordinates, pathIds };
  }
  
  export function dijkstra(graph, start, end, pathIds) {
    const distances = {};
    const previous = {};
    const queue = new Set(Object.keys(graph));
  
    for (const node of queue) {
      distances[node] = node === start ? 0 : Infinity;
    }
  
    while (queue.size > 0) {
      const current = [...queue].reduce((a, b) =>
        distances[a] < distances[b] ? a : b
      );
  
      queue.delete(current);
  
      if (current === end) break;
  
      for (const neighbor in graph[current]) {
        const alt = distances[current] + graph[current][neighbor];
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = current;
        }
      }
    }
  
    const path = [];
    let curr = end;
    while (curr) {
      path.unshift(curr);
      curr = previous[curr];
    }
  
    // Get path line IDs from pathIds mapping
    const pathLineIds = [];
    for (let i = 0; i < path.length - 1; i++) {
      const from = path[i];
      const to = path[i + 1];
  
      // Get the IDs of path lines between the nodes
      const lineIds = pathIds[from]?.filter((id) => pathIds[to]?.includes(id));
      if (lineIds) {
        pathLineIds.push(...lineIds);
      }
    }
  
    return { path, pathLineIds };
  }
  