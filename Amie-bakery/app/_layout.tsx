import { Stack } from 'expo-router';
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="AddProductModal" options={{ presentation: "modal" }} />
      <Stack.Screen name="OrderDetail" options={{ headerShown: false }} />
    </Stack>
  );
}
