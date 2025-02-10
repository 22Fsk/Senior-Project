import React from 'react';
import { View, StyleSheet } from 'react-native';
import InteractiveMap from '../../components/interactiveMap';

export default function App() {
  return (
    <View style={styles.container}>
      <InteractiveMap />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
