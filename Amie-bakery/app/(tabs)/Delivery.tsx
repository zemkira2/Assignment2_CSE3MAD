import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";

const deliveryItems = [
  { id: "1", numberId: "#001", address: "1 Kingsbury, bundoora, VIC" },
  { id: "2", numberId: "#002", address: "2 Kingsbury, bundoora, VIC" },
  { id: "3", numberId: "#003", address: "3 Kingsbury, bundoora, VIC" },
  { id: "4", numberId: "#004", address: "4 Kingsbury, bundoora, VIC" },
  { id: "5", numberId: "#005", address: "5 Kingsbury, bundoora, VIC" },
];

export default function Delivery() {
  const renderItem = ({
    item,
  }: {
    item: { numberId: string; address: string };
  }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "../OrderDetail",
          params: { numberId: item.numberId, address: item.address },
        })
      }
    >
      <View style={styles.card}>
        <Text style={styles.numberId}>NumberID: {item.numberId}</Text>
        <Text style={styles.address}>{item.address}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={deliveryItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5E9DA", // Light beige background
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#B5835E", // Brown color for the title
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
    elevation: 2, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
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
});
