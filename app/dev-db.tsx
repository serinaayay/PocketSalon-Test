import React from "react";
import { View, Text, FlatList, RefreshControl, StyleSheet } from "react-native";
import { listSuggestedProducts, type SuggestedProduct, openDatabase } from "../lib/db";

export default function DevDbScreen() {
  if (!__DEV__) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Not available in production</Text>
      </View>
    );
  }

  const [items, setItems] = React.useState<SuggestedProduct[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const load = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await openDatabase();
      const rows = await listSuggestedProducts();
      setItems(rows);
    } finally {
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>suggested_products</Text>
      <FlatList
        data={items}
        keyExtractor={(it) => String(it.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.cell}>#{item.id}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.title}</Text>
              {item.hairType ? <Text style={styles.meta}>hairType: {item.hairType}</Text> : null}
              {item.createdAt ? (
                <Text style={styles.meta}>{new Date(item.createdAt).toLocaleString()}</Text>
              ) : null}
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.meta}>No rows yet</Text>}
      />
      <Text style={styles.path}>
        DB path (device): FileSystem.documentDirectory + "SQLite/pocketsalon.db"
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  title: { fontSize: 18, fontWeight: "600" },
  row: { flexDirection: "row", alignItems: "flex-start", gap: 12, paddingVertical: 8 },
  cell: { width: 48, color: "#666" },
  name: { fontSize: 16 },
  meta: { color: "#666" },
  path: { marginTop: 8, color: "#666" },
});


