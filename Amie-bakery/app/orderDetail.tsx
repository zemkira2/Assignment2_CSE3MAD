import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Linking,
  ScrollView,
  Alert,
  Pressable,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { MenuItem as BaseMenuItem } from "./types";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./Firebase";
import Modal from "react-native-modal";

interface MenuItem extends BaseMenuItem {
  quantity: number;
}

export default function OrderDetail() {
  const { numberId, address, email, items, subtotal, status, orderdate } =
    useLocalSearchParams<{
      numberId: string;
      address: string;
      email: string;
      items: string;
      subtotal: string;
      status: string;
      orderdate: string;
    }>();

  const [region, setRegion] = useState(null);
  const [parsedItems, setParsedItems] = useState<MenuItem[]>([]);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);

  const openInMaps = () => {
    const url = Platform.select({
      ios: `http://maps.apple.com/?daddr=${encodeURIComponent(address)}`,
      android: `http://maps.google.com/?daddr=${encodeURIComponent(address)}`,
    });
    if (url) Linking.openURL(url);
  };

  // ✅ Ask for permission before geocoding
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location access is required to show map.");
        return;
      }

      try {
        const geocoded = await Location.geocodeAsync(address);
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

  useEffect(() => {
    try {
      if (items) {
        const parsed = typeof items === "string" ? JSON.parse(items) : items;
        setParsedItems(parsed as MenuItem[]);
      }
    } catch (e) {
      console.error("Failed to parse items:", e);
    }
  }, [items]);

  const displayTotal = Number(subtotal) || 0;

  const handleFinishOrder = async () => {
    try {
      await updateDoc(
        doc(db, "orders", email, "userOrder", numberId),
        { status: "Finished" }
      );
      setCurrentStatus("Finished");
      Alert.alert("Success", "Order marked as Finished.");
      router.back();
    } catch (error) {
      console.error("Error updating status:", error);
      Alert.alert("Error", "Failed to update order status.");
    }
  };

  const renderMapContent = () => (
    <>
      <Marker coordinate={region} title="Delivery Location" />
    </>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Order Details</Text>

      <View style={styles.orderInfo}>
        <Text style={styles.orderId}>OrderID: {numberId}</Text>
        <Text style={styles.email}>User: {email}</Text>
        <Text style={styles.status}>Status: {currentStatus}</Text>
        <Text style={styles.date}>
          {orderdate
            ? new Date(orderdate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Unknown Date"}
        </Text>

        <ScrollView style={styles.itemsScroll} nestedScrollEnabled={true}>
          {parsedItems.length > 0 ? (
            parsedItems.map((item, index) => (
              <Text key={index} style={styles.item}>
                {item.quantity}x {item.name}{" "}
                <Text style={styles.price}>${item.price}</Text>
              </Text>
            ))
          ) : (
            <Text style={styles.item}>No menu items found.</Text>
          )}
        </ScrollView>

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>${displayTotal.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.addressContainer}>
        <Text style={styles.addressTitle}>Address</Text>
        <Text style={styles.address}>{address}</Text>
      </View>

      {region && (
        <TouchableOpacity onPress={() => setIsMapModalVisible(true)} activeOpacity={0.9}>
          <MapView style={styles.map} initialRegion={region} pointerEvents="none">
            {renderMapContent()}
          </MapView>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={openInMaps} style={styles.navigateButton}>
        <Text style={styles.navigateButtonText}>Open in Maps</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.finishButton} onPress={handleFinishOrder}>
        <Text style={styles.finishButtonText}>FINISH</Text>
      </TouchableOpacity>

      <Modal
        isVisible={isMapModalVisible}
        onBackdropPress={() => setIsMapModalVisible(false)}
        onSwipeComplete={() => setIsMapModalVisible(false)}
        swipeDirection="down"
        style={styles.modal}
        useNativeDriver={true}
      >
        <View style={styles.modalContent}>
          <MapView style={styles.modalMap} initialRegion={region}>
            {renderMapContent()}
          </MapView>
          <Pressable style={styles.closeButton} onPress={() => setIsMapModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close Map</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5E9DA", padding: 20 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
    marginTop: 50,
  },
  orderInfo: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: 260,
  },
  orderId: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  email: { fontSize: 15, marginBottom:  6, color: "#555" },
  status: { fontSize: 15, color: "#B5835E", marginBottom: 6 },
  date: { fontSize: 15, color: "#777", marginBottom: 12 },
  itemsScroll: { maxHeight: 200, marginBottom: 12 },
  item: { fontSize: 15, marginBottom: 6, color: "#444" },
  price: { fontWeight: "600", color: "#000" },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  totalLabel: { fontSize: 17, fontWeight: "600", color: "#000" },
  totalPrice: { fontSize: 17, fontWeight: "bold", color: "#B5835E" },
  addressContainer: { marginBottom: 10 },
  addressTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  address: { fontSize: 14, color: "#555" },
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
  modal: { margin: 0, justifyContent: "flex-end" },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    height: "90%",
  },
  modalMap: { flex: 1, width: "100%" },
  closeButton: { padding: 16, backgroundColor: "#333", alignItems: "center" },
  closeButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
