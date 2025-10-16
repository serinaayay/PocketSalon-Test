import "../global.css";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { vars } from "nativewind";
import { memo, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Slot } from "expo-router";
import { openDatabase, listSuggestedProducts } from "../lib/db";
import * as FileSystem from "expo-file-system";

export default function RootLayout() {
  useEffect(() => {
    // DB is opened 
    openDatabase()
      .then(async () => {
        if (__DEV__) {
          try {
            const rows = await listSuggestedProducts({ limit: 50 });
            // Print a developer-only table of current rows to the Metro console
            // so devs can see contents without a new screen.
            // Note: this only runs in development.
            // eslint-disable-next-line no-console
            console.table(rows);
            // Also log the expected on-device DB path for reference.
            // eslint-disable-next-line no-console
            console.log(
              `SQLite path: ${FileSystem.documentDirectory}SQLite/pocketsalon.db`
            );
          } catch (e) {
            console.warn("Failed to list suggested_products", e);
          }
        }
      })
      .catch((err) => console.warn("DB init failed", err));
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <Slot />
    </View>
  );
}

