import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View } from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import floorMap from '../app/floors/level0'; // double-check path
import { Alert } from 'react-native';
import { Text } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Polyline } from 'react-native-maps';



const InteractiveMap = forwardRef((props, ref) => {
  const mapRef = useRef();
    
  const getFillColor = (type, gender) => {
    if (type === 'restroom') {
      if (gender === 'women') return 'rgb(255, 182, 193)'; // light pink
      if (gender === 'men') return 'rgb(173, 216, 230)';   // light blue
      return 'rgba(211, 211, 211, 0.5)'; // default for unisex/unknown restrooms
    }
    const colors = {
      classroom: 'rgb(226, 228, 100)',       // yellow
      office: 'rgb(255, 190, 99)',        // light blue
      stairs: 'rgb(144, 238, 144)',        // light green
    };
    return colors[type] || 'rgba(200, 200, 200, 0.5)'; // default grey if type not matched
  };

  useImperativeHandle(ref, () => ({
    zoomToRoom: (roomFeature) => {

      const coordinates = roomFeature.geometry.coordinates[0];

      if (coordinates && coordinates.length > 0) {
        // Calculate center of polygon
        const latitudes = coordinates.map(coord => coord[1]);
        const longitudes = coordinates.map(coord => coord[0]);
        const centerLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
        const centerLng = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;

        mapRef.current?.animateToRegion({
          latitude: centerLat,
          longitude: centerLng,
          latitudeDelta: 0.00001,
          longitudeDelta: 0.00001,
        }, 500);
      }
    }
  }));

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
              key={index}
              coordinates={coords}
              fillColor={getFillColor(properties.type, properties.gender)}
              strokeColor="rgb(0, 0, 0)"
              strokeWidth={2}
              tappable={true}
              onPress={() => {
                Alert.alert("Room Info", `You clicked on ${properties.name}`);}}
            />
             <Marker coordinate={{ latitude: centerLat, longitude: centerLng }}>
             <TouchableOpacity
    onPress={() => Alert.alert("Room Info", `You clicked on ${properties.name}`)}
  >
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

        if (geometry.type === 'LineString') {
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
