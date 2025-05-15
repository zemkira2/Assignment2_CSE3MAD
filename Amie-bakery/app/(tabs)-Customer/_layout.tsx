import { Tabs } from "expo-router";
import React from "react";
import { View, Image, StyleSheet } from "react-native";

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/amie-logo.png")}
          style={styles.logo}
        />
      </View>
      <Tabs
        screenOptions={{
          tabBarStyle: styles.tabBarStyle,
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "#000",
          tabBarLabelStyle: styles.tabBarLabel,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="MenuScreen"
          options={{
            title: "Product",
            tabBarIcon: ({ color, focused }) => (
              <View style={[styles.iconContainer]}>
                <Image
                  source={require("../../assets/profile-icon.png")}
                  style={[
                    styles.icon,
                    { tintColor: focused ? "#fff" : "#000" },
                  ]}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="CartScreen"
          options={{
            title: "Your Cart",
            tabBarIcon: ({ color, focused }) => (
              <View style={[styles.iconContainer]}>
                <Image
                  source={require("../../assets/profile-icon.png")}
                  style={[
                    styles.icon,
                    { tintColor: focused ? "#fff" : "#000" },
                  ]}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="OrderHistoryScreen"
          options={{
            title: "Order History",
            tabBarIcon: ({ color, focused }) => (
              <View style={[styles.iconContainer]}>
                <Image
                  source={require("../../assets/profile-icon.png")}
                  style={[
                    styles.icon,
                    { tintColor: focused ? "#fff" : "#000" },
                  ]}
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
    backgroundColor: "#F5E9DA",
  },
  logoContainer: {
    backgroundColor: "#B5835E",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 130,
    height: 130,
    resizeMode: "contain",
    marginTop: 40,
    marginBottom: 20,
  },
  tabBarStyle: {
    backgroundColor: "#B5835E",
    borderTopWidth: 0,
    height: 80,
    paddingBottom: 5,
  },
  tabBarLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: -2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 26,
    height: 26,
    resizeMode: "contain",
  },
});
