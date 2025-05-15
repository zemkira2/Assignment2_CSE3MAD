import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import { useFocusEffect } from "@react-navigation/native";

interface Order {
  id: string;
  userEmail: string;
  address: string;
  numberId: string;
  items: any[];
  quantity: number;
  subtotal: number;
  status: string;
}

export default function Delivery() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const usersSnapshot = await getDocs(collection(db, "orders"));
      console.log("Fetched orders snapshot size:", usersSnapshot.size);
      usersSnapshot.forEach((doc) => {
        console.log("Order document ID (email):", doc.id);
      });
      if (usersSnapshot.empty) {
        console.log("No users found in the orders collection.");
        setOrders([]);
        return;
      }
      const allOrders: Order[] = [];
      for (const userDoc of usersSnapshot.docs) {
        const userEmail = userDoc.id;
        console.log("Fetching orders for user:", userEmail);
        const userOrdersSnapshot = await getDocs(
          collection(db, "orders", userEmail, "userOrder")
        );
        userOrdersSnapshot.forEach((orderDoc) => {
          const data = orderDoc.data();
          allOrders.push({
            id: orderDoc.id,
            userEmail: userEmail,
            address: data.address || "Unknown Address",
            numberId: data.numberId || "Unknown Order ID",
            items: data.items || [],
            quantity: data.quantity || 0,
            subtotal: data.subtotal || 0,
            status: data.status || "Unknown Status",
          });
        });
      }
      console.log("Fetched orders:", allOrders);
      setOrders(allOrders);
      console.log("Orders state updated:", orders);
    } catch (error) {
      console.error("Error fetching all orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAllOrders();
    }, [])
  );

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "../orderDetail",
          params: { numberId: item.numberId, address: item.address },
        })
      }
    >
      <View style={styles.card}>
        <Text style={styles.numberId}>OrderID: {item.numberId}</Text>
        <Text style={styles.address}>{item.address}</Text>
        <Text style={styles.email}>User: {item.userEmail}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#B5835E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id + item.userEmail}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5E9DA",
    padding: 10,
  },
  listContainer: {
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 5,
    flex: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  numberId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  address: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  email: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
});
