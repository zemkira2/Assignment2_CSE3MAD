import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Linking,
  Image,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";

export default function OrderDetail() {
  const { numberId, address } = useLocalSearchParams();
  const [region, setRegion] = useState(null);

  const openInMaps = () => {
    const url = Platform.select({
      ios: `http://maps.apple.com/?daddr=${encodeURIComponent(address as string)}`,
      android: `http://maps.google.com/?daddr=${encodeURIComponent(address as string)}`,
    });
    if (url) Linking.openURL(url);
  };

  useEffect(() => {
    (async () => {
      try {
        const geocoded = await Location.geocodeAsync(address as string);
        if (geocoded.length > 0) {
          const { latitude, longitude } = geocoded[0];
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      } catch (error) {
        console.error("Failed to geocode address:", error);
      }
    })();
  }, [address]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Order details</Text>

      <View style={styles.orderInfo}>
        <Text style={styles.orderId}>NumberID: {numberId}</Text>
        <Text style={styles.date}>Date: 27/3/2025</Text>

        <View style={styles.items}>
          <Text style={styles.item}>
            2x Banh mi <Text style={styles.price}>$100</Text>
          </Text>
          <Text style={styles.item}>
            3x Carrot <Text style={styles.price}>$200</Text>
          </Text>
          <Text style={styles.item}>
            5x Potato cake <Text style={styles.price}>$300</Text>
          </Text>
          <Text style={styles.item}>
            3x Pork <Text style={styles.price}>$500</Text>
          </Text>
          <Text style={styles.item}>
            5x pate <Text style={styles.price}>$400</Text>
          </Text>
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>$1500</Text>
        </View>
      </View>

      <View style={styles.addressContainer}>
        <Text style={styles.addressTitle}>Address</Text>
        <Text style={styles.address}>{address}</Text>
      </View>

      {region && (
        <MapView style={styles.map} initialRegion={region}>
          <Marker coordinate={region} title="Delivery Location" />ư
        </MapView>
      )}

      <TouchableOpacity onPress={openInMaps} style={styles.navigateButton}>
        <Text style={styles.navigateButtonText}>Open in Maps</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.finishButton}>
        <Text style={styles.finishButtonText}>FINISH</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5E9DA",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
    marginTop: 40,
  },
  orderInfo: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  items: {
    marginBottom: 10,
  },
  item: {
    fontSize: 14,
    marginBottom: 5,
  },
  price: {
    fontWeight: "bold",
    color: "#000",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#B5835E",
  },
  addressContainer: {
    marginBottom: 10,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  address: {
    fontSize: 14,
    color: "#555",
  },
  map: {
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  navigateButton: {
    backgroundColor: "#4285F4",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  navigateButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  finishButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  finishButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
