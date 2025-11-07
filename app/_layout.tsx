import "../global.css";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { vars } from "nativewind";
import { memo, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Slot } from "expo-router";
import { openDatabase } from "../lib/db";
import { trySyncPendingAnalyses } from "../lib/sync";
import * as FileSystem from "expo-file-system";

export default function RootLayout() {
  useEffect(() => {
    // DB is opened 
    openDatabase()
      .then(async () => {
        try { await trySyncPendingAnalyses(); } catch {}
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.log(
            `SQLite path: ${FileSystem.documentDirectory}SQLite/pocketsalon.db`
          );
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

