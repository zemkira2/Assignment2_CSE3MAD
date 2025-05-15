import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)-Admin" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)-Customer" options={{ headerShown: false }} />
      <Stack.Screen name="AddProductModal" options={{ presentation: "modal" }} />
      <Stack.Screen name="UpdateProductModal" options={{ presentation: "modal" }} />
      <Stack.Screen name="AddToCartScreen" options={{ presentation: "modal"}} />
      <Stack.Screen name="orderDetail" options={{ title: "Order Detail" }} />
    </Stack>
  );
}