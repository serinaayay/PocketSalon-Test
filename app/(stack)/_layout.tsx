import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="natural-remedies" />
      <Stack.Screen name="homepage" />
      <Stack.Screen name="ResultsScreen" />
      <Stack.Screen name="hair-detection" />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
} 