import { Stack } from "expo-router";
import { StyleSheet } from "react-native";

export default function RootLayout() {

  return (
    <Stack >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="tabs" options={{ headerShown: false, title: "Back" }} />
      <Stack.Screen name="doctor/contactDetails" options={{ title: "Doctor's Details" }} />
      <Stack.Screen name="alerts/alertDetails" options={{ title: "Alert Details" }} />
      <Stack.Screen name="doctor/schedule" options={{ title: "Schedule" }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
});
