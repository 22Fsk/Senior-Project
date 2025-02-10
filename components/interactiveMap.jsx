import React from 'react';
import SvgPanZoom from 'react-native-svg-pan-zoom';
import IndoorMap from '../assets/images/map.svg';
import { Alert } from 'react-native';

export default function InteractiveMap() {
  const handleRoomPress = (roomName) => {
    Alert.alert("Room Selected", `You tapped on ${roomName}`);
  };

  return (
    <SvgPanZoom
      canvasWidth={500}
      canvasHeight={500}
      minScale={1}
      maxScale={7}
    >
      <IndoorMap width="500" height="500" />

      {/* Example: Clickable Room (Change coordinates based on your map) */}
      <IndoorMap
        width="500"
        height="500"
        onPress={() => handleRoomPress('Room A')}
      />
    </SvgPanZoom>
  );
}
