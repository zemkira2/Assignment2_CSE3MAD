import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Image, StyleSheet } from 'react-native';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { View } from 'react-native';
const styles = StyleSheet.create({
  logo:{
    marginTop:60,
    margin:"auto",
    width: 120,
    height: 120,
  },
  tabBarStyle: {
    backgroundColor: '#B5835E', // Match the brown color in the screenshot
    borderTopWidth: 0,
    height: 70,
    paddingBottom: Platform.OS === 'android' ? 10 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5E9DA', // Light beige background
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:10
  },  
});

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
      </View>

      {/* Tabs Section */}
      <Tabs
        screenOptions={{
          tabBarStyle: styles.tabBarStyle, // Style the tab bar
          tabBarActiveTintColor: '#fff', // White active tab color
          tabBarInactiveTintColor: '#F5E9DA', // Light beige for inactive tabs
          headerShown: false, // Hide the header for all screens
        }}
      >
        <Tabs.Screen
          name="AddProduct"
          options={{
            title: 'Product',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="cube.box.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="Order"
          options={{
            title: 'Order',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="cart.fill" color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}
