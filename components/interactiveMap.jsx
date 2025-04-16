import React from 'react';
import { View } from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import floorMap from '../app/floors/level0'; // double-check path
import { Alert } from 'react-native';
import { Text } from 'react-native';
import { TouchableOpacity } from 'react-native';

const InteractiveMap = () => {
  return (
    <MapView
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
              fillColor="rgb(226, 228, 100)"
              strokeColor="rgb(174, 176, 48)"
              strokeWidth={1}
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

        return null;
      })}
    </MapView>
  );
};


export default InteractiveMap;
