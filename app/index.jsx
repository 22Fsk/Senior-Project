import { StatusBar } from "expo-status-bar";
import { Text, View, Image, Pressable } from "react-native";
import { StyleSheet } from "react-native";
import { hp, wp } from '../helpers/common';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../constants/theme';
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* Linear Gradient
      <LinearGradient
        colors={['rgba(2, 79, 62, 0.1)', 'rgba(2, 79, 62, 0.5)', 'rgba(2, 79, 62, 0.7)', '#024f3e']}
        style={styles.gradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.8 }}
      /> */}
      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Smart Map</Text>
        <Text style={styles.punchline}>Find Your Way, Every Day</Text>
        <Pressable onPress={()=> router.push('/tabs')} style={styles.startButton}>
          <Text style={styles.startText}>Get Started</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,  // Make sure container takes up the full screen
    backgroundColor: '#024f3e',
  },
  imageContainer: {
    position: 'absolute',  // Keeps the image at the top layer
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,  // Makes the container take up the full height of the screen
  },
  bgImage: {
    width: '100%',  // Makes sure the image fills the width
    height: '100%',  // Makes sure the image fills the height
  },
  gradient: {
    width: wp(100),
    height: hp(80),
    position: 'absolute',
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',  // Align content at the bottom
    alignItems: 'center',
    gap: 14,
    position: 'absolute',  // Keep content above the image
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
