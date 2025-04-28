import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { View, Alert, Text, TouchableOpacity } from 'react-native';
import MapView, { Polygon, Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import floorMap from '../app/floors/level0'; // GeoJSON
import MapViewDirections from 'react-native-maps-directions';
import {
  buildGraph,
  getClosestNode,
  dijkstra,
  pathToCoords,
} from '../app/mappage/pathGraph';
26.047859, 50.509877
const InteractiveMap = forwardRef((props, ref) => {
  const mapRef = useRef();
  const GOOGLE_MAPS_APIKEY = 'AIzaSyBAw4L8WWlFuW_Q1KJPo72eaNqDGpQoIkQ';
  //const [userLocation, setUserLocation] = useState(null);
  const userLocation = {latitude: 26.048311,longitude: 50.509834};

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showDirections, setShowDirections] = useState(false);
  const CAMPUS_ENTRANCE = {
    latitude: 26.047884,
    longitude: 50.509874
  };
  const [navigateToCampus, setNavigateToCampus] = useState(false);
  const [atCampus, setAtCampus] = useState(false);
  const [pathCoords, setPathCoords] = useState([]);

  
  const startNavigationToCampus = () => {
    setNavigateToCampus(true);
  };

  const pathFeatures = floorMap.features.filter(
    feature => feature.geometry.type === 'LineString' && feature.properties.type === 'path'
  );

  const graph = buildGraph(pathFeatures);

  const getRoomCenter = (feature) => {
    const coords = feature.geometry.coordinates[0]; // assuming Polygon
    const lats = coords.map(c => c[1]);
    const lngs = coords.map(c => c[0]);
    const lat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const lng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
    return { latitude: lat, longitude: lng };
  };
  

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
          latitudeDelta: 0.0002,
          longitudeDelta: 0.0002,
        }, 500);
      }
    }
  }));

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

  function haversineDistance(coord1, coord2) {
    const R = 6371; // Earth radius in km
    const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
    const dLng = (coord2.longitude - coord1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(coord1.latitude * Math.PI / 180) * Math.cos(coord2.latitude * Math.PI / 180) *
              Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function getPolygonCentroid(polygon) {
    const coords = polygon.coordinates[0]; // First ring
    let x = 0, y = 0;
    coords.forEach(coord => {
      x += coord[0];
      y += coord[1];
    });
    const len = coords.length;
    return [x / len, y / len];
  }
  
  
  const handleRoomPress = (roomFeature) => {
    setSelectedRoom(roomFeature);
    const roomCenter = getPolygonCentroid(roomFeature.geometry);
    const roomCoord = { latitude: roomCenter[1], longitude: roomCenter[0] };
    const roomKey = `${roomCoord.longitude},${roomCoord.latitude}`;

    console.log("Room clicked:", roomFeature.properties.name);
    console.log("Room key:", roomKey);
  
    if (!userLocation) {
      console.warn("User location not available yet.");
      return;
    }
  
    const userCoord = {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude
    };
    
    const userKey = `${userCoord.longitude},${userCoord.latitude}`;
    console.log("User key:", userKey);
  
    const userClosest = getClosestNode(userCoord, pathFeatures);
    const roomClosest = getClosestNode(roomCoord, pathFeatures);
    const userClosestKey = `${userClosest.lng},${userClosest.lat}`;
    const roomClosestKey = `${roomClosest.lng},${roomClosest.lat}`;
  
    console.log("User closest key:", userClosestKey);
    console.log("Room closest key:", roomClosestKey);
  
    // Build graph
    const graph = buildGraph(pathFeatures);
  
    // Add edges from user and room to closest path nodes
    const distUserToClosest = haversineDistance(userCoord, { latitude: userClosest.lat, longitude: userClosest.lng });
    if (!graph[userKey]) graph[userKey] = {};
    if (!graph[userClosestKey]) graph[userClosestKey] = {};
    graph[userKey][userClosestKey] = distUserToClosest;
    graph[userClosestKey][userKey] = distUserToClosest;
  
    const distRoomToClosest = haversineDistance(roomCoord, { latitude: roomClosest.lat, longitude: roomClosest.lng });
    if (!graph[roomKey]) graph[roomKey] = {};
    if (!graph[roomClosestKey]) graph[roomClosestKey] = {};
    graph[roomKey][roomClosestKey] = distRoomToClosest;
    graph[roomClosestKey][roomKey] = distRoomToClosest;
  
    // Run Dijkstra
    const shortestPath = dijkstra(graph, userKey, roomKey);
    console.log("Shortest Path:", shortestPath);
  
    const routeCoords = pathToCoords(shortestPath);
    console.log("Route Coordinates:", routeCoords);
    if (routeCoords.length === 0) {
      Alert.alert("Path not found", "No indoor route could be calculated to this room.");
      return;
    }
    console.log('Distance to closest path node from room:', distRoomToClosest);
  
    setPathCoords(routeCoords);

  };
  

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
        latitudeDelta: 0.0002,
        longitudeDelta: 0.0002,
      }, 500);
    }
  };

  const getFillColor = (type, gender) => {
    if (type === 'restroom') {
      if (gender === 'women') return 'rgb(255, 182, 193)';
      if (gender === 'men') return 'rgb(173, 216, 230)';
      return 'rgba(211, 211, 211, 0.5)';
    }
    const colors = {
      classroom: 'rgb(226, 228, 100)',
      office: 'rgb(255, 190, 99)',
      stairs: 'rgb(144, 238, 144)',
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

      {userLocation && selectedRoom && (
        <MapViewDirections
          origin={userLocation}
          destination={CAMPUS_ENTRANCE}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={4}
          strokeColor="blue"
          mode="DRIVING"
          onReady={(result) => {
            console.log("Arrived at campus");
            setAtCampus(true); // Now show indoor directions
            setNavigateToCampus(false);
          }}
          onError={(error) => {
            console.warn("Error getting campus directions:", error);
          }}
        />
      )}


      {atCampus && pathCoords.length > 0 && (
  <>
    <Polyline
      coordinates={pathCoords}
      strokeColor="blue"
      strokeWidth={3}
    />
    {console.log(pathCoords)} {/* Check if pathCoords is correct */}
  </>
)}



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
                fillColor={getFillColor(properties.type, properties.gender)}
                strokeColor="black"
                strokeWidth={2}
                tappable={true}
                onPress={() => handleRoomPress(feature)}
              />
              <Marker coordinate={{ latitude: centerLat, longitude: centerLng }}>
                <TouchableOpacity onPress={() => handleRoomPress(feature)}>
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
            </React.Fragment>
          );
        }

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

        return null;
      })}
    </MapView>
  );
});

export default InteractiveMap;