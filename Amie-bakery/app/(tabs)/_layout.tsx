import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Image, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { View } from 'react-native';


export default function TabLayout() {
  return (
      <Tabs>
        <Tabs.Screen
          name="Product"
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => <IconSymbol name="Product" color={color} />,
          }}
        />
        <Tabs.Screen
          name="Delivery"
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => <IconSymbol name="Delivery" color={color} />,
          }}
        />
        <Tabs.Screen
          name="Order"
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => <IconSymbol name="Order" color={color} />,
          }}
        />
      </Tabs>
  );
}