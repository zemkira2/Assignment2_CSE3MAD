import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { MenuItem } from "../types";
import { doc, setDoc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
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
  const [groupedCart, setGroupedCart] = useState<GroupedItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>(menuItems[0].id);
  const [modalVisible, setModalVisible] = useState(false);
  const [userId] = useState("user1");

  const addToCart = async (item: MenuItem) => {
    try {
      const existing = groupedCart.find((i) => i.id === item.id);
      let newGroupedCart: GroupedItem[];

      if (existing) {
        newGroupedCart = groupedCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        newGroupedCart = [...groupedCart, { ...item, quantity: 1 }];
      }
      setGroupedCart(newGroupedCart);

      const userCartRef = doc(db, "carts", userId);
      const docSnap = await getDoc(userCartRef);

      if (docSnap.exists()) {
        await updateDoc(userCartRef, {
          items: arrayUnion({ ...item, quantity: 1 }),
        });
      } else {
        await setDoc(userCartRef, {
          items: [{ ...item, quantity: 1 }],
          userId: userId,
          createdAt: new Date(),
        });
      }

      const flatCart = newGroupedCart.flatMap((i) =>
        Array(i.quantity).fill({ ...i, quantity: undefined })
      );

      router.navigate({
        pathname: "/(tabs)/CartScreen",
        params: { cart: JSON.stringify(flatCart) },
      });
    } catch (error) {
      console.error("Error adding to cart: ", error);
    }
  };

  const selectedMenuItem = menuItems.find((item) => item.id === selectedItem);

  const renderMenuItem = ({ item }: { item: MenuItem }) => {
    const group = groupedCart.find((g) => g.id === item.id);
    const quantity = group ? group.quantity : 0;

    return (
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
        {quantity > 0 && <Text style={styles.quantity}>{quantity}x</Text>}
      </View>
    );
  };

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
  logoContainer: {
    backgroundColor: "#B5835E",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
    paddingBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    backgroundColor: "#fff",
    borderRadius: 60,
  },
  dropdownContainer: {
    padding: 15,
    backgroundColor: "white",
    marginHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  dropdown: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 6,
  },
  selectedPrice: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
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
  quantity: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "bold",
    color: "#444",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalItem: {
    paddingVertical: 10,
  },
});