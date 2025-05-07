import { Stack } from "expo-router";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import colors from "../components/ColorTamp";

export default function RootLayout() {

  return (
    <Stack >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="tabs/index" options={{ headerShown: false }} />
      <Stack.Screen name="tabs" options={{ headerShown: false, title: "Back" }} />
      <Stack.Screen name="doctor/contactDetails" options={{ title: "Doctor's Details" }} />
      <Stack.Screen name="alerts/alertDetails" options={{ title: "Alert Details" }} />
      <Stack.Screen name="doctor/schedule" options={{ title: "Schedule" }} />
      <Stack.Screen name="doctor" options={{ headerShown: false, title: "Back" }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
});
