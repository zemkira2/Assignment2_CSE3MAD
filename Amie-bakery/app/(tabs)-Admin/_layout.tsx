import { Tabs } from 'expo-router';
import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <View style={styles.container}>
      {/* Logo at the top */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
        />
      </View>

      {/* Tabs */}
      <Tabs
        screenOptions={{
          tabBarStyle: styles.tabBarStyle,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="Product"
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => (
              <View
                style={[
                  styles.tabButton,
                ]}
              >
                <Image
                  source={require('../../assets/images/product-icon.png')}
                  style={[styles.icon, { tintColor: focused ? '#fff' : '#000' }]}
                />
                <Text style={{ color: focused ? '#fff' : '#000', fontSize: 12 }}>
                  Product
                </Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="Delivery"
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => (
              <View
                style={[
                  styles.tabButton,
                ]}
              >
                <Image
                  source={require('../../assets/images/user-icon.png')}
                  style={[styles.icon, { tintColor: focused ? '#fff' : '#000' }]}
                />
                <Text style={{ color: focused ? '#fff' : '#000', fontSize: 12 }}>
                  Delivery
                </Text>
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
    backgroundColor: '#F5E9DA', // Light beige
  },
  logoContainer: {
    backgroundColor: '#B5835E', // Brown header
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
    marginTop: 40,
    marginBottom: 20,
  },
  tabBarStyle: {
    flexDirection: 'row',
    backgroundColor: '#B5835E',
    height: 80,   
    justifyContent: 'center',
  },
  tabButton: {
    flex: 1,
    width: 180,
    height: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  icon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
});
