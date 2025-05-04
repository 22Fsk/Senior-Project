import { Stack } from "expo-router";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import colors from "../components/ColorTamp";

export default function RootLayout() {

  return (
    <Stack >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="tabs/index" options={{ headerShown: false }} />
      <Stack.Screen name="doctor/contactDetails" options={{ title: "Doctor Details" }} />
      <Stack.Screen name="alerts/alertDetails" options={{ title: "Alert Details" }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
});
