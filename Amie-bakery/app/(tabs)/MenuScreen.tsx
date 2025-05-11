import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
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
  const [userId] = useState("user1"); // In a real app, get this from your auth system

  const addToCart = async (item: MenuItem) => {
    try {
      // Update local state
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

      // Update Firebase
      const userCartRef = doc(db, "carts", userId);
      
      // Check if document exists
      const docSnap = await getDoc(userCartRef);
      
      if (docSnap.exists()) {
        // Update existing cart
        await updateDoc(userCartRef, {
          items: arrayUnion({ ...item, quantity: 1 })
        });
      } else {
        // Create new cart
        await setDoc(userCartRef, {
          items: [{ ...item, quantity: 1 }],
          userId: userId,
          createdAt: new Date()
        });
      }

      // Navigate to cart with updated items
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
      <View style={styles.menuItem}>
        <Image source={item.image} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>{item.price}$</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addToCart(item)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
        {quantity > 0 && <Text style={styles.quantityLabel}>{quantity}x</Text>}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/amie-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.dropdownContainer}>
        <Text style={styles.dropdownLabel}>Select Item:</Text>
        <Picker
          selectedValue={selectedItem}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedItem(itemValue)}
        >
          {menuItems.map((item) => (
            <Picker.Item key={item.id} label={item.name} value={item.id} />
          ))}
        </Picker>
        {selectedMenuItem && (
          <Text style={styles.selectedPrice}>
            Price: {selectedMenuItem.price}$
          </Text>
        )}
      </View>

      <FlatList
        data={menuItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    backgroundColor: "#c19a7a",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 100,
    height: 100,
  },
  dropdownContainer: {
    padding: 15,
    backgroundColor: "white",
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  selectedPrice: {
    fontSize: 16,
    marginTop: 10,
    color: "#888",
  },
  list: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "white",
    marginVertical: 1,
    alignItems: "center",
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
  },
  itemPrice: {
    fontSize: 14,
    color: "#888",
  },
  addButton: {
    width: 30,
    height: 30,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  quantityLabel: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default MenuScreen;