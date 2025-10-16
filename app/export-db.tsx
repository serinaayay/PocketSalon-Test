import React from "react";
import { View, Text, Button, Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { openDatabase } from "../lib/db";

export default function ExportDbScreen() {
  React.useEffect(() => {
    // Ensure the DB file exists by opening/initializing it once
    openDatabase().catch(() => {});
  }, []);
  const onExport = React.useCallback(async () => {
    try {
      const sqliteDir = `${FileSystem.documentDirectory}SQLite`;
      const srcPath = `${sqliteDir}/pocketsalon.db`;

      const info = await FileSystem.getInfoAsync(srcPath);
      if (!info.exists) {
        Alert.alert("Database not found", `No DB at: ${srcPath}`);
        return;
      }

      const destPath = `${FileSystem.cacheDirectory}pocketsalon.db`;
      await FileSystem.copyAsync({ from: srcPath, to: destPath });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(destPath, { mimeType: "application/octet-stream" });
      } else {
        Alert.alert("Saved", `DB copied to: ${destPath}`);
      }
    } catch (err: any) {
      Alert.alert("Export failed", String(err?.message ?? err));
    }
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 20, marginBottom: 16 }}>Export SQLite Database</Text>
      <Text style={{ textAlign: "center", marginBottom: 16 }}>
        Tap the button to copy and share pocketsalon.db
      </Text>
      <Button title="Export DB" onPress={onExport} />
    </View>
  );
}


