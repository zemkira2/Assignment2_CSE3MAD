import React, { useState, useEffect } from "react";
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../CustomerSide/firebase";
import { MenuItem as BaseMenuItem } from "../CustomerSide/types";

interface MenuItem extends BaseMenuItem {
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  Item: MenuItem[];
  quantity: number;
}

const OrderHistoryScreen = () => {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const fetchOrderHistory = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, "orders", "user1", "userOrder")
      );
      const fetchedOrders: Order[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedOrders.push({
          id: doc.id,
          date: data.createdAt?.toDate().toLocaleDateString() || "Unknown Date",
          total: data.subtotal || 0,
          status: data.status || "Unknown",
          Item: data.items || [],
          quantity: data.quantity || 0,
        });
      });

      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching order history:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrderHistory();
    }, [])
  );

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => toggleOrderDetails(item.id)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.orderNumber}>{item.id.slice(0, 4)}</Text>
        <View style={styles.orderInfo}>
          <Text style={styles.orderText}>Date: {item.date}</Text>
        </View>
        <Text style={styles.total}>{item.total}$</Text>
        <Text
          style={[
            styles.status,
            item.status === "Delivering" ? styles.delivering : styles.finished,
          ]}
        >
          {item.status}
        </Text>
      </View>
      {expandedOrder === item.id && (
        <View style={styles.expandedDetails}>
          <Text style={styles.detailsText}>Order Id:{item.id}</Text>
          {item.Item.map((menuItem) => (
            <View key={menuItem.id} style={{ marginVertical: 5 }}>
              <Text style={styles.detailsText}>
                {menuItem.name} - {menuItem.price}$ x {menuItem.quantity}
              </Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Order History</Text>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

export default OrderHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5E9DA",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    padding: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#eee",
    textAlign: "center",
    lineHeight: 30,
    fontWeight: "bold",
    marginRight: 10,
  },
  orderInfo: {
    flex: 1,
  },
  orderText: {
    fontSize: 14,
    color: "#333",
  },
  total: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
  },
  delivering: {
    color: "#d9534f",
  },
  finished: {
    color: "#5cb85c",
  },
  expandedDetails: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  detailsText: {
    fontSize: 14,
    color: "#666",
  },
});
