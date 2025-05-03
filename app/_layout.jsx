import { Stack } from "expo-router";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import colors from "../components/ColorTamp";

export default function RootLayout() {

  return (
    <Stack >
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
});
