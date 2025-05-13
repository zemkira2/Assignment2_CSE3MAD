import { Tabs } from 'expo-router';
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <View style={styles.container}>
      {/* Add the logo at the top */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/amie-logo.png')} // Update the path to your logo
          style={styles.logo}
        />
      </View>
      {/* Tab navigation */}
      <Tabs
        screenOptions={{
          tabBarStyle: styles.tabBarStyle,
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#000',
          tabBarLabelStyle: styles.tabBarLabel,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="MenuScreen"
          options={{
            title: 'Product',
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: focused ? '#000' : 'transparent' }, // Black background when active
                ]}
              >
                <Image
                  source={require('../../assets/profile-icon.png')} // Replace with your product icon
                  style={[styles.icon, { tintColor: focused ? '#fff' : '#000' }]} // White icon when active, black when inactive
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="CartScreen"
          options={{
            title: 'Your Cart',
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: focused ? '#000' : 'transparent' }, // Black background when active
                ]}
              >
                <Image
                  source={require('../../assets/profile-icon.png')} // Replace with your cart icon
                  style={[styles.icon, { tintColor: focused ? '#fff' : '#000' }]} // White icon when active, black when inactive
                />
              </View>
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E9DA', // Light beige background
  },
  logoContainer: {
    backgroundColor: '#B5835E', // Brown background for the logo section
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 130, // Slightly larger logo for better visibility
    height: 130,
    resizeMode: 'contain', // Ensure the logo maintains its aspect ratio
    marginTop: 40, // Add some margin at the top for spacing
    marginBottom: 20, // Add some margin at the bottom for spacing
  },
  tabBarStyle: {
    backgroundColor: '#B5835E', // Brown background for the tab bar
    borderTopWidth: 0, // Remove the border for a cleaner look
    height: 80, // Slightly increased height for better spacing
    paddingBottom: 5, // Add padding for better alignment of icons and labels
  },
  tabBarLabel: {
    fontSize: 13, // Slightly larger font size for better readability
    fontWeight: '600', // Use semi-bold for a cleaner look
    marginTop: -2, // Adjust spacing between the icon and label
  },
  iconContainer: {
    width: 40, // Container width for the icon
    height: 40, // Container height for the icon
    borderRadius: 20, // Make the container circular
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 26, // Slightly larger icon size for better visibility
    height: 26,
    resizeMode: 'contain', // Ensure icons maintain their aspect ratio
  },
});