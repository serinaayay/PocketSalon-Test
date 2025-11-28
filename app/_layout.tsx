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

// Type declaration for React Native's ErrorUtils
declare const ErrorUtils: {
  getGlobalHandler?: () => ((error: any, isFatal?: boolean) => void) | undefined;
  setGlobalHandler?: (handler: (error: any, isFatal?: boolean) => void) => void;
};

export default function RootLayout() {
  useEffect(() => {
    // Suppress the known react-native-svg layout event error
    const originalErrorHandler = ErrorUtils.getGlobalHandler?.();
    if (ErrorUtils.setGlobalHandler) {
      ErrorUtils.setGlobalHandler((error: any, isFatal?: boolean) => {
        if (error?.message?.includes('topSvgLayout') || error?.message?.includes('Unsupported top level event type')) {
          // Suppress this known non-fatal SVG error
          return;
        }
        // Call the original error handler for other errors
        if (originalErrorHandler) {
          originalErrorHandler(error, isFatal);
        }
      });
    }

    // Also suppress console errors for this specific issue
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      const errorMessage = args.join(' ');
      if (errorMessage.includes('topSvgLayout') || errorMessage.includes('Unsupported top level event type')) {
        // Suppress this known non-fatal SVG error
        return;
      }
      originalConsoleError.apply(console, args);
    };

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

