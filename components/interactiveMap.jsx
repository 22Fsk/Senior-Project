import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { View, Alert, Text, TouchableOpacity } from 'react-native';
import MapView, { Polygon, Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import colors from './ColorTamp';
import level0 from '../app/floors/level0';
import level1 from '../app/floors/level1';
import level2 from '../app/floors/level2';

const floorDataMap = {
    0: level0,
    1: level1,
    2: level2,
  };
const InteractiveMap = forwardRef((props, ref) => {
  const mapRef = useRef();
  //const [userLocation, setUserLocation] = useState(null);
  const userLocation = {latitude: 26.047974,longitude: 50.510879};
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showDirections, setShowDirections] = useState(false);
  const [pathCoords, setPathCoords] = useState([]);
  

  const floorMap = floorDataMap[props.selectedFloor] || level0;

  const toKey = ({ latitude, longitude }) => {
    if (latitude == null || longitude == null) {
      console.warn('Invalid coordinates passed to toKey:', { latitude, longitude });
      return null; 
    }
    return `${latitude.toFixed(6)},${longitude.toFixed(6)}`;
  };
  
  const fromKey = (key) => {
    if (!key || typeof key !== 'string') {
      console.warn('Invalid key passed to fromKey:', key);
      return { latitude: 0, longitude: 0 }; 
    }
    const [lat, lng] = key.split(',').map(Number);
    return { latitude: lat, longitude: lng };
  };
  
  // build a graph from path lines
  const buildGraph = (floorMap) => {
    const graph = {};
    const allNodes = [];
  
    // Add nodes from each path feature
    floorMap.features.forEach(feature => {
      if (feature.geometry.type === 'LineString' && feature.properties.type === 'path') {
        const path = feature.geometry.coordinates.map(([x, y]) => ({
          latitude: y,
          longitude: x,
        }));
  
        for (let i = 0; i < path.length - 1; i++) {
          const from = path[i];
          const to = path[i + 1];
  
          const fromKey = toKey(from);
          const toKeyStr = toKey(to);
  
          if (!fromKey || !toKeyStr) continue;
  
          graph[fromKey] = graph[fromKey] || [];
          graph[toKeyStr] = graph[toKeyStr] || [];
  
          graph[fromKey].push(toKeyStr);
          graph[toKeyStr].push(fromKey);
        }
  
        // Add all points to global node list
        path.forEach(point => {
          const key = toKey(point);
          if (key) allNodes.push({ key, point });
        });
      }
    });
  
    // Connect nodes that are very close to each other
    const threshold = 0.000015; // 1.6 meters
    for (let i = 0; i < allNodes.length; i++) {
      for (let j = i + 1; j < allNodes.length; j++) {
        const a = allNodes[i];
        const b = allNodes[j];
  
        const dist = euclideanDistance(a.point, b.point);
  
        if (dist < threshold && a.key !== b.key) {
          graph[a.key] = graph[a.key] || [];
          graph[b.key] = graph[b.key] || [];
  
          if (!graph[a.key].includes(b.key)) graph[a.key].push(b.key);
          if (!graph[b.key].includes(a.key)) graph[b.key].push(a.key);
        }
      }
    }
  
    return graph;
  };
  
  // find closest node
  const findClosestGraphNode = (graph, point) => {
    let closest = null;
    let minDist = Infinity;
  
    for (const key in graph) {
      const node = fromKey(key);
      const dist = euclideanDistance(node, point);
      if (dist < minDist) {
        minDist = dist;
        closest = key;
      }
    }
  
    return closest;
  };
  
  const euclideanDistance = (a, b) => {
    return Math.sqrt(Math.pow(b.latitude - a.latitude, 2) + Math.pow(b.longitude - a.longitude, 2));
  };
  
  // A star algorthim to find shortest path from user's location to selected room
  const aStar = (graph, startKey, goalKey) => {
    const openSet = [startKey];
    const cameFrom = {};
    const gScore = { [startKey]: 0 };
    const fScore = { [startKey]: euclideanDistance(fromKey(startKey), fromKey(goalKey)) };
  
    while (openSet.length > 0) {
      const current = openSet.reduce((lowest, node) => (
        fScore[node] < fScore[lowest] ? node : lowest
      ), openSet[0]);
  
      if (current === goalKey) {
        const path = [];
        let currentNode = goalKey;
        while (currentNode !== startKey) {
          path.push(fromKey(currentNode));
          currentNode = cameFrom[currentNode];
        }
        path.push(fromKey(startKey));
        return path.reverse();
      }
  
      openSet.splice(openSet.indexOf(current), 1);
  
      for (const neighborKey of graph[current] || []) {
        const tentativeG = gScore[current] + euclideanDistance(fromKey(current), fromKey(neighborKey));
      
        if (!(neighborKey in gScore) || tentativeG < gScore[neighborKey]) {
          cameFrom[neighborKey] = current;
          gScore[neighborKey] = tentativeG;
          fScore[neighborKey] = tentativeG + euclideanDistance(fromKey(neighborKey), fromKey(goalKey));
      
          if (!openSet.includes(neighborKey)) openSet.push(neighborKey);
        }
      }
      
    }
  
    return [];
  };  

  // Zoom to room function to use from other components
  useImperativeHandle(ref, () => ({
    zoomToRoom: (roomFeature) => {
      const coordinates = roomFeature.geometry.coordinates[0];
      if (coordinates && coordinates.length > 0) {
        const latitudes = coordinates.map(coord => coord[1]);
        const longitudes = coordinates.map(coord => coord[0]);
        const centerLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
        const centerLng = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;

        mapRef.current?.animateToRegion({
          latitude: centerLat,
          longitude: centerLng,
          latitudeDelta: 0.00015,
          longitudeDelta: 0.00015,
        }, 500);
      }
    }
  }));

  // Ask for location access permission
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Allow location access to use navigation features.');
        return;
      }

      let position = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    })();
  }, []);

  // when room is pressed
  const handleRoomPress = (roomFeature) => {
    setSelectedRoom(roomFeature);
  
    const graph = buildGraph(floorMap);
  
    // Snap user location to closest path node
    const userSnapKey = findClosestGraphNode(graph, userLocation);
  
    // Snap room center to closest path node
    const coords = roomFeature.geometry.coordinates[0];
    const roomCenter = {
      latitude: coords.map(c => c[1]).reduce((a, b) => a + b, 0) / coords.length,
      longitude: coords.map(c => c[0]).reduce((a, b) => a + b, 0) / coords.length,
    };
    const roomSnapKey = findClosestGraphNode(graph, roomCenter);
  
    // Path find using A*
    const path = aStar(graph, userSnapKey, roomSnapKey);
  
    // Add real userLocation and roomCenter to start and end of path
    if (path.length > 0) {
      path.unshift(userLocation); // start at real location
      const last = path[path.length - 1];
      if (euclideanDistance(last, roomCenter) > 0.00001) {
        path.push(roomCenter); // end inside the room
      }
    }

    setPathCoords(path);
    setShowDirections(true);
  };

  // zoom to rooom
  const zoomToRoom = (roomFeature) => {
    const coordinates = roomFeature.geometry.coordinates[0];
    if (coordinates && coordinates.length > 0) {
      const latitudes = coordinates.map(coord => coord[1]);
      const longitudes = coordinates.map(coord => coord[0]);
      const centerLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
      const centerLng = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;

      mapRef.current?.animateToRegion({
        latitude: centerLat,
        longitude: centerLng,
        latitudeDelta: 0.0001,
        longitudeDelta: 0.0001,
      }, 500);
    }
  };

  const getFillColor = (name, type, gender) => {
    if (type === 'restroom') {
      if (gender === 'women') return 'rgb(255, 182, 193)';
      if (gender === 'men') return 'rgb(173, 216, 230)';
      return 'rgba(211, 211, 211, 0.5)';
    }
    if(name === 'CS Student Lounge')
    {return 'rgb(241, 217, 39)';}
    else if (name === 'IS Student Lounge')
      {return 'rgb(179, 28, 28)';}
    else if (name === 'CE Student Lounge')
      {return 'rgb(28, 66, 179)';}

    const colors = {
      classroom: 'rgb(226, 228, 100)',
      office: 'rgb(255, 190, 99)',
      stairs: 'rgb(144, 238, 144)',
      elevator: 'rgb(139, 36, 167)',
      openLab : 'rgb(218, 80, 170)',
    };
    return colors[type] || 'rgba(200, 200, 200, 0.5)';
  };

  return (
    <MapView
      ref={mapRef}
      style={{ width: '100%', height: '100%' }}
      initialRegion={{
        latitude: 26.048016900533096,
        longitude: 50.50990609662405,
        latitudeDelta: 0.0015,
        longitudeDelta: 0.0015,
      }}
    >

      {showDirections && pathCoords.length > 0 && (
        <>
          <Polyline
            coordinates={pathCoords}
            strokeColor= {colors.primary}
            strokeWidth={3}
          /> 
        </>
      )}

      {/* Show user location pin */}
      {showDirections && userLocation && (
        <Marker
          coordinate={userLocation}
          title="You"
          description="Your current location"
          pinColor="blue" 
        />
      )}

      {/* Draw the rooms */}
      {floorMap.features.map((feature, index) => {
        const { geometry, properties } = feature;

        if (geometry.type === 'Polygon') {
          const coords = geometry.coordinates[0].map(([x, y]) => ({
            latitude: y,
            longitude: x,
          }));
          const centerLat = coords.reduce((sum, c) => sum + c.latitude, 0) / coords.length;
          const centerLng = coords.reduce((sum, c) => sum + c.longitude, 0) / coords.length;

          return (
            <React.Fragment key={index}>
              <Polygon
                coordinates={coords}
                fillColor={getFillColor(properties.name,properties.type, properties.gender)}
                strokeColor="black"
                strokeWidth={2}
                tappable={true}
                onPress={() => {handleRoomPress(feature), zoomToRoom(feature)}}
              />
              {properties.type && (
              <Marker coordinate={{ latitude: centerLat, longitude: centerLng }}>
                <TouchableOpacity onPress={() => {handleRoomPress(feature), zoomToRoom(feature)}}>
                  <View style={{
                    backgroundColor: 'white',
                    paddingHorizontal: 4,
                    paddingVertical: 2,
                    borderRadius: 4,
                    borderColor: 'black',
                    borderWidth: 0.3,
                  }}>
                    <Text style={{ fontSize: 10 }}>{properties.name}</Text>
                  </View>
                </TouchableOpacity>
              </Marker>
              )}
            </React.Fragment>
          );
        }

        // pin
        if (geometry.type === 'Point') {
          const [x, y] = geometry.coordinates;
          return (
            <Marker
              key={index}
              coordinate={{ latitude: y, longitude: x }}
              title={properties.name}
              description={properties.type}
            />
          );
        }

        // Map outline
        if (geometry.type === 'LineString' && properties.type !== 'path') {
          const coords = geometry.coordinates.map(([x, y]) => ({
            latitude: y,
            longitude: x,
          }));
          return (
            <Polyline
              key={index}
              coordinates={coords}
              strokeColor="black"
              strokeWidth={3}
            />
          );
        }
        return null;
      })}
    </MapView>
  );
});

export default InteractiveMap;