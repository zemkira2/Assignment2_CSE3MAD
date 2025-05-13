import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { MenuItem } from "../types";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

interface GroupedItem extends MenuItem {
  quantity: number;
}

const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Banh Mi Heo Quay",
    price: 11,
    image: require("../../assets/banh-mi.jpg"),
  },
  {
    id: "2",
    name: "Banh Mi Ga Nuong",
    price: 12,
    image: require("../../assets/banh-mi.jpg"),
  },
  {
    id: "3",
    name: "Banh Mi Thit Nuong",
    price: 13,
    image: require("../../assets/banh-mi.jpg"),
  },
];

const MenuScreen = () => {
  const userId = "user1";

  const addToCart = async (item: MenuItem) => {
    try {
      const userCartRef = doc(db, "carts", userId);
      const docSnap = await getDoc(userCartRef);
      let updatedItems: GroupedItem[] = [];

      if (docSnap.exists()) {
        const existingItems = docSnap.data().items as GroupedItem[];
        const index = existingItems.findIndex((i) => i.id === item.id);
        if (index !== -1) {
          existingItems[index].quantity += 1;
        } else {
          existingItems.push({ ...item, quantity: 1 });
        }
        updatedItems = existingItems;
      } else {
        updatedItems = [{ ...item, quantity: 1 }];
      }

      await setDoc(userCartRef, { items: updatedItems }, { merge: true });

      // Navigate with dummy param to trigger CartScreen re-render
      router.navigate({
        pathname: "/(tabs)/CartScreen",
        params: { updated: Date.now().toString() },
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>{item.price}$</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => addToCart(item)}
      >
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.MainContainer}>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={renderMenuItem}
        contentContainerStyle={styles.container}
      />
    </SafeAreaView>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: "#F5E9DA",
  },
  container: {
    padding: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: "#b47b51",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
