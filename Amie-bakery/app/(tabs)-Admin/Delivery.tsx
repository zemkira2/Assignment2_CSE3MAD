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
import { MenuItem as BaseMenuItem } from "../types";

interface MenuItem extends BaseMenuItem {
  quantity: number;
}
interface Order {
  orderdate: string;
  userEmail: string;
  address: string;
  numberId: string;
  items: BaseMenuItem[];
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
      const userSnapshot = await getDocs(collection(db, "users"));
      if (userSnapshot.empty) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const emails: string[] = [];
      userSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.role !== "admin" && data.email) {
          emails.push(data.email);
        }
      });

      const allOrders: Order[] = [];
      for (const userEmail of emails) {
        const orderSnapshot = await getDocs(
          collection(db, "orders", userEmail, "userOrder")
        );
        orderSnapshot.forEach((orderDoc) => {
          const data = orderDoc.data();
          allOrders.push({
            userEmail,
            orderdate: data.createdAt?.toDate().toLocaleDateString() || "Unknown Date",
            address: data.address || "Unknown Address",
            numberId: orderDoc.id || "Unknown Order ID",
            items: data.items || [],
            quantity: data.quantity || 0,
            subtotal: data.subtotal || 0,
            status: data.status || "Unknown Status",
          });
        });
      }

      allOrders.sort((a, b) => {
        const statusOrder = a.status === "Finished" ? 1 : -1;
        if (a.status !== b.status) return statusOrder;
        return b.numberId.localeCompare(a.numberId);
      });

      setOrders(allOrders);
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

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "finished":
        return { backgroundColor: "#4CAF50" };
      case "pending":
        return { backgroundColor: "#FFA726" };
      default:
        return { backgroundColor: "#BDBDBD" };
    }
  };

  const renderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "../orderDetail",
          params: {
            numberId: item.numberId,
            address: item.address,
            email: item.userEmail,
            items: JSON.stringify(item.items),
            subtotal: item.subtotal,
            status: item.status,
            orderdate: item.orderdate,
          },
        })
      }
    >
      <View style={styles.cardRow}>
        <View style={styles.cardLeft}>
          <Text style={styles.numberId}>OrderID: {item.numberId}</Text>
          <Text style={styles.address}>{item.address}</Text>
          <Text style={styles.email}>User: {item.userEmail}</Text>
        </View>
        <View style={styles.cardRight}>
          <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
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
        keyExtractor={(item) => item.numberId + item.userEmail}
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
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  cardLeft: {
    flex: 1,
  },
  cardRight: {
    marginLeft: 12,
    alignItems: "flex-end",
  },
  numberId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: "#444",
  },
  email: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  statusBadge: {
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  statusText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
    textTransform: "capitalize",
  },
});
