import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)-admin" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)-customer" options={{ headerShown: false }} />
      <Stack.Screen name="add-product-modal" options={{ presentation: "modal" }} />
      <Stack.Screen name="update-product-modal" options={{ presentation: "modal" }} />
      <Stack.Screen name="add-to-cart-screen" options={{ headerShown: false }} />
      <Stack.Screen name="order-detail" options={{ title: "Order Detail" }} />
    </Stack>
  );
}