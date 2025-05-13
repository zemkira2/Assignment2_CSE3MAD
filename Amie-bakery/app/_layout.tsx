import { Stack } from 'expo-router';
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="AddProductModal" options={{ presentation: "modal" }} />
      <Stack.Screen name="ư" options={{ headerShown: false }} />
    </Stack>
  );
}
