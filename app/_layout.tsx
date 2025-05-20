import "../global.css";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { vars } from "nativewind";
import { memo, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Slot />
    </View>
  );
}