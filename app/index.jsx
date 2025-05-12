import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native";
import { hp, wp } from '../helpers/common';
import { useRouter } from "expo-router";
import { theme } from '../constants/theme';
import { useEffect } from "react";
import * as Location from "expo-location";
import { TouchableOpacity } from "react-native";

export default function Index() {
  const router = useRouter();

  // Ask for location access permission
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }
  
      // Get the user's current location
      let location = await Location.getCurrentPositionAsync({});
      console.log(location);
    })();
  }, []);
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Smart Map</Text>
        <Text style={styles.punchline}>Find Your Way, Every Day</Text>
        <TouchableOpacity onPress={()=> router.push('/tabs')} style={styles.startButton}>
          <Text style={styles.startText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,  
    backgroundColor: 'rgb(94, 195, 253)',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',  
    alignItems: 'center',
    gap: 14,
    position: 'absolute',  
    bottom: '5%',
    width: '100%',
  },
  title: {
    fontSize: hp(12),
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.white,
    fontFamily: 'DancingScript-VariableFont_wght',
  },
  punchline: {
    fontSize: hp(4),
    letterSpacing: 1,
    marginBottom: 10,
    fontWeight: theme.fontWeights.medium,
    color: 'white',
    marginBottom: '60%',
  },
  startButton: {
    marginBottom: 50,
    backgroundColor: theme.colors.white,
    padding: 10,
    paddingHorizontal: 80,
    borderRadius: "4%",
    borderCurve: 'continuous',
    top: 10,
  },
  startText: {
    color: theme.colors.black,
    fontSize: hp(5.5),
    fontWeight: theme.fontWeights.medium,
    letterSpacing: 1,
  },
});
