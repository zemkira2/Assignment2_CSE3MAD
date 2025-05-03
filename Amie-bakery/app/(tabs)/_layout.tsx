import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="product" options={{ title: 'Product' }} />
      <Tabs.Screen name="delivery" options={{ title: 'Delivery' }} />
      <Tabs.Screen name="order" options={{ title: 'Order' }} />
    </Tabs>
  );
}